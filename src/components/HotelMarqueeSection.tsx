"use client";
import React, { useRef, useEffect, useState } from "react";
import HotelMarqueeCard from "./HotelMarqueeCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Hotel {
  id: string;
  name: string;
  stars: number;
  price: number;
  extraBedPrice?: number;
  breakfastIncluded?: boolean;
  [key: string]: unknown;
}

interface HotelMarqueeSectionProps {
  title: string;
  hotels: Hotel[];
}

export default function HotelMarqueeSection({ title, hotels }: HotelMarqueeSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate list to ensure seamless infinite scroll
  // We duplicate 4 times to ensure we have plenty of buffer
  const marqueeHotels = hotels && hotels.length > 0 ? [...hotels, ...hotels, ...hotels, ...hotels] : [];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || marqueeHotels.length === 0) return;

    let animationFrameId: number;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += 1; // Speed: 1px per frame

        // Reset logic for infinite scroll
        // If we've scrolled past half the width (2 copies out of 4), reset to 0
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, marqueeHotels.length]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full py-8 border-b border-white/5 last:border-0 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-cairo border-r-4 border-[#D4AF37] pr-4">
          {title}
        </h2>
      </div>

      <div 
        className="relative w-full group min-h-[200px] flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {hotels && hotels.length > 0 ? (
            <>
                {/* Gradient Masks for fading edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

                {/* Navigation Arrows */}
                <button 
                  onClick={scrollRight} // Arabic is RTL, so Right Arrow should technically go "Forward" (Left in LTR) but typically Right Arrow = Next Items (Right side)
                  // Actually in Arabic/RTL context:
                  // If we want to see "Next" items which are usually to the Left in RTL...
                  // But this is a marquee moving right-to-left (standard ticker).
                  // So "Right" arrow -> Moves view Right (scrollLeft +) -> Shows items on the Right.
                  // "Left" arrow -> Moves view Left (scrollLeft -) -> Shows items on the Left.
                  // Let's stick to standard directional logic.
                  className="absolute right-2 md:right-4 z-30 bg-black/40 hover:bg-[#D4AF37] text-white p-3 rounded-full backdrop-blur-sm transition-all transform hover:scale-110 border border-white/10 hidden md:flex"
                  aria-label="Next"
                >
                  <FaChevronRight size={20} />
                </button>
                
                <button 
                  onClick={scrollLeft}
                  className="absolute left-2 md:left-4 z-30 bg-black/40 hover:bg-[#D4AF37] text-white p-3 rounded-full backdrop-blur-sm transition-all transform hover:scale-110 border border-white/10 hidden md:flex"
                  aria-label="Previous"
                >
                  <FaChevronLeft size={20} />
                </button>

                {/* Mobile Arrows (Visible on touch) - simplified for tap targets */}
                 <button 
                  onClick={scrollRight}
                  className="absolute right-2 z-30 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm border border-white/10 md:hidden flex"
                >
                  <FaChevronRight size={16} />
                </button>
                 <button 
                  onClick={scrollLeft}
                  className="absolute left-2 z-30 bg-black/30 text-white p-2 rounded-full backdrop-blur-sm border border-white/10 md:hidden flex"
                >
                  <FaChevronLeft size={16} />
                </button>

                {/* Marquee Container */}
                <div 
                    ref={scrollRef}
                    className="flex w-full overflow-x-auto scrollbar-hide py-4"
                    style={{ scrollBehavior: 'auto' }} // controlled manually or via smooth scrollBy
                >
                    <div className="flex gap-4 px-4"> 
                    {/* Added gap and px here for spacing since we aren't using the CSS animation flex container anymore */}
                        {marqueeHotels.map((hotel, index) => (
                        <div key={`${hotel.id}-${index}`} className="flex-shrink-0">
                            <HotelMarqueeCard hotel={hotel} />
                        </div>
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
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
