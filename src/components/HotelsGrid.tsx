"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HotelMarqueeSection from "./HotelMarqueeSection";

interface Hotel {
  id: string;
  name: string;
  stars: number;
  price: number;
  category: string;
  [key: string]: any;
}

export default function HotelsGrid() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, "hotels");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedHotels = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || data.hotelName || "فندق بدون اسم",
          stars: Number(data.stars || 0),
          price: Number(data.price || data.night_price || 0),
          category: data.category || "front_row", // Default to front_row if missing
          ...data
        } as Hotel;
      });
      setHotels(fetchedHotels);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="w-full py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">جاري تحميل الفنادق...</p>
        </div>
    );
  }

  // Filter hotels by category
  const frontRowHotels = hotels.filter(h => h.category === 'front_row');
  const ajyadKhalilHotels = hotels.filter(h => h.category === 'ajyad_khalil');
  const madinahHotels = hotels.filter(h => h.category === 'madinah');

  return (
    <div className="w-full flex flex-col gap-8 pb-20">
      <HotelMarqueeSection title="فنادق الصف الأول" hotels={frontRowHotels} />
      <HotelMarqueeSection title="فنادق إبراهيم الخليل وأجياد" hotels={ajyadKhalilHotels} />
      <HotelMarqueeSection title="فنادق المدينة المنورة" hotels={madinahHotels} />
      
      {hotels.length === 0 && (
          <div className="text-center py-20 text-gray-500">
              لا توجد فنادق متاحة حالياً.
          </div>
      )}
    </div>
  );
}
