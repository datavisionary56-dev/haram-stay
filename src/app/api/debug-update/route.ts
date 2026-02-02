import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, addDoc, doc, query, where } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔍 Received update request for:", body.name);
    
    const hotelsRef = collection(db, "hotels");
    // Flexible search
    const q = query(hotelsRef);
    const snapshot = await getDocs(q);
    
    let targetDoc = null;
    
    for (const d of snapshot.docs) {
      const data = d.data();
      if (data.name && body.name && data.name.includes(body.name)) {
        targetDoc = d;
        break;
      }
    }

    const updateData = {
        name: body.name,
        price: parseInt(body.price_per_night.replace(/\D/g, '')), // Extract number
        night_price: parseInt(body.price_per_night.replace(/\D/g, '')), // Ensure night_price is also set
        distance: body.distance_to_haram,
        images: body.images.map((img: string) => `/images/dar_al_wafideen/${img}`), // Ensure correct path
        description: `فندق ${body.name} - يبعد ${body.distance_to_haram} عن الحرم. سعر الليلة ${body.price_per_night}.`,
        location: "مكة المكرمة",
        lat: 21.4133, // Added Coordinates
        lng: 39.8278, // Added Coordinates
        // Custom fields for our app
        ramadanPrice: body.ramadan_price || null, 
        last10DaysPrice: body.last_10_days_price || null
    };

    if (targetDoc) {
      await updateDoc(doc(db, "hotels", targetDoc.id), updateData);
      return NextResponse.json({ success: true, message: `Updated existing hotel: ${targetDoc.id}`, id: targetDoc.id });
    } else {
      // Create new
      const newDoc = await addDoc(hotelsRef, updateData);
      return NextResponse.json({ success: true, message: `Created new hotel: ${newDoc.id}`, id: newDoc.id });
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Update failed:", error);
    return NextResponse.json({ success: false, error: message });
  }
}
