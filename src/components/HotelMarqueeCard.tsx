import React from 'react';
import { FaWhatsapp, FaStar } from 'react-icons/fa';

interface HotelMarqueeCardProps {
  hotel: {
    name: string;
    stars: number;
    price: number;
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
      className="block group relative w-72 h-40 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden hover:border-[#D4AF37] transition-all duration-300 flex-shrink-0 mx-4 cursor-pointer shadow-lg hover:shadow-[#D4AF37]/20"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full z-0 transition-transform group-hover:scale-150 duration-500" />
      
      <div className="relative z-10 p-5 flex flex-col justify-between h-full">
        {/* Top: Name & Stars */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2 font-cairo line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-[#D4AF37] text-sm">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < hotel.stars ? "fill-current" : "text-zinc-600"} />
            ))}
          </div>
        </div>

        {/* Bottom: Price & WhatsApp */}
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400 font-cairo">يبدأ من</span>
            <span className="text-xl font-bold text-white font-mono">
              {hotel.price} <span className="text-xs text-[#D4AF37] font-cairo">ريال</span>
            </span>
          </div>

          <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <FaWhatsapp className="text-white text-xl" />
          </div>
        </div>
      </div>
    </a>
  );
}
