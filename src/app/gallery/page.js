"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function GalleryPage() {
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadLocalData = () => {
      console.log("Loading local data fallback...");
      fetch('/images/dar_al_wafideen/metadata.json')
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error("Failed to load metadata", err));
    };

    const fetchData = async () => {
      try {
        const q = query(collection(db, "hotels"), where("name", "==", "فندق دار الوافدين"));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const hotelData = snapshot.docs[0].data();
          setData({
            name: hotelData.name,
            distance_to_haram: (hotelData.distance && hotelData.distance.includes('إبراهيم')) ? hotelData.distance : "800 متر، شارع إبراهيم الخليل",
            price_per_night: `${hotelData.price || 300} ريال`,
            last_10_days_price: `${(hotelData.last10DaysPrice || 8000).toString().replace(' ريال', '')} ريال`,
            images: hotelData.images || []
          });
        } else {
            // Fallback to local JSON if DB is empty
            console.log("Firestore empty, falling back to local JSON");
            loadLocalData();
        }
      } catch (err) {
        console.error("Failed to load data from Firestore, using fallback", err);
        loadLocalData();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.images.length);
    }, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(interval);
  }, [data]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + data.images.length) % data.images.length);
  };

  if (!data) return <div className="flex items-center justify-center h-screen bg-black text-white">جاري تحميل المعرض...</div>;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans" dir="rtl">
      
      {/* Cinematic Background Slideshow */}
      {data.images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={img.startsWith('/') ? img : `/images/dar_al_wafideen/${img}`}
            alt={data.name}
            className="w-full h-full object-cover"
            style={{ filter: "contrast(1.05) brightness(1.05)" }}
            loading={index === 0 ? "eager" : "lazy"}
          />
          {/* Dark Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      ))}

      {/* Glassmorphism Info Card */}
      <div className="absolute bottom-10 right-10 z-20 max-w-md w-full">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl text-white">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
            {data.name}
          </h1>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-gray-200 text-lg">المسافة عن الحرم</span>
              <span className="font-semibold text-xl">{data.distance_to_haram}</span>
            </div>
            
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-gray-200 text-lg">سعر الليلة</span>
              <span className="font-bold text-2xl text-yellow-300">{data.price_per_night}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-200 text-lg">باقة العشر الأواخر</span>
              <span className="font-bold text-xl text-amber-300">{data.last_10_days_price}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all border border-white/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white transition-all border border-white/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2 space-x-reverse">
        {data.images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
