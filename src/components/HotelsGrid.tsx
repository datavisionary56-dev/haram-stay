"use client";
import React, { useEffect, useState, useMemo } from "react";
import HotelCard from "@/components/HotelCard";
import FilterSidebar, { FilterState } from "@/components/FilterSidebar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// تعريف شكل البيانات لمنع الأخطاء الحمراء
interface Hotel {
  id: string;
  name?: string;
  description?: string;
  images: string[];
  stars?: number;
  price1to20?: number;
  price?: number;
  location?: string;
  lat?: number;
  lng?: number;
  distanceToHaram?: number;
}

export default function HotelsGrid() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: Infinity,
    maxDistance: 20000,
    stars: []
  });

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const price = hotel.price || 0;
      const distance = hotel.distanceToHaram || 0;
      const stars = hotel.stars || 0;

      const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
      const matchesDistance = distance <= filters.maxDistance;
      const matchesStars = filters.stars.length === 0 || filters.stars.includes(stars);

      return matchesPrice && matchesDistance && matchesStars;
    });
  }, [hotels, filters]);

  useEffect(() => {
    // إعداد استعلام لجلب الفنادق (بدون ترتيب مؤقتاً للتأكد من وجود بيانات)
    const q = collection(db, "hotels");
    console.log(`Listening to collection "hotels" in project: ${db.app.options.projectId}`);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        console.log(`Snapshot received! Size: ${snapshot.size}`);
        if (snapshot.empty) {
            console.log("No hotels found in Firestore.");
            setHotels([]);
            setLoading(false);
            return;
        }

        const fetchedHotels = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Doc Data:", data);
          // تعيين البيانات مع التحقق من الحقول
          return {
            id: doc.id,
            name: data.name || data.hotelName || "فندق بدون اسم",
            description: data.description || "",
            images: Array.isArray(data.images) ? data.images : [],
            stars: Number(data.stars || 0),
            price: Number(data.price || data.night_price || 0),
            price1to20: Number(data.price1to20 || 0),
            location: data.location || "مكة المكرمة",
            lat: Number(data.lat || 0),
            lng: Number(data.lng || 0),
            distanceToHaram: data.distanceToHaram !== undefined ? Number(data.distanceToHaram) : 10000,
          } as Hotel;
        });

        console.log("Fetched hotels:", fetchedHotels);
        setHotels(fetchedHotels);
        setLoading(false);
      } catch (err) {
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

  // ... (keep useEffect)

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 sticky top-24 z-30">
        <FilterSidebar onFilterChange={setFilters} />
      </aside>

      {/* Grid Content */}
      <div className="w-full lg:w-3/4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#0a0a0a] rounded-[2rem] h-[400px] border border-zinc-800 animate-pulse relative overflow-hidden">
                <div className="h-2/3 bg-zinc-900/50 w-full" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-zinc-900/50 rounded w-3/4" />
                  <div className="h-4 bg-zinc-900/50 rounded w-1/2" />
                </div>
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-900/20 rounded-3xl border border-red-500/50">
            <h3 className="text-2xl font-bold text-red-500 mb-2">عذراً، حدث خطأ في تحميل الفنادق</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد فنادق حالياً</h3>
            <p className="text-gray-400">كن أول من يضيف فندقاً في لوحة التحكم!</p>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج مطابقة</h3>
            <p className="text-gray-400">حاول تغيير خيارات التصفية</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
