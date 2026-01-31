"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

import dynamic from "next/dynamic";
import Link from "next/link";
import { differenceInDays, addDays, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// تعريف واجهة البيانات
interface HotelDetails {
  id: string;
  name?: string;
  stars?: number;
  location?: string;
  city?: string;
  price?: number;
  price1to20?: number;
  images?: string[];
  description?: string;
  facilities?: string[];
  lat?: number;
  lng?: number;
  pricingRules?: {
    commission: number;
    ranges: {
      start: string;
      end: string;
      weekdayPrice?: number;
      weekendPrice?: number;
      extraBed?: number;
      isPackage?: boolean;
      packagePrice?: number;
      notes: string;
    }[];
  };
}

// Fallback Data for Dar Al Wafideen
const FALLBACK_HOTEL: HotelDetails = {
  id: "dar-al-wafideen-fallback",
  name: "فندق دار الوافدين",
  stars: 3,
  location: "800 متر عن الحرم، شارع إبراهيم الخليل",
  city: "مكة المكرمة",
  price: 300,
  price1to20: 300,
  images: [
    "/images/dar_al_wafideen/dar_al_wafideen_1.webp",
    "/images/dar_al_wafideen/dar_al_wafideen_2.webp",
    "/images/dar_al_wafideen/dar_al_wafideen_3.webp",
    "/images/dar_al_wafideen/dar_al_wafideen_4.webp",
    "/images/dar_al_wafideen/dar_al_wafideen_5.webp"
  ],
  description: "يتميز فندق دار الوافدين بموقعه المميز في شارع إبراهيم الخليل، على بعد 800 متر فقط من الحرم المكي الشريف. يوفر الفندق غرفاً مريحة ومجهزة بأحدث وسائل الراحة لضمان إقامة روحانية وهادئة لضيوف الرحمن.",
  facilities: ["واي فاي مجاني", "تكييف مركزي", "قريب من الحرم", "مصاعد", "خدمة تنظيف يومية", "استقبال 24 ساعة"],
  lat: 21.413333,
  lng: 39.893333,
  pricingRules: {
    commission: 30,
    ranges: []
  }
};

const FAIRMONT_FALLBACK: HotelDetails = {
  id: "fairmont-makkah-fallback",
  name: "فندق فيرمونت مكة",
  stars: 5,
  location: "وقف الملك عبدالعزيز، الحرم",
  city: "مكة المكرمة",
  price: 2500,
  price1to20: 2500,
  images: [
    "/images/fairmont/fairmont_1.png",
    "/images/fairmont/fairmont_2.png",
    "/images/fairmont/fairmont_3.png",
    "/images/fairmont/fairmont_4.png"
  ],
  description: "ارتقِ بتجربتك في قلب مكة مع فندق فيرمونت مكة ببرج الساعة 🕋. استمتع بإطلالات بانورامية مباشرة على الكعبة المشرفة، وخدمة استثنائية تمزج بين الفخامة والروحانية. نوفر لك غرفاً وأجنحة ملكية، و8 وجهات لتناول الطعام، وأسرع وصول للحرم الشريف.",
  facilities: ["إطلالة مباشرة", "واي فاي مجاني", "مطاعم فاخرة", "نادي صحي", "خدمة الغرف 24/7"],
  lat: 21.4188,
  lng: 39.8264,
  pricingRules: {
    commission: 0,
    ranges: [
        {
            start: "2024-02-18",
            end: "2024-03-19",
            weekdayPrice: 2500,
            weekendPrice: 3100,
            extraBed: 350,
            notes: "🏨 الفندق: فيرمونت مكة"
        },
        {
            start: "2024-03-31",
            end: "2024-04-09",
            isPackage: true,
            packagePrice: 76000,
            notes: "🕋 باقة العشر الأواخر"
        }
    ]
  }
};

export default function HotelDetailsPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [extraBed, setExtraBed] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState<string[]>([]);
  const [bookingNote, setBookingNote] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchHotel = async () => {
      // Check for fallback ID or if we should use fallback
      if (id === "dar-al-wafideen-fallback") {
        if (isMounted) {
            setHotel(FALLBACK_HOTEL);
            setLoading(false);
        }
        return;
      }
      
      // Fallback for Fairmont if ID matches or specifically requested
      if (id === "fairmont-makkah-fallback" || id === "m4ygwfeu3vFBfUiQnaHi") {
          // Try fetching first, but if it fails or has no images, use fallback
      }

      if (!id) return;

      try {
        const docRef = doc(db, "hotels", id as string);
        const docSnap = await getDoc(docRef);

        if (isMounted) {
            if (docSnap.exists()) {
              const data = docSnap.data();
              // Force location text for Dar Al Wafideen
              if ((data.name && data.name.includes('دار الوافدين')) || (typeof id === 'string' && id.includes('dar'))) {
                 if (!data.location || !data.location.includes('إبراهيم الخليل')) {
                    data.location = "800 متر عن الحرم، شارع إبراهيم الخليل";
                 }
              }
              // Force Fairmont Data if needed
              if (data.name && data.name.includes('فيرمونت')) {
                  // Use remote images if local ones are missing or if we want to force CDN
                  if (!data.images || data.images.length === 0 || data.images.some((img: string) => img.includes('localhost') || !img.startsWith('http'))) {
                       data.images = FAIRMONT_FALLBACK.images;
                  }
                  if (!data.price || data.price < 2000) {
                      data.price = 2500;
                  }
              }

              setHotel({ id: docSnap.id, ...data } as HotelDetails);
            } else {
              console.error("Hotel not found in Firestore");
              // Fallback if not found and looks like Dar Al Wafideen
              if (typeof id === 'string' && id.includes('dar')) {
                 setHotel(FALLBACK_HOTEL);
              } else if (typeof id === 'string' && (id.includes('fairmont') || id === "m4ygwfeu3vFBfUiQnaHi")) {
                 setHotel(FAIRMONT_FALLBACK);
              } else if (typeof id === 'string' && (id.includes('safwa') || id.includes('alsafwa'))) {
                 setHotel(SAFWA_FALLBACK);
              }
            }
        }
      } catch (error) {
        console.error("Error fetching hotel:", error);
        // Fallback on error
        if (isMounted) {
             if (typeof id === 'string' && (id.includes('fairmont') || id === "m4ygwfeu3vFBfUiQnaHi")) {
                 setHotel(FAIRMONT_FALLBACK);
             } else if (typeof id === 'string' && (id.includes('safwa') || id.includes('alsafwa'))) {
                 setHotel(SAFWA_FALLBACK);
             } else {
                 setHotel(FALLBACK_HOTEL);
             }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHotel();
    
    return () => {
        isMounted = false;
    };
  }, [id]);

  // Cinematic Slideshow Effect
  useEffect(() => {
    if (!hotel || !hotel.images || hotel.images.length === 0) return;
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % (hotel.images?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [hotel]);

  // Booking Calculation Logic
  useEffect(() => {
    if (!hotel || !checkIn || !checkOut) return;

    const start = startOfDay(parseISO(checkIn));
    const end = startOfDay(parseISO(checkOut));
    const days = differenceInDays(end, start);

    if (days <= 0) {
      setTotalPrice(0);
      setPriceBreakdown(["يرجى اختيار تواريخ صحيحة"]);
      return;
    }

    let total = 0;
    let breakdown: string[] = [];
    let note = "";
    const commission = hotel.pricingRules?.commission || 0;
    const basePrice = hotel.price || 300;

    // Simple calculation for now (fallback logic)
    const nightlyPrice = basePrice + commission;
    total = nightlyPrice * days;
    breakdown.push(`سعر الليلة: ${nightlyPrice} ريال`);
    
    if (extraBed) {
        const extraBedPrice = 100; // Default extra bed price
        total += extraBedPrice * days;
        breakdown.push(`سرير إضافي: ${extraBedPrice} ريال/ليلة`);
    }

    breakdown.push(`الإجمالي لـ ${days} ليلة: ${total.toLocaleString()} ريال`);

    setTotalPrice(total);
    setPriceBreakdown(breakdown);
    setBookingNote(note);

  }, [checkIn, checkOut, extraBed, hotel]);


  const handleWhatsAppBooking = () => {
    const message = `
السلام عليكم، أستفسر عن حجز فندق:
*${hotel?.name}*

أرجو تزويدي بالتفاصيل المتاحة.
    `.trim();

    window.open(`https://wa.me/966548690356?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black font-sans text-white overflow-x-hidden" dir="rtl">
        <div className="fixed inset-0 z-0 bg-gray-900 animate-pulse" />
        <div className="relative z-20 min-h-screen flex flex-col">
          <nav className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
             <div className="h-8 w-32 bg-white/10 rounded-full animate-pulse" />
             <div className="h-8 w-40 bg-white/10 rounded animate-pulse" />
          </nav>
          <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             <div className="lg:col-span-2 space-y-6">
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-8 rounded-3xl shadow-2xl h-64 animate-pulse" />
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-8 rounded-3xl shadow-2xl h-96 animate-pulse" />
             </div>
             <div className="lg:col-span-1 sticky top-24">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-3xl shadow-2xl h-[500px] animate-pulse" />
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) return null;

  const currentImage = hotel.images && hotel.images.length > 0 
    ? hotel.images[activeImageIndex] 
    : "/images/dar_al_wafideen/dar_al_wafideen_1.webp";

  return (
    <div className="relative min-h-screen bg-black font-sans text-white overflow-x-hidden" dir="rtl">
      
      {/* Cinematic Background (Static & Blurred) */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10" />
        <Image
            src={hotel.images && hotel.images.length > 0 ? hotel.images[0] : "/images/makkah.jpg"}
            alt="Background"
            fill
            className="object-cover -z-10 blur-sm scale-105"
            quality={50}
            priority
        />
      </div>

      {/* 2. Content Overlay (Glassmorphism) */}
      <div className="relative z-20 min-h-screen flex flex-col">
        
        {/* Navbar */}
        <nav className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <Link href="/" className="text-white/80 hover:text-[#D4AF37] flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full transition-all hover:bg-white/20">
              <span>→</span> العودة للفنادق
            </Link>
            <h1 className="text-xl font-bold text-[#D4AF37] drop-shadow-md">HARAM STAY</h1>
        </nav>

        {/* Main Content Container */}
        <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Right Side: Hotel Info */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Header Card */}
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        {[...Array(hotel.stars || 3)].map((_, i) => <span key={i} className="text-[#D4AF37]">★</span>)}
                        <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs px-2 py-1 rounded-full border border-[#D4AF37]/30">فندق مميز</span>
                    </div>
                    <h1 className="text-5xl font-black mb-4 text-white drop-shadow-lg">{hotel.name}</h1>
                    <p className="text-gray-200 flex items-center gap-2 text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#D4AF37]">
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        {hotel.location}
                    </p>
                </div>

                {/* Image Gallery (Slider) */}
                {hotel.images && hotel.images.length > 0 && (
                    <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-6 rounded-3xl shadow-2xl relative group">
                        <h2 className="text-2xl font-bold mb-4 text-[#D4AF37]">معرض الصور</h2>
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden">
                            <Image
                                src={hotel.images[activeImageIndex]} 
                                alt={`Slide ${activeImageIndex}`} 
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                                className="object-cover transition-all duration-700"
                                priority
                            />
                            
                            {/* Navigation Buttons */}
                            <button 
                                onClick={() => setActiveImageIndex(prev => (prev === 0 ? hotel.images!.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#D4AF37] text-white p-4 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10"
                            >
                                ←
                            </button>
                            <button 
                                onClick={() => setActiveImageIndex(prev => (prev + 1) % hotel.images!.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-[#D4AF37] text-white p-4 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 z-10"
                            >
                                →
                            </button>
                            
                            {/* Dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {hotel.images.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === activeImageIndex ? 'bg-[#D4AF37] w-8' : 'bg-white/50 w-2'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Description & Facilities */}
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4 text-[#D4AF37]">عن الفندق</h2>
                    <p className="text-gray-200 leading-relaxed text-lg mb-6">{hotel.description}</p>
                    
                    <h3 className="text-xl font-bold mb-4 text-white">المرافق</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {hotel.facilities?.map((facility, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-[#D4AF37]">✓</span>
                                <span className="text-sm text-gray-200">{facility}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing Details - Horizontal Cards */}
                {hotel.pricingRules?.ranges && hotel.pricingRules.ranges.length > 0 && (
                  <div className="backdrop-blur-xl bg-black/40 border border-white/10 p-8 rounded-3xl shadow-2xl mt-8">
                    <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">باقات الأسعار</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {hotel.pricingRules.ranges.map((range, idx) => (
                        <div key={idx} className={`relative p-6 rounded-2xl border ${range.isPackage ? 'bg-gradient-to-br from-[#D4AF37]/20 to-black/40 border-[#D4AF37]/50' : 'bg-white/5 border-white/10'} transition-all hover:scale-[1.02] flex flex-col justify-between min-h-[200px]`}>
                            
                            {/* Header */}
                            <div>
                                <div className="flex justify-between items-start mb-4 pb-4 border-b border-white/10">
                                    <div>
                                        <h3 className={`text-xl font-bold ${range.isPackage ? 'text-[#D4AF37]' : 'text-white'}`}>
                                            {range.notes || "فترة الحجز"}
                                        </h3>
                                        <p className="text-gray-300 text-xs mt-1 dir-ltr opacity-80">
                                            {range.start}  →  {range.end}
                                        </p>
                                    </div>
                                    {range.isPackage && (
                                        <span className="bg-[#D4AF37] text-black font-black px-3 py-1 rounded-lg text-xs shadow-[0_0_10px_#D4AF37]">باقة مميزة</span>
                                    )}
                                </div>

                                {/* Prices */}
                                <div className="space-y-3">
                                    {range.isPackage ? (
                                        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="text-gray-300 text-sm">سعر الباقة</span>
                                            <span className="text-3xl font-black text-[#D4AF37] drop-shadow-md">{range.packagePrice?.toLocaleString()} <span className="text-sm font-normal">ريال</span></span>
                                        </div>
                                    ) : (
                                        <>
                                            {range.weekdayPrice && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-400 text-sm">منتصف الأسبوع</span>
                                                    <span className="text-xl font-bold text-white">{range.weekdayPrice.toLocaleString()} <span className="text-xs text-[#D4AF37]">ريال</span></span>
                                                </div>
                                            )}
                                            {range.weekendPrice && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[#D4AF37] text-sm">نهاية الأسبوع</span>
                                                    <span className="text-xl font-bold text-[#D4AF37]">{range.weekendPrice.toLocaleString()} <span className="text-xs">ريال</span></span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                             {/* Extra Info */}
                             {!range.isPackage && range.extraBed && (
                                 <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-gray-400">
                                    <span>🛏️ سرير إضافي:</span>
                                    <span className="text-white font-bold">{range.extraBed} ريال</span>
                                 </div>
                              )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

            </div>

            {/* Left Side: Booking Card (Simple) */}
            <div className="lg:col-span-1 sticky top-24">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-3xl shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4 text-center text-white">للحجز والاستفسار</h3>
                    
                    <p className="text-center text-gray-300 mb-6 text-sm">
                        تواصل معنا مباشرة عبر واتساب للحصول على أفضل العروض وتأكيد حجزك فوراً.
                    </p>

                    <button 
                      onClick={handleWhatsAppBooking}
                      className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[#25D366]/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.654-.698c.93.513 1.733.702 2.803.702 3.182 0 5.768-2.587 5.769-5.766.001-3.181-2.584-5.769-5.766-5.789zm11.244 3.704c-1.997-3.468-5.7-5.619-9.712-5.634-6.35 0-11.488 5.152-11.493 11.514-.001 2.053.53 4.02 1.528 5.749l-1.6 5.84 6.002-1.575c1.668.91 3.579 1.391 5.563 1.392h.005c6.354 0 11.49-5.152 11.495-11.514.002-3.076-1.192-5.969-3.39-8.151z" />
                      </svg>
                      تواصل عبر واتساب
                    </button>
                </div>
            </div>

        </div>
      </div>

    </div>
  );
}
