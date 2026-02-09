"use client";
import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaCloudSun, FaCloudMoon, FaSun, FaMoon, FaCircle, FaTemperatureHigh } from "react-icons/fa";
import { motion } from "framer-motion";

export default function TopBar() {
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
      setCurrentTime(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
        return { text: "خفيف", color: "text-emerald-400", dot: "bg-emerald-500" };
      case "moderate":
        return { text: "متوسط", color: "text-yellow-400", dot: "bg-yellow-500" };
      case "crowded":
        return { text: "مزدحم", color: "text-red-500", dot: "bg-red-500" };
      default:
        return { text: "خفيف", color: "text-emerald-400", dot: "bg-emerald-500" };
    }
  };

  const crowdInfo = getCrowdInfo(crowdStatus);

  return (
    <div 
        className="w-full h-10 border-b border-white/10 flex items-center justify-between px-4 text-xs md:text-sm font-cairo z-50 relative"
        style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
        }}
    >
      {/* Right Side: Status & Weather */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Live Indicator */}
        <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-bold text-red-500 tracking-wider">Makkah Live</span>
        </div>

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
