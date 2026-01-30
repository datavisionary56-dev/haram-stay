"use client";
import React, { useState } from "react";
import HotelMap from "./HotelMap";

// واجهة البيانات لضمان عدم حدوث أخطاء مستقبلاً
interface Hotel {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  lat: number;
  lng: number;
}

export default function HotelDetailsClient({ hotel }: { hotel: Hotel }) {
  const [nights, setNights] = useState(1);

  // حماية إضافية: إذا لم توجد بيانات الفندق، نعرض رسالة تحميل بدلاً من الانهيار
  if (!hotel) {
    return (
      <div className="min-h-screen bg-black text-[#D4AF37] flex items-center justify-center font-bold">
        جاري تحميل بيانات الفندق...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* الجانب الأيسر: الصورة والوصف والخريطة */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <img 
                src={hotel.image} 
                alt={hotel.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <h1 className="absolute bottom-8 right-8 text-3xl md:text-5xl font-black text-[#D4AF37]">
                {hotel.name}
              </h1>
            </div>

            <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800">
              <h2 className="text-[#D4AF37] text-xl font-bold mb-4 text-right">عن الفندق</h2>
              <p className="text-zinc-400 leading-relaxed text-right text-lg">
                {hotel.description || "لا يوجد وصف متاح لهذا الفندق حالياً."}
              </p>
            </div>

            <div className="h-[400px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
               <HotelMap latitude={hotel.lat} longitude={hotel.lng} hotelName={hotel.name} />
            </div>
          </div>

          {/* الجانب الأيمن: نموذج الحجز */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8 flex-row-reverse">
                <h3 className="text-[#D4AF37] text-2xl font-black">احجز الآن</h3>
                <div className="text-left font-sans">
                  <span className="text-3xl font-black text-white">{hotel.price}</span>
                  <span className="text-zinc-500 text-sm mr-1">ريال</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="text-right">
                  <label className="text-zinc-400 text-xs mb-2 block font-medium">تاريخ الوصول</label>
                  <input 
                    type="date" 
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white text-right focus:border-[#D4AF37] outline-none transition-all"
                  />
                </div>

                <div className="text-right">
                  <label className="text-zinc-400 text-xs mb-2 block font-medium">عدد الليالي</label>
                  <input 
                    type="number" 
                    min="1"
                    value={nights}
                    onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white text-right focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div className="py-6 border-y border-zinc-800 my-6">
                  <div className="flex justify-between items-center flex-row-reverse mb-2 font-sans">
                    <span className="text-zinc-400">سعر الليلة</span>
                    <span className="text-white">{hotel.price} ريال</span>
                  </div>
                  <div className="flex justify-between items-center flex-row-reverse font-black text-xl font-sans">
                    <span className="text-[#D4AF37]">الإجمالي</span>
                    <span className="text-[#D4AF37]">{hotel.price * nights} ريال</span>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`تم حجز ${hotel.name} بنجاح!`)}
                  className="w-full bg-[#D4AF37] text-black font-black py-5 rounded-2xl hover:bg-yellow-600 transition-all active:scale-95 shadow-xl shadow-[#D4AF37]/20 text-lg"
                >
                  تأكيد الحجز
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}