"use client";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleLanguage}
      className="fixed bottom-6 left-6 z-[9999] bg-black/50 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] px-4 py-2 rounded-full font-bold shadow-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
    >
      {language === 'ar' ? 'English' : 'العربية'}
    </motion.button>
  );
}
