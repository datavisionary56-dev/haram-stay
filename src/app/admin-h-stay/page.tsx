"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { FaBolt, FaSave, FaCheck } from "react-icons/fa";

export default function FlashSaleAdmin() {
  const [hotelName, setHotelName] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const docRef = doc(db, "settings", "flash-sale");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHotelName(data.hotelName || "");
          setPrice(data.price || "");
          setMessage(data.message || "");
          setIsActive(data.isActive ?? true);
        }
      } catch (error) {
        console.error("Error fetching flash sale:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await setDoc(doc(db, "settings", "flash-sale"), {
        hotelName,
        price,
        message,
        isActive,
        updatedAt: new Date().toISOString(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving flash sale:", error);
      alert("Failed to save. Check console.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#D4AF37]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-cairo text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
         <img 
           src="/images/makkah.jpg"
           className="w-full h-full object-cover opacity-20"
           alt="Background"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
            <FaBolt className="text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-[#D4AF37]">
            إدارة عروض الفلاش
            <span className="block text-xs text-gray-400 font-normal mt-1">Flash Sale Admin Dashboard</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">اسم الفندق (Hotel Name)</label>
            <input
              type="text"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
              placeholder="مثال: فندق أبراج مكة"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">سعر العرض (Offer Price)</label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 pl-16 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                placeholder="250"
                required
              />
              <span className="absolute left-3 top-3 text-gray-500 text-sm border-r border-white/10 pr-3">SAR</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">رسالة مخصصة (Custom Message)</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
              placeholder="مثال: شامل الإفطار - لفترة محدودة"
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-black/20 rounded-lg border border-white/5">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 accent-[#D4AF37] rounded cursor-pointer"
            />
            <label htmlFor="isActive" className="cursor-pointer select-none text-sm text-gray-300">
              تفعيل العرض في الموقع (Active)
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              saving 
                ? "bg-gray-600 cursor-not-allowed" 
                : success
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#D4AF37] hover:bg-[#b5952f] text-black"
            }`}
          >
            {saving ? (
              "جاري الحفظ..."
            ) : success ? (
              <>
                <FaCheck /> تم التحديث بنجاح
              </>
            ) : (
              <>
                <FaSave /> تحديث العرض
              </>
            )}
          </button>
        </form>

        {/* Preview */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-3 text-center">معاينة الشريط (Preview)</p>
          <div className="w-full bg-[#D4AF37] text-black text-sm font-bold py-2 px-4 rounded text-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            ⚡ عرض فلاش: {hotelName || "..."} بـ {price || "..."} ريال - {message || "..."}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
