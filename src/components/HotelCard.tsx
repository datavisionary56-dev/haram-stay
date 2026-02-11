"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { FaStar, FaMapMarkerAlt, FaWhatsapp, FaCheckCircle, FaCoffee } from "react-icons/fa";
import BookingModal from "./BookingModal";

interface HotelCardProps {
  hotel: {
    id: string;
    name?: string;
    description?: string;
    price1to20?: number;
    price?: number;
    weekendPrice?: number;
    extraBedPrice?: number;
    priceRamadan1to20?: number;
    priceRamadanLast10?: number;
    images: string[];
    stars?: number;
    location?: string;
    logo?: string;
    distanceToHaram?: number | string;
    breakfastIncluded?: boolean;
  };
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const isSafwa = hotel.name?.includes("الصفوة") || hotel.name?.includes("Safwa");
  
  let linkHref = hotel.id ? `/hotels/${hotel.id}` : '#';
  
  if (isSafwa) {
      linkHref = `/hotels/safwa-hotel-fallback`;
  }

  // WhatsApp Message
  // const whatsappMessage = `السلام عليكم، أنا مهتم بحجز ${hotel.name || "فندق"} المعروض في موقع HaramStay.`;
  // const whatsappLink = `https://wa.me/966548690356?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer h-[500px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] border border-white/10 flex flex-col font-cairo transition-all duration-300"
      style={{
        background: "rgba(20, 20, 20, 0.9)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top Section: Image Slider (60% height) */}
      <div className="relative h-[60%] w-full bg-gray-800 overflow-hidden">
         {/* Verified Badge */}
         {(hotel.stars || 0) >= 4 && (
            <div className="absolute top-4 left-4 z-30 bg-blue-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_4px_15px_rgba(59,130,246,0.4)] border border-white/20">
              <FaCheckCircle className="text-[10px]" />
              <span>موثوق</span>
            </div>
         )}

         {/* Breakfast Badge (Floating & Glowing) */}
         {hotel.breakfastIncluded && (
            <div className="absolute bottom-4 right-4 z-30 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.6)] border border-emerald-400 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
              <FaCoffee className="text-[10px]" />
              <span>شامل الإفطار</span>
            </div>
         )}

         <Link href={linkHref} className="block w-full h-full">
            <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {/* Islamic Pattern Overlay (Subtle) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay"></div>
         </Link>

            {/* Image Navigation */}
            {images.length > 1 && (
                <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm"
                    >
                      ←
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm"
                    >
                      →
                    </button>

                    <div className="absolute bottom-4 left-0 right-0 z-20 flex gap-2 justify-center">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentIndex(index);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === currentIndex 
                                        ? "w-8 bg-[#D4AF37]" 
                                        : "w-2 bg-white/40 hover:bg-white/60"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Price Tag Overlay */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4AF37]/50 shadow-lg z-10 flex items-center gap-1">
                 <span className="text-[#D4AF37] font-bold text-lg">{hotel.price || hotel.price1to20 || "---"} </span>
                 <span className="text-xs text-[#D4AF37]">ريال</span>
                 <span className="text-white text-xs opacity-80">/ ليلة</span>
            </div>

            {/* Logo Overlay (Top Left) */}
            {hotel.logo && (
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 rounded-full p-1 shadow-lg z-10 flex items-center justify-center overflow-hidden border border-[#D4AF37]">
                    <Image 
                      src={hotel.logo} 
                      alt="Logo" 
                      width={40} 
                      height={40} 
                      className="object-contain"
                    />
                </div>
            )}
      </div>

                {/* Content Section */}
      <div className="flex-1 p-5 flex flex-col relative bg-transparent">
        <Link href={linkHref} className="block">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-1 line-clamp-1 font-cairo">
                {hotel.name || "فندق مكة المكرمة"}
                </h3>
                {hotel.stars && (
                    <div className="flex text-[#D4AF37] text-sm">
                        {[...Array(hotel.stars)].map((_, i) => (
                            <FaStar key={i} />
                        ))}
                    </div>
                )}
            </div>
            
            {/* Price Badge */}
            {(hotel.price || 0) > 0 && (
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <span className="bg-gradient-to-r from-[#D4AF37] to-[#F8F1C0] bg-clip-text text-transparent font-bold text-xl font-mono block text-center">{hotel.price}</span>
                    <span className="text-[10px] text-zinc-400 block -mt-1 text-center font-cairo">ريال/ليلة</span>
                </div>
            )}
        </div>

            {/* Hotel Description Snippet */}
            {hotel.description && (
              <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed opacity-90 font-light">
                {hotel.description}
              </p>
            )}

            {/* Additional Prices */}
            <div className="flex flex-col gap-1 mb-3 text-xs border-t border-white/5 pt-2">
                 {/* Weekend Price */}
                 {hotel.weekendPrice && hotel.weekendPrice > 0 && (
                    <div className="flex justify-between items-center text-zinc-300">
                        <span className="font-medium">سعر الويك إند:</span>
                        <span className="text-[#D4AF37] font-bold font-mono text-base">{hotel.weekendPrice} <span className="text-[10px] font-cairo">ريال</span></span>
                    </div>
                 )}
                 {/* Extra Bed Price */}
                 {hotel.extraBedPrice && hotel.extraBedPrice > 0 && (
                    <div className="flex justify-between items-center text-zinc-300">
                        <span className="font-medium">السرير الإضافي:</span>
                        <span className="text-[#D4AF37] font-bold font-mono text-base">{hotel.extraBedPrice} <span className="text-[10px] font-cairo">ريال</span></span>
                    </div>
                 )}
            </div>

            <div className="flex items-center text-gray-400 text-xs mb-4 gap-3">
                <div className="flex items-center gap-1">
                   <FaMapMarkerAlt className="text-[#D4AF37]" />
                   <span className="line-clamp-1 font-medium">{hotel.location?.replace("موقع الفندق", "").replace("...", "").trim() || "مكة المكرمة"}</span>
                </div>
                {hotel.distanceToHaram && (
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-[10px] text-[#D4AF37] border border-white/5">
                        <span>🕋</span>
                        <span>{hotel.distanceToHaram} م</span>
                    </div>
                )}
                {/* Breakfast Text (In Info Bar) - Optional fallback if visual badge isn't enough */}
                {hotel.breakfastIncluded && (
                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                        <FaCoffee />
                        <span>إفطار</span>
                    </div>
                )}
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="mt-auto grid grid-cols-2 gap-3 relative z-10">
              <Link 
                href={linkHref}
                className="bg-zinc-800 hover:bg-zinc-700 text-white text-center py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700 hover:border-[#D4AF37]/30"
              >
                التفاصيل
              </Link>
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg hover:shadow-[#25D366]/20"
              >
                <FaWhatsapp className="text-lg" />
                <span>حجز واتساب</span>
              </button>
          </div>

          <BookingModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            hotelName={hotel.name || "فندق"} 
          />
      </div>
    </motion.div>
  );
}
