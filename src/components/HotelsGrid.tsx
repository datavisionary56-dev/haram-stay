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
  priceRamadan1to20?: number;
  weekendPrice?: number;
  priceRamadanLast10?: number;
  extraBedPrice?: number;
  distance?: string;
  streetName?: string;
  category: string;
  [key: string]: unknown;
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
          priceRamadan1to20: Number(data.priceRamadan1to20 || data.price || 0),
          weekendPrice: Number(data.weekendPrice || 0),
          priceRamadanLast10: Number(data.priceRamadanLast10 || 0),
          extraBedPrice: Number(data.extraBedPrice || 0),
          distance: data.distance || "",
          streetName: data.streetName || "",
          category: data.category || "front_row", // Default to front_row if missing
          breakfastIncluded: data.breakfastIncluded || false,
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
  const madinahCentralHotels = hotels.filter(h => h.category === 'madinah_central' || h.category === 'madinah'); // Includes legacy 'madinah'
  const madinahOuterHotels = hotels.filter(h => h.category === 'madinah_outer');

  return (
    <div className="w-full flex flex-col gap-8 pb-20">
      
      {/* Makkah Header */}
      <div className="flex items-center gap-4 mb-4 mt-8 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white font-cairo drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <span>🌙</span> فنادق مكة المكرمة
        </h2>
        <div className="h-1 flex-grow bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full opacity-50"></div>
      </div>

      <HotelMarqueeSection title="فنادق الصف الأول" hotels={frontRowHotels} />
      <HotelMarqueeSection title="فنادق إبراهيم الخليل وأجياد" hotels={ajyadKhalilHotels} />
      
      {/* Medina Header */}
      <div className="flex items-center gap-4 mb-4 mt-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white font-cairo drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <span>🌙</span> فنادق المدينة المنورة
        </h2>
        <div className="h-1 flex-grow bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full opacity-50"></div>
      </div>

      <HotelMarqueeSection title="فنادق المدينة - المركزية" hotels={madinahCentralHotels} />
      <HotelMarqueeSection title="فنادق المدينة - خارج المركزية" hotels={madinahOuterHotels} />
      
      {hotels.length === 0 && (
          <div className="text-center py-20 text-gray-500">
              لا توجد فنادق متاحة حالياً.
          </div>
      )}
    </div>
  );
}
