"use client";
import { useState } from 'react';
import { db } from "@/lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AdminPage() {
  const [hotelUrl, setHotelUrl] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);

  // الوظيفة الأساسية للإضافة
  const handleAddHotel = async () => {
    if (!hotelUrl) return alert("الرجاء وضع رابط بوكينج أولاً");
    setLoading(true);

    try {
      // 1. جلب البيانات من الـ API الذي صممناه
      const response = await fetch('/api/fetch-hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: hotelUrl }),
      });
      
      const result = await response.json();

      if (result.success) {
        const hotelData = result.data;

        // 2. الحفظ في Firestore مع تحويل الإحداثيات لأرقام Number (إجبارياً)
        // هذا يحل مشكلة تخزينها كنصوص "21.44" ويجعلها أرقاماً 21.44
        const latNum = Number(hotelData.lat);
        const lngNum = Number(hotelData.lng);

        await addDoc(collection(db, "hotels"), {
          name: hotelData.name,
          city: hotelData.city ?? hotelData.location ?? "مكة المكرمة",
          lat: isNaN(latNum) ? 0 : latNum,
          lng: isNaN(lngNum) ? 0 : lngNum,
          images: Array.isArray(hotelData.images) ? hotelData.images : [],
          stars: Number(hotelData.stars ?? hotelData.rating ?? 4),
          price: Number(hotelData.price ?? 0),
          description: hotelData.description || "",
          facilities: hotelData.facilities || [],
          originalUrl: hotelData.originalUrl || "",
          distanceToHaram: distance ? Number(distance) : 0,
          createdAt: serverTimestamp(),
        });

        alert("تم إضافة الفندق بنجاح وصوره وإحداثياته جاهزة!");
        setHotelUrl("");
        setDistance("");
      } else {
        alert("فشل الجلب: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الإضافة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-2xl font-bold text-white text-center">لوحة تحكم HARAM STAY</h1>
      
      <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
        <input 
          type="text" 
          value={hotelUrl}
          onChange={(e) => setHotelUrl(e.target.value)}
          placeholder="أدخل رابط الفندق من بوكينج هنا..."
          className="w-full p-4 bg-black border border-zinc-700 rounded-lg text-white mb-4"
        />

        <input 
          type="number" 
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="بعد الفندق عن الحرم (بالمتر)..."
          className="w-full p-4 bg-black border border-zinc-700 rounded-lg text-white mb-4"
        />
        
        <button 
          onClick={handleAddHotel}
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-4 rounded-lg transition-all"
        >
          {loading ? "جاري الجلب الذكي وحفظ البيانات..." : "إضافة الفندق الآن"}
        </button>
      </div>
    </main>
  );
}
