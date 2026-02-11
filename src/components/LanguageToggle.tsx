"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { FaGlobe } from "react-icons/fa";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleLanguage}
      className="fixed bottom-6 left-6 z-[9999] flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-[#D4AF37]/50 text-[#D4AF37] pl-3 pr-4 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all duration-300 group"
    >
      <FaGlobe className="text-xl group-hover:animate-spin-slow" />
      <span className="text-sm tracking-wide font-cairo">
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </motion.button>
  );
}
