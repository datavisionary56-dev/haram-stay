import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, addDoc, setDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const hotelsRef = collection(db, "hotels");
    const snapshot = await getDocs(hotelsRef);
    const hotels = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    const logs: string[] = [];
    const nameMap: Record<string, any[]> = {};

    // Group by name (normalize name)
    for (const h of hotels) {
      const name = (h as any).name || (h as any).hotelName || "Unknown";
      const normalized = name.trim();
      if (!nameMap[normalized]) nameMap[normalized] = [];
      nameMap[normalized].push(h);
    }

    // Deduplicate
    for (const name in nameMap) {
      const group = nameMap[name];
      if (group.length > 1) {
        logs.push(`Found ${group.length} duplicates for ${name}. Keeping the first one.`);
        // Keep the first one, delete the rest
        for (let i = 1; i < group.length; i++) {
          await deleteDoc(doc(db, "hotels", group[i].id));
          logs.push(`Deleted duplicate ${group[i].id}`);
        }
      }
    }

    // Check for Fairmont
    const hasFairmont = Object.keys(nameMap).some(n => n.includes("فيرمونت") || n.includes("Fairmont"));
    if (!hasFairmont) {
      logs.push("Fairmont Makkah not found. Adding it.");
      await addDoc(hotelsRef, {
        name: "فندق فيرمونت مكة",
        hotelName: "فندق فيرمونت مكة", // Legacy support
        location: "مكة المكرمة، وقف الملك عبد العزيز",
        stars: 5,
        price: 850,
        night_price: 850,
        price1to20: 850,
        description: "إطلالة مباشرة على الكعبة المشرفة والحرم المكي. تجربة فاخرة لا تنسى.",
        images: [
          "/images/fairmont-makkah.jpg", // Ensure these exist or use placeholders
          "/images/fairmont-room.jpg"
        ],
        createdAt: new Date().toISOString()
      });
    }

    // Check for missing createdAt
    for (const h of hotels) {
      if (!(h as any).createdAt) {
        const now = new Date().toISOString();
        // Update the document with a new createdAt
        await setDoc(doc(db, "hotels", h.id), { ...h, createdAt: now }, { merge: true });
        logs.push(`Updated Hotel ${h.id} (${(h as any).name}) with new createdAt: ${now}`);
      }
    }

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}