"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface HotelCardProps {
  hotel: {
    id: string;
    name?: string;
    price1to20?: number;
    price?: number;
    images: string[];
    stars?: number;
    location?: string;
  };
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback images
  const images = hotel.images?.length > 0 
    ? hotel.images 
    : ["/images/makkah.jpg"];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Determine link destination
  // Force Safwa to use a specific fallback ID to ensure data loading and avoid navigation issues
  const isSafwa = hotel.name?.includes("الصفوة") || hotel.name?.includes("Safwa");
  
  let linkHref = hotel.id ? `/hotels/${hotel.id}` : '#';
  
  if (isSafwa) {
      linkHref = `/hotels/safwa-hotel-fallback`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer h-[420px] shadow-2xl border border-white/10"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(25px)",
      }}
    >
      <Link href={linkHref} className="block h-full w-full relative">
          {/* Full Height Image Slider */}
          <div className="absolute inset-0 w-full h-full bg-gray-800">
            <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative h-full w-full"
                >
                    <Image
                      src={images[currentIndex]}
                      alt={hotel.name || "Hotel Image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ filter: "contrast(1.05) brightness(1.05)" }}
                      priority={currentIndex === 0}
                    />
                </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            
            {/* Image Navigation */}
            {images.length > 1 && (
                <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm"
                    >
                      ←
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm"
                    >
                      →
                    </button>
                </>
            )}
            
            {/* Rating Badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/30 flex items-center gap-1 z-20">
              <span className="text-[#D4AF37]">★</span>
              <span className="text-white text-xs font-bold">{hotel.stars || 5}</span>
            </div>
          </div>

          {/* Glassmorphism Content Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-6 z-20"
               style={{
                 background: "rgba(255, 255, 255, 0.1)",
                 backdropFilter: "blur(25px)",
                 borderTop: "1px solid rgba(255, 255, 255, 0.2)",
               }}
          >
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1 shadow-black/50 drop-shadow-md">
                    {hotel.name || "فندق في مكة المكرمة"}
                    </h3>
                    <p className="text-gray-200 text-sm flex items-center gap-1 font-medium drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#D4AF37]">
                          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        {hotel.location || "مكة المكرمة"}
                    </p>
                </div>
                <div className="text-left">
                    <p className="text-xs text-gray-300 mb-1 drop-shadow-md">يبدأ من</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#D4AF37] drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">{hotel.price || hotel.price1to20 || 300}</span>
                        <span className="text-sm text-gray-200 font-bold drop-shadow-md">ريال</span>
                    </div>
                </div>
            </div>
          </div>
      </Link>
    </motion.div>
  );
}
