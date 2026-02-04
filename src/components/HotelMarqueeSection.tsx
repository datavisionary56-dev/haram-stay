"use client";
import React from "react";
import HotelMarqueeCard from "./HotelMarqueeCard";

interface Hotel {
  id: string;
  name: string;
  stars: number;
  price: number;
  [key: string]: any;
}

interface HotelMarqueeSectionProps {
  title: string;
  hotels: Hotel[];
}

export default function HotelMarqueeSection({ title, hotels }: HotelMarqueeSectionProps) {
  // if (!hotels || hotels.length === 0) return null; // REMOVED to show empty sections

  // Duplicate list to ensure seamless infinite scroll
  // We duplicate enough times to ensure it fills screens even if few hotels
  const marqueeHotels = hotels && hotels.length > 0 ? [...hotels, ...hotels, ...hotels, ...hotels] : [];

  return (
    <div className="w-full py-8 border-b border-white/5 last:border-0 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-cairo border-r-4 border-[#D4AF37] pr-4">
          {title}
        </h2>
      </div>

      <div className="relative w-full group min-h-[200px] flex items-center justify-center">
        {hotels && hotels.length > 0 ? (
            <>
                {/* Gradient Masks for fading edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

                {/* Marquee Container */}
                <div className="flex w-full overflow-hidden">
                <div className="flex items-center animate-marquee group-hover:[animation-play-state:paused] py-4">
                    {marqueeHotels.map((hotel, index) => (
                    <HotelMarqueeCard key={`${hotel.id}-${index}`} hotel={hotel} />
                    ))}
                </div>
                </div>
            </>
        ) : (
            <div className="text-center text-gray-500 py-10 w-full bg-white/5 rounded-xl border border-dashed border-white/10 mx-4">
                <p className="text-lg font-cairo">سيتم إضافة العروض قريباً...</p>
            </div>
        )}
      </div>
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 60s linear infinite; /* Default speed, adjusted by length usually */
        }
        /* Make it faster or slower depending on preference, user said "Smooth" */
      `}</style>
    </div>
  );
}
