"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMosque, FaMoon } from "react-icons/fa";
import HotelsGrid from "@/components/HotelsGrid"; 
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";
import TrustFeatures from "@/components/TrustFeatures";
import Testimonials from "@/components/Testimonials";
import LiveStream from "@/components/LiveStream";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Small timeout to avoid "setState in effect" warning and ensure hydration matches
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
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
           style={{ filter: "brightness(0.8) contrast(1.1) saturate(1.2)" }}
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />
      </div>

      <div className="relative z-20 flex flex-col min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-10 w-full flex-grow">
            <header className="flex justify-between items-center mb-12">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-3"
              >
                <FaMosque className="text-[#D4AF37] text-4xl" />
                <h1 className="text-[#D4AF37] text-4xl md:text-5xl font-black italic tracking-tighter uppercase drop-shadow-2xl">
                  HARAM STAY
                </h1>
              </motion.div>
            </header>

            <div className="mb-20 text-center space-y-6 pt-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="inline-block mb-4">
                    <FaMoon className="text-[#D4AF37] text-3xl mx-auto animate-pulse" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl mb-6 leading-tight">
                    إقامة تليق بضيوف الرحمن <br />
                    <span className="text-[#D4AF37]">في رمضان</span>
                  </h2>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-white/10"
                >
                  نقدم لك تجربة روحانية متكاملة بجوار الحرم المكي الشريف. 
                  <br />
                  أسعار خاصة وحصرية لموسم رمضان والعمرة 2025.
                </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-10 border-r-4 border-[#D4AF37] pr-4"
            >
              <h2 className="text-3xl font-bold italic drop-shadow-md text-white">
                أحدث عروض رمضان
              </h2>
            </motion.div>
            
            <HotelsGrid />
        </div>

        {/* New Features Section */}
        <div className="relative z-20">
          <TrustFeatures />
          <LiveStream />
          <Testimonials />
        </div>
        
        <Footer />
      </div>
    </main>
  );
}
