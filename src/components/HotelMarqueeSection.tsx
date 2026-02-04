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
  if (!hotels || hotels.length === 0) return null;

  // Duplicate list to ensure seamless infinite scroll
  // We duplicate enough times to ensure it fills screens even if few hotels
  const marqueeHotels = [...hotels, ...hotels, ...hotels, ...hotels]; 

  return (
    <div className="w-full py-8 border-b border-white/5 last:border-0 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-cairo border-r-4 border-[#D4AF37] pr-4">
          {title}
        </h2>
      </div>

      <div className="relative w-full group">
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
          {/* Duplicate for seamless loop if using CSS translate method 
              Actually, the standard way is to have two identical sets moving.
              My animate-marquee usually moves -50% or -100%. 
              If I have one long strip, I need to make sure it's long enough.
          */}
        </div>
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
