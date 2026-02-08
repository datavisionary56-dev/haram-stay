import React from 'react';
import { FaWhatsapp, FaStar, FaMapMarkerAlt, FaRoad, FaCoffee } from 'react-icons/fa';

interface HotelMarqueeCardProps {
  hotel: {
    name: string;
    stars: number;
    price: number; // Fallback or main price
    priceRamadan1to20?: number;
    weekendPrice?: number;
    priceRamadanLast10?: number;
    extraBedPrice?: number;
    distance?: string;
    streetName?: string;
    breakfastIncluded?: boolean;
  };
}

export default function HotelMarqueeCard({ hotel }: HotelMarqueeCardProps) {
  const whatsappMessage = encodeURIComponent(
    `أرغب في الاستفسار عن حجز فندق: ${hotel.name}`
  );
  const whatsappLink = `https://wa.me/966548690356?text=${whatsappMessage}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative w-80 h-64 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 mx-4 cursor-pointer shadow-lg hover:shadow-[#D4AF37]/20"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        fontFamily: "'Cairo', sans-serif"
      }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full z-0 transition-transform group-hover:scale-150 duration-500" />
      
      <div className="relative z-10 p-4 flex flex-col justify-between h-full">
        {/* Top: Name & Stars */}
        <div>
          <h3 className="text-lg font-bold text-white mb-1 font-cairo line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-1 text-[#D4AF37] text-xs">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < hotel.stars ? "fill-current" : "text-zinc-600"} />
                ))}
                {hotel.breakfastIncluded && (
                   <div className="flex items-center gap-1 mr-2 bg-emerald-900/50 px-1.5 py-0.5 rounded border border-emerald-500/30" title="شامل الإفطار">
                      <FaCoffee className="text-emerald-400 text-[10px]" />
                      <span className="text-[8px] text-emerald-200 font-cairo">إفطار</span>
                   </div>
                )}
             </div>
             {/* Distance & Street (Small) */}
             <div className="flex flex-col items-end text-[10px] text-zinc-400 font-cairo">
                {hotel.distance && (
                    <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-[#D4AF37]" /> {hotel.distance}</span>
                )}
                {hotel.streetName && (
                    <span className="flex items-center gap-1"><FaRoad className="text-zinc-500" /> {hotel.streetName}</span>
                )}
             </div>
          </div>
        </div>

        {/* Bottom: Prices & WhatsApp */}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-white/5">
          <div className="flex flex-col gap-1 w-full">
            {/* Price 1-20 Ramadan */}
            <div className="flex justify-between items-center w-full pr-1">
                <span className="text-[10px] text-zinc-400 font-cairo">1-20 رمضان</span>
                <span className="text-sm font-bold text-white font-mono">
                  {hotel.priceRamadan1to20 || hotel.price} <span className="text-[10px] text-[#D4AF37] font-cairo">ريال</span>
                </span>
            </div>
            
            {/* Weekend Price - Optional */}
            {hotel.weekendPrice && hotel.weekendPrice > 0 && (
                <div className="flex justify-between items-center w-full pr-1">
                    <span className="text-[10px] text-zinc-400 font-cairo">سعر الويك إند</span>
                    <span className="text-sm font-bold text-[#D4AF37] font-mono">
                      {hotel.weekendPrice} <span className="text-[10px] text-[#D4AF37] font-cairo">ريال</span>
                    </span>
                </div>
            )}

            {/* Price Last 10 */}
            <div className="flex justify-between items-center w-full pr-1">
                <span className="text-[10px] text-[#D4AF37] font-cairo font-bold">العشر الأواخر</span>
                <span className="text-sm font-bold text-[#D4AF37] font-mono">
                  {hotel.priceRamadanLast10 ? hotel.priceRamadanLast10 : '---'} <span className="text-[10px] font-cairo">ريال</span>
                </span>
            </div>
            {/* Extra Bed Price - Only if exists */}
            {hotel.extraBedPrice && hotel.extraBedPrice > 0 && (
                <div className="flex justify-between items-center w-full pr-1 mt-1 border-t border-white/5 pt-1">
                    <span className="text-[10px] text-zinc-300 font-cairo">السرير الإضافي</span>
                    <span className="text-sm font-bold text-white font-mono">
                      {hotel.extraBedPrice} <span className="text-[10px] text-[#D4AF37] font-cairo">ريال</span>
                    </span>
                </div>
            )}
          </div>
          
          <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mr-2 flex-shrink-0">
            <FaWhatsapp className="text-white text-lg" />
          </div>
        </div>
      </div>
    </a>
  );
}
