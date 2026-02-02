"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaTicketAlt } from "react-icons/fa";

export default function BookingsPage() {
  const [refNumber, setRefNumber] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the logic to find the booking
    alert(`جاري البحث عن الحجز رقم: ${refNumber}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4" dir="rtl">
      <div className="max-w-xl mx-auto text-center">
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-block p-6 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30"
        >
          <FaTicketAlt className="text-5xl text-[#D4AF37]" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
          إدارة <span className="text-[#D4AF37]">حجوزاتي</span>
        </h1>
        
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          أدخل رقم الحجز الخاص بك (Reference Number) للاطلاع على التفاصيل، تحميل الفاتورة، أو طلب تعديل.
        </p>

        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="bg-zinc-900/50 p-2 rounded-3xl border border-zinc-800 flex flex-col md:flex-row gap-2"
        >
          <input 
            type="text" 
            placeholder="مثال: #BK-2025-XXXX"
            value={refNumber}
            onChange={(e) => setRefNumber(e.target.value)}
            className="flex-grow bg-transparent text-white p-4 outline-none text-center md:text-right placeholder-gray-600 font-mono"
            required
          />
          <button 
            type="submit"
            className="bg-[#D4AF37] text-black font-bold py-4 px-8 rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <FaSearch /> بحث
          </button>
        </motion.form>

        <div className="mt-12 flex justify-center gap-8 text-sm text-gray-500">
          <span>بحاجة لمساعدة؟</span>
          <a href="/contact" className="text-[#D4AF37] hover:underline">تواصل مع خدمة العملاء</a>
        </div>

      </div>
    </div>
  );
}
