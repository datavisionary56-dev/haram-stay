"use client";
import React, { useEffect, useState } from "react";
import HotelCard from "@/components/HotelCard";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// تعريف شكل البيانات لمنع الأخطاء الحمراء
interface Hotel {
  id: string;
  name?: string;
  images: string[];
  stars?: number;
  price1to20?: number;
  price?: number;
  location?: string;
  lat?: number;
  lng?: number;
}

export default function HotelsGrid() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // إعداد استعلام لجلب الفنادق (بدون ترتيب مؤقتاً للتأكد من وجود بيانات)
    const q = collection(db, "hotels");

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        if (snapshot.empty) {
            console.log("No hotels found in Firestore.");
            setHotels([]);
            setLoading(false);
            return;
        }

        const fetchedHotels = snapshot.docs.map(doc => {
          const data = doc.data();
          // تعيين البيانات مع التحقق من الحقول
          return {
            id: doc.id,
            name: data.name || data.hotelName || "فندق بدون اسم",
            images: Array.isArray(data.images) ? data.images : [],
            stars: Number(data.stars || 0),
            price: Number(data.price || data.night_price || 0),
            price1to20: Number(data.price1to20 || 0),
            location: data.location || "مكة المكرمة",
            lat: Number(data.lat || 0),
            lng: Number(data.lng || 0),
          } as Hotel;
        });

        console.log("Fetched hotels:", fetchedHotels);
        setHotels(fetchedHotels);
        setLoading(false);
      } catch (err: any) {
        console.error("Error processing hotel data:", err);
        setError("حدث خطأ أثناء معالجة البيانات");
        setLoading(false);
      }
    }, (err) => {
      console.error("Error fetching hotels:", err);
      setError(err.message);
      setLoading(false);
    });

    // تنظيف المستمع عند إلغاء تحميل المكون
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-[#0a0a0a] rounded-[2rem] h-[400px] border border-zinc-800 animate-pulse relative overflow-hidden">
            <div className="h-2/3 bg-zinc-900/50 w-full" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-zinc-900/50 rounded w-3/4" />
              <div className="h-4 bg-zinc-900/50 rounded w-1/2" />
              <div className="flex justify-between mt-4">
                <div className="h-8 bg-zinc-900/50 rounded w-20" />
                <div className="h-8 bg-zinc-900/50 rounded w-20" />
              </div>
            </div>
            {/* لمعة متحركة */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}
