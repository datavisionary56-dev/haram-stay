"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-black/80 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-[100] p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-row-reverse">
        
        {/* اللوجو مع حركة بسيطة */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center"
        >
          <Link href="/" className="text-[#D4AF37] text-2xl md:text-3xl font-black tracking-tighter uppercase group">
            Haram<span className="text-white group-hover:text-[#D4AF37] transition-colors duration-500">Stay</span>
          </Link>
        </motion.div>

        {/* روابط التنقل */}
        <div className="flex gap-6 md:gap-10 items-center text-sm md:text-base font-medium">
          
          <Link 
            href="/" 
            className={`transition-colors duration-300 ${pathname === "/" ? "text-[#D4AF37]" : "text-zinc-400 hover:text-white"}`}
          >
            الرئيسية
          </Link>

          <Link 
            href="/contact" 
            className={`transition-colors duration-300 ${pathname === "/contact" ? "text-[#D4AF37]" : "text-zinc-400 hover:text-white"}`}
          >
            اتصل بنا
          </Link>

          {/* زر الحجوزات المميز */}
          <Link href="/bookings">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 px-6 py-2 rounded-full font-bold hover:bg-[#D4AF37] hover:text-black transition-all duration-300 hidden md:block"
            >
              حجوزاتي
            </motion.button>
          </Link>
        </div>

      </div>
    </nav>
  );
}