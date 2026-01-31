'use client';

import React, { useState } from 'react';
import { FaUpload, FaSave, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, setDoc, getDocs, query, where, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminSecretPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('fairmont');
  const [newHotelName, setNewHotelName] = useState('');
  
  // Prices State
  const [priceNightly, setPriceNightly] = useState('');
  const [priceWeekend, setPriceWeekend] = useState('');
  const [priceLast10, setPriceLast10] = useState('');
  
  // New Fields
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [extraBedPrice, setExtraBedPrice] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('جاري المعالجة...');
    
    try {
        let hotelId = selectedHotel;
        let hotelName = "";
        let folderName = "";

        // 1. Determine Hotel Info
        if (selectedHotel === 'new_hotel') {
            if (!newHotelName) throw new Error("اسم الفندق الجديد مطلوب");
            hotelName = newHotelName;
            // Generate a simple ID for new hotel or let Firestore generate it later
            // For storage folder, let's sanitize the name
            folderName = newHotelName.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
            if (!folderName) folderName = "new_hotel_" + Date.now();
        } else {
            folderName = selectedHotel;
            if (selectedHotel === 'fairmont') hotelName = "فندق فيرمونت مكة";
            else if (selectedHotel === 'dar_al_wafideen') hotelName = "فندق دار الوافدين";
            else hotelName = selectedHotel;
        }

        // 2. Upload Images to Firebase Storage
        const imageUrls: string[] = [];
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setStatus(`جاري رفع الصورة (${i + 1} من ${files.length}): ${file.name}...`);
                
                try {
                    const storageRef = ref(storage, `hotels/${folderName}/${Date.now()}_${file.name}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(snapshot.ref);
                    imageUrls.push(url);
                    console.log(`Uploaded ${file.name}: ${url}`);
                } catch (uploadError: any) {
                    console.error(`Error uploading ${file.name}:`, uploadError);
                    setStatus(`فشل رفع الصورة ${file.name}: ${uploadError.message}`);
                    // Continue with other files or stop? Let's stop to let user know.
                    throw new Error(`فشل رفع الصورة ${file.name}: ${uploadError.message}`);
                }
            }
        }

        // 3. Prepare Data for Firestore
        const updateData: any = {
            updatedAt: new Date().toISOString()
        };

        if (hotelName) updateData.name = hotelName;

        if (priceNightly) updateData.price = Number(priceNightly);

        // Pricing Rules
        const newRange = {
            start: startDate || new Date().toISOString().split('T')[0],
            end: endDate || "2025-12-31",
            weekdayPrice: Number(priceNightly || 0),
            weekendPrice: Number(priceWeekend || priceNightly || 0),
            extraBed: Number(extraBedPrice || 0),
            notes: "السعر الأساسي"
        };

        // Construct or merge pricingRules
        // Note: For simplicity in this admin panel, we might be overwriting or adding to ranges.
        // Let's assume we want to ensuring 'pricingRules' object exists.
        
        // 4. Save to Firestore
        setStatus('جاري حفظ البيانات في قاعدة البيانات...');
        
        let docRef;
        let isNewDoc = false;

        // Check if hotel exists by some ID logic or just add new if 'new_hotel'
        if (selectedHotel === 'new_hotel') {
            // Create new document
            // We can search if a hotel with this name already exists to avoid duplicates
            const q = query(collection(db, "hotels"), where("name", "==", hotelName));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                // Update existing
                docRef = doc(db, "hotels", querySnapshot.docs[0].id);
                // We need to fetch existing data to merge arrays if needed
            } else {
                // Create brand new
                isNewDoc = true;
                docRef = doc(collection(db, "hotels")); // Auto ID
            }
        } else {
            // Known ID (fairmont, etc.) - BUT wait, do we have these IDs in Firestore?
            // The user deleted everything. So "fairmont" ID might not exist.
            // We should try to find by ID or create with that ID.
            docRef = doc(db, "hotels", selectedHotel); 
            // If we use specific IDs like 'fairmont', setDoc with merge is good.
        }

        // Prepare final payload
        const finalData = { ...updateData };
        
        if (imageUrls.length > 0) {
            // For new docs, set images. For existing, arrayUnion.
             if (isNewDoc) {
                 finalData.images = imageUrls;
             } else {
                 finalData.images = arrayUnion(...imageUrls);
             }
        }
        
        // Pricing Rules Logic (Simplified for now: Just set/overwrite the ranges array with this new range for simplicity, or append?)
        // To append properly without overwriting existing ranges, we need arrayUnion if 'ranges' was a top level array, but it's nested.
        // For robustness, let's just set the pricingRules structure if it's a new doc, 
        // or if updating, we might need to read first. 
        // Let's just set it for now.
        
        if (isNewDoc) {
             finalData.pricingRules = {
                 commission: 0,
                 ranges: [newRange]
             };
             if (priceLast10) {
                 finalData.pricingRules.ranges.push({
                    start: "2025-03-20", // Approx Ramadan last 10
                    end: "2025-03-30",
                    weekdayPrice: Number(priceLast10),
                    weekendPrice: Number(priceLast10),
                    extraBed: Number(extraBedPrice || 0),
                    notes: "العشر الأواخر",
                    isPackage: true,
                    packagePrice: Number(priceLast10)
                 });
             }
             // Default fields for new hotel
             finalData.city = "مكة المكرمة";
             finalData.stars = 5;
             finalData.description = "وصف الفندق...";
             finalData.location = "موقع الفندق...";
             finalData.facilities = ["واي فاي", "موقف سيارات"];
             finalData.lat = 21.4;
             finalData.lng = 39.8;
        } else {
            // For existing, we use setDoc with merge: true
            // But we can't easily arrayUnion a nested object field 'pricingRules.ranges'.
            // So for this fix, let's just update the main price and add images.
            // If the user wants to add complex ranges, they might need a better UI or we overwrite.
            // Let's overwrite ranges if provided to ensure the latest input takes effect.
             finalData.pricingRules = {
                 commission: 0,
                 ranges: [newRange]
             };
             if (priceLast10) {
                 finalData.pricingRules.ranges.push({
                    start: "2025-03-20", 
                    end: "2025-03-30",
                    weekdayPrice: Number(priceLast10),
                    weekendPrice: Number(priceLast10),
                    extraBed: Number(extraBedPrice || 0),
                    notes: "العشر الأواخر",
                    isPackage: true,
                    packagePrice: Number(priceLast10)
                 });
             }
        }

        await setDoc(docRef, finalData, { merge: true });
        
        setStatus(`تم الحفظ بنجاح! ID: ${docRef.id}`);
        setFiles(null);
        // Reset form slightly?
        
    } catch (error: any) {
        console.error(error);
        setStatus(`فشلت العملية: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#D4AF37]">Admin Center</h1>
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            العودة للرئيسية <FaArrowRight />
          </Link>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">إدارة الفنادق</h2>
          
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">اختر الفندق</label>
              <select 
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white"
              >
                <option value="fairmont">فندق فيرمونت مكة (Fairmont Makkah)</option>
                <option value="dar_al_wafideen">فندق دار الوافدين (Dar Al Wafideen)</option>
                <option value="new_hotel">--- إضافة فندق جديد ---</option>
              </select>
            </div>

            {selectedHotel === 'new_hotel' && (
                <div className="bg-gray-700/50 p-4 rounded-xl border border-[#D4AF37]/30 animate-fadeIn">
                    <label className="block text-sm font-bold mb-2 text-[#D4AF37]">اسم الفندق الجديد</label>
                    <input 
                        type="text" 
                        value={newHotelName}
                        onChange={(e) => setNewHotelName(e.target.value)}
                        className="w-full p-3 bg-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#D4AF37] outline-none"
                        placeholder="مثال: فندق الصفوة"
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">سعر الليلة (عادية)</label>
                    <input 
                        type="number" 
                        value={priceNightly}
                        onChange={(e) => setPriceNightly(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                        placeholder="مثال: 450"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">سعر الويك إيند</label>
                    <input 
                        type="number" 
                        value={priceWeekend}
                        onChange={(e) => setPriceWeekend(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                        placeholder="مثال: 550"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">تاريخ البداية (من)</label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">تاريخ النهاية (إلى)</label>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">سعر السرير الإضافي</label>
                <input 
                    type="number" 
                    value={extraBedPrice}
                    onChange={(e) => setExtraBedPrice(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                    placeholder="مثال: 150"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">سعر العشر الأواخر</label>
                <input 
                    type="number" 
                    value={priceLast10}
                    onChange={(e) => setPriceLast10(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                    placeholder="مثال: 35000"
                />
            </div>

            <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-[#D4AF37] transition-colors">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => setFiles(e.target.files)}
                className="hidden" 
                id="hotel-images"
              />
              <label htmlFor="hotel-images" className="cursor-pointer flex flex-col items-center gap-2">
                <FaUpload className="text-3xl text-gray-400" />
                <span className="text-gray-300">اختر صور الفندق (يمكنك اختيار أكثر من صورة)</span>
                {files && <span className="text-[#D4AF37] font-bold">{files.length} ملفات تم اختيارها</span>}
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b5952f] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>جاري الرفع والحفظ...</>
              ) : (
                <>
                  <FaSave /> حفظ وتحديث البيانات
                </>
              )}
            </button>

            {status && (
              <div className={`p-4 rounded-lg text-center ${status.includes('نجاح') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
