"use client";
import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/context/LanguageContext";
import { FaCloudSun, FaCloudMoon, FaSun, FaMoon, FaCircle, FaTemperatureHigh } from "react-icons/fa";
import { motion } from "framer-motion";

export default function TopBar() {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<{ temp: string; condition: string; isDay: boolean } | null>(null);
  const [crowdStatus, setCrowdStatus] = useState<"low" | "moderate" | "crowded">("low");
  const [currentTime, setCurrentTime] = useState("");

  // Fetch Weather from wttr.in (No API Key needed)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("https://wttr.in/Makkah?format=j1");
        const data = await res.json();
        const current = data.current_condition[0];
        const temp = current.temp_C;
        const condition = current.weatherDesc[0].value;
        // Simple day/night check based on time (approximate for UI)
        const hour = new Date().getHours();
        const isDay = hour > 6 && hour < 18;
        
        setWeather({
          temp,
          condition,
          isDay
        });
      } catch (error) {
        console.error("Weather fetch error:", error);
        // Fallback
        setWeather({ temp: "30", condition: "Sunny", isDay: true });
      }
    };

    fetchWeather();
    // Refresh weather every 30 mins
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, [language]);

  // Listen to Crowd Status from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "makkah-status"), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.crowdLevel) {
          setCrowdStatus(data.crowdLevel);
        }
      }
    });

    return () => unsub();
  }, []);

  const getCrowdInfo = (status: string) => {
    switch (status) {
      case "low":
        return { 
          text: language === 'ar' ? "خفيف" : "Low", 
          color: "text-emerald-400", 
          dot: "bg-emerald-500",
          matafTime: "< 30 min",
          floorsTime: "< 15 min",
          matafColor: "text-emerald-400",
          floorsColor: "text-emerald-400"
        };
      case "moderate":
        return { 
          text: language === 'ar' ? "متوسط" : "Moderate", 
          color: "text-orange-400", 
          dot: "bg-orange-500",
          matafTime: "45-60 min",
          floorsTime: "30-45 min",
          matafColor: "text-orange-400",
          floorsColor: "text-emerald-400"
        };
      case "crowded":
        return { 
          text: language === 'ar' ? "مزدحم" : "Crowded", 
          color: "text-red-500", 
          dot: "bg-red-500",
          matafTime: "> 90 min",
          floorsTime: "> 60 min",
          matafColor: "text-red-500",
          floorsColor: "text-orange-400"
        };
      default:
        return { 
          text: language === 'ar' ? "خفيف" : "Low", 
          color: "text-emerald-400", 
          dot: "bg-emerald-500",
          matafTime: "< 30 min",
          floorsTime: "< 15 min",
          matafColor: "text-emerald-400",
          floorsColor: "text-emerald-400"
        };
    }
  };

  const crowdInfo = getCrowdInfo(crowdStatus);

  return (
    <div 
        className="w-full h-auto min-h-[40px] border-b border-white/10 flex flex-col md:flex-row items-center justify-between px-4 py-2 text-xs md:text-sm font-cairo z-50 relative gap-2"
        style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
        }}
    >
      {/* Left Side: Live Tawaf Status */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
         <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="font-bold text-white/90">{language === 'ar' ? "حالة الطواف الآن" : "Live Tawaf Status"}</span>
         </div>
         
         <div className="flex items-center gap-3 text-[10px] md:text-xs">
            <div className="flex items-center gap-1">
                <span className="text-gray-400">{language === 'ar' ? "صحن المطاف:" : "Courtyard:"}</span>
                <span className={`font-bold ${crowdInfo.matafColor}`}>{crowdInfo.matafTime}</span>
            </div>
            <div className="w-px h-3 bg-white/20"></div>
            <div className="flex items-center gap-1">
                <span className="text-gray-400">{language === 'ar' ? "الأدوار المتكررة:" : "Other Floors:"}</span>
                <span className={`font-bold ${crowdInfo.floorsColor}`}>{crowdInfo.floorsTime}</span>
            </div>
         </div>
      </div>

      {/* Right Side: Status & Weather */}
      <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-center md:justify-end">

        {/* Crowd Status */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            <span className="text-zinc-400">حالة الطواف:</span>
            <div className={`w-2 h-2 rounded-full ${crowdInfo.dot} shadow-[0_0_8px_currentColor]`}></div>
            <span className={`font-bold ${crowdInfo.color}`}>{crowdInfo.text}</span>
        </div>

        {/* Weather */}
        {weather && (
            <div className="flex items-center gap-2 text-zinc-300">
                {weather.isDay ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-200" />}
                <span className="font-mono font-bold text-[#D4AF37]">{weather.temp}°C</span>
            </div>
        )}
      </div>

      {/* Center/Left: Ticker */}
      <div className="flex-1 overflow-hidden mx-4 relative mask-linear-fade">
         <motion.div 
            className="whitespace-nowrap text-zinc-400 flex items-center gap-8"
            animate={{ x: [1000, -1000] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
         >
            <span className="flex items-center gap-2">
                <FaCircle className="text-[4px] text-[#D4AF37]" />
                مرحباً بضيوف الرحمن في مكة المكرمة
            </span>
            <span className="flex items-center gap-2">
                <FaCircle className="text-[4px] text-[#D4AF37]" />
                الساعة الآن في مكة: <span className="text-white font-mono">{currentTime}</span>
            </span>
            <span className="flex items-center gap-2">
                <FaCircle className="text-[4px] text-[#D4AF37]" />
                {crowdStatus === 'crowded' ? 'ينصح بتأجيل العمرة لساعات متأخرة بسبب الزحام' : 'الأجواء مناسبة جداً لأداء المناسك الآن'}
            </span>
            <span className="flex items-center gap-2">
                <FaCircle className="text-[4px] text-[#D4AF37]" />
                تابعونا للحصول على أحدث عروض فنادق الحرم
            </span>
         </motion.div>
      </div>
    </div>
  );
}
