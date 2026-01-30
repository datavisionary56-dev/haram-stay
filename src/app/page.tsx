"use client";
import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from "framer-motion";
import HotelsGrid from "@/components/HotelsGrid"; 
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative font-sans text-white overflow-x-hidden" dir="rtl">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
         <img 
           src="/images/makkah.jpg"
           className="w-full h-full object-cover"
           alt="Makkah Background"
           style={{ filter: "brightness(0.9) contrast(1.1) saturate(1.2)" }}
         />
         <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      <div className="relative z-20 flex flex-col min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-10 w-full flex-grow">
            <header className="flex justify-between items-center mb-12">
            <h1 className="text-[#D4AF37] text-5xl font-black italic tracking-tighter uppercase drop-shadow-2xl">HARAM STAY</h1>
            </header>

            <div className="mb-16 text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">إقامة تليق بضيوف الرحمن</h2>
                <p className="text-xl text-gray-200 max-w-2xl mx-auto">اختر من بين أفضل الفنادق في مكة المكرمة والمدينة المنورة، بالقرب من الحرم المكي والنبوي.</p>
            </div>

            <h2 className="text-3xl font-bold mb-8 border-r-4 border-[#D4AF37] pr-4 italic drop-shadow-md text-white">العروض المميزة</h2>
            <HotelsGrid />
        </div>
        
        <Footer onAdminClick={() => setShowAdmin(true)} />
      </div>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </main>
  );
}
