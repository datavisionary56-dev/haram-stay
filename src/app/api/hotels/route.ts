import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export const dynamic = 'force-dynamic'; // Disable caching

export async function GET() {
  try {
    const hotelsRef = collection(db, "hotels");
    // Try to order by createdAt if it exists, otherwise just get all
    // Note: ordering might fail if index is missing, so we might need a simple get first
    const q = query(hotelsRef, orderBy("createdAt", "desc"));
    
    let snapshot;
    try {
        snapshot = await getDocs(q);
    } catch (e) {
        console.warn("Sorting by createdAt failed (index missing?), falling back to default sort");
        snapshot = await getDocs(collection(db, "hotels"));
    }

    const hotels = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "فندق بدون اسم",
        images: data.images || [],
        stars: data.stars || 0,
        price: data.price || 0,
        location: data.location || "",
        lat: data.lat || 0,
        lng: data.lng || 0,
        // Map any other fields needed
        description: data.description || "",
      };
    });

    return NextResponse.json({ success: true, hotels }, { 
        headers: {
            'Cache-Control': 'no-store, max-age=0'
        }
    });

  } catch (error: unknown) {
    console.error("Failed to fetch hotels:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
