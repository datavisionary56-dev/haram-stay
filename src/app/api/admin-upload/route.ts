import { NextResponse } from 'next/server';
import { db, app } from '@/lib/firebase';
import { collection, getDocs, updateDoc, addDoc, doc, query, where } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const hotelId = formData.get('hotelId') as string;
    const newHotelName = formData.get('newHotelName') as string | null;
    const pricesStr = formData.get('prices') as string;
    const prices = pricesStr ? JSON.parse(pricesStr) : null;
    const files = formData.getAll('files') as File[];
    
    console.log("🚀 Admin Upload Request:", { hotelId, newHotelName, filesCount: files.length });

    const projectRoot = process.cwd();
    const hotelsRef = collection(db, "hotels");

    let targetHotelName = "";
    let isNewHotel = false;
    let folderName = "";

    // 1. Determine Target Hotel & Folder
    if (hotelId === 'new_hotel') {
        if (!newHotelName) throw new Error("اسم الفندق الجديد مطلوب");
        targetHotelName = newHotelName;
        isNewHotel = true;
        // Simple sanitization for folder name
        folderName = newHotelName.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
        if (!folderName) folderName = "new_hotel_" + Date.now();
    } else {
        // Existing hotels mapping
        if (hotelId === 'fairmont') {
            targetHotelName = "فندق فيرمونت مكة";
            folderName = "fairmont";
        } else if (hotelId === 'dar_al_wafideen') {
            targetHotelName = "فندق دار الوافدين";
            folderName = "dar_al_wafideen";
        } else {
            targetHotelName = hotelId;
            folderName = hotelId;
        }
    }

    // 2. Create Directory in public/images/
    const publicDir = path.join(projectRoot, "public", "images", folderName);
    if (!fs.existsSync(publicDir)) {
        console.log(`📂 Creating new directory: ${publicDir}`);
        fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // 2.5 Process Images (WebP + Resize)
    const newImagePaths: string[] = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
            const filePath = path.join(publicDir, fileName);
            
            // Resize to max 1920 width, convert to webp, quality 80
            await sharp(buffer)
                .resize({ width: 1920, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(filePath);
                
            newImagePaths.push(`/images/${folderName}/${fileName}`);
        }
    }

    // 3. Prepare Update Data
    const updateData: any = {
        name: targetHotelName,
        // Add timestamp to force refresh if needed
        updatedAt: new Date().toISOString()
    };

    if (prices) {
        if (prices.nightly) updateData.price = Number(prices.nightly);
        
        // Construct basic pricing rules structure if we have prices
        updateData.pricingRules = {
            commission: 0,
            ranges: []
        };

        // Add standard range
        updateData.pricingRules.ranges.push({
            start: prices.startDate || new Date().toISOString().split('T')[0],
            end: prices.endDate || "2025-12-31", // Long term default
            weekdayPrice: Number(prices.nightly || 0),
            weekendPrice: Number(prices.weekend || prices.nightly || 0),
            extraBed: Number(prices.extraBedPrice || 0),
            notes: "السعر الأساسي"
        });

        // Add Last 10 Days Package if provided
        if (prices.last10) {
            updateData.pricingRules.ranges.push({
                start: "2024-03-31", // Example dates for Ramadan
                end: "2024-04-09",
                isPackage: true,
                packagePrice: Number(prices.last10),
                notes: "باقة العشر الأواخر"
            });
        }
    }

    // 4. Update or Create in Firestore
    let resultId = "";
    let message = "";

    if (isNewHotel) {
        // Create new document
        const newDoc = await addDoc(hotelsRef, {
            ...updateData,
            images: newImagePaths.length > 0 ? newImagePaths : [], 
            description: "تم إنشاء الفندق جديد عبر لوحة التحكم",
            location: "مكة المكرمة",
            city: "مكة المكرمة",
            stars: 0
        });
        resultId = newDoc.id;
        message = `تم إنشاء فندق "${targetHotelName}" بنجاح في قاعدة البيانات.`;
    } else {
        // Update existing
        // Find hotel by name or ID logic
        let targetDoc = null;
        const q = query(hotelsRef);
        const snapshot = await getDocs(q);

        for (const d of snapshot.docs) {
            const data = d.data();
            // Fuzzy match for name or exact match for folder/id
            if ((data.name && data.name.includes(targetHotelName)) || d.id === hotelId) {
                targetDoc = d;
                break;
            }
        }

        if (targetDoc) {
            // Merge new images with existing ones if any
            if (newImagePaths.length > 0) {
                 const existingImages = targetDoc.data().images || [];
                 updateData.images = [...existingImages, ...newImagePaths];
            }
            
            await updateDoc(doc(db, "hotels", targetDoc.id), updateData);
            resultId = targetDoc.id;
            message = `تم تحديث بيانات "${targetHotelName}" بنجاح.`;
        } else {
            // Fallback: Create if not found even if not marked "new" (should rarely happen for fixed options)
             if (newImagePaths.length > 0) {
                 updateData.images = newImagePaths;
             }
            const newDoc = await addDoc(hotelsRef, updateData);
            resultId = newDoc.id;
            message = `لم يتم العثور على الفندق، تم إنشاء سجل جديد لـ "${targetHotelName}".`;
        }
    }

    return NextResponse.json({ 
        success: true, 
        message: message, 
        id: resultId,
        folder: folderName
    });

  } catch (error: any) {
    console.error("❌ Admin Upload Failed:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
