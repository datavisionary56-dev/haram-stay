"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaTimes, FaCalendarAlt, FaUser, FaBed } from "react-icons/fa";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelName: string;
}

export default function BookingModal({ isOpen, onClose, hotelName }: BookingModalProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [roomType, setRoomType] = useState("غرفة ثنائية");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `
السلام عليكم، أرغب في حجز فندق:
🏨 *${hotelName}*

📅 *التاريخ:*
من: ${checkIn}
إلى: ${checkOut}

👥 *الضيوف:* ${guests}
🛏️ *نوع الغرفة:* ${roomType}

أرجو تأكيد التوفر والسعر.
    `.trim();

    const whatsappUrl = `https://wa.me/966548690356?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir="rtl">
           {/* Backdrop */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="absolute inset-0 bg-black/80 backdrop-blur-sm"
           />
           
           {/* Modal Content */}
           <motion.div
             initial={{ scale: 0.9, opacity: 0, y: 20 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.9, opacity: 0, y: 20 }}
             className="relative w-full max-w-md bg-[#1a1a1a] border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden z-50"
           >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#D4AF37]/20 to-transparent p-6 border-b border-[#D4AF37]/20 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-[#D4AF37]">حجز إقامة</h2>
                 <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                    <FaTimes />
                 </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">الفندق</label>
                    <input 
                      type="text" 
                      value={hotelName} 
                      disabled 
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-bold opacity-70 cursor-not-allowed"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1"><FaCalendarAlt className="text-[#D4AF37]" /> الوصول</label>
                        <input 
                          type="date" 
                          required
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1"><FaCalendarAlt className="text-[#D4AF37]" /> المغادرة</label>
                        <input 
                          type="date" 
                          required
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1"><FaUser className="text-[#D4AF37]" /> عدد الضيوف</label>
                        <select 
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        >
                            {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-gray-900">{n}</option>)}
                            <option value="مجموعة" className="bg-gray-900">مجموعة (+7)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1"><FaBed className="text-[#D4AF37]" /> نوع الغرفة</label>
                        <select 
                          value={roomType}
                          onChange={(e) => setRoomType(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                        >
                            <option value="غرفة ثنائية" className="bg-gray-900">غرفة ثنائية</option>
                            <option value="غرفة ثلاثية" className="bg-gray-900">غرفة ثلاثية</option>
                            <option value="غرفة رباعية" className="bg-gray-900">غرفة رباعية</option>
                            <option value="جناح" className="bg-gray-900">جناح</option>
                            <option value="غرف متصلة" className="bg-gray-900">غرف متصلة</option>
                        </select>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[#25D366]/40 transition-all active:scale-95 flex items-center justify-center gap-2 mt-6"
                 >
                    <FaWhatsapp className="text-xl" />
                    <span>إرسال الطلب عبر واتساب</span>
                 </button>
              </form>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
