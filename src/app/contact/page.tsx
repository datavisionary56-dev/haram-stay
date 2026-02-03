"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-20" dir="rtl">
      <div className="max-w-5xl mx-auto">
        
        {/* العناوين الرئيسية */}
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#D4AF37] text-4xl md:text-6xl font-black mb-6 uppercase tracking-widest"
          >
            تواصل معنا
          </motion.h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-light">
            نحن هنا لضمان إقامة استثنائية لك في أطهر بقاع الأرض. فريقنا متاح لخدمتك على مدار الساعة.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* الجانب الأيمن: معلومات التواصل */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-[#D4AF37] text-xl font-bold mb-4">العنوان المباشر</h3>
              <p className="text-zinc-400 text-lg">مكة المكرمة، المنطقة المركزية، برج الساعة</p>
            </div>

            <div>
              <h3 className="text-[#D4AF37] text-xl font-bold mb-4">اتصل بنا</h3>
              <a href="tel:+966548690356" className="text-white text-2xl font-black font-sans hover:text-[#D4AF37] transition-colors block mb-2" dir="ltr">
                +966 54 869 0356
              </a>
              <a 
                href="https://wa.me/966548690356" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 font-bold"
              >
                تواصل عبر واتساب
              </a>
            </div>

            <div>
              <h3 className="text-[#D4AF37] text-xl font-bold mb-4">البريد الإلكتروني</h3>
              <p className="text-zinc-400 text-lg">info@haramstay.com</p>
            </div>

            {/* أيقونات تواصل اجتماعي بسيطة */}
            <div className="flex gap-4 pt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all cursor-pointer">
                  ☆
                </div>
              ))}
            </div>
          </motion.div>

          {/* الجانب الأيسر: نموذج الإرسال */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-zinc-800 backdrop-blur-md shadow-2xl"
          >
            <form className="space-y-6">
              <div>
                <label className="text-zinc-500 text-sm mb-2 block">الاسم الكريم</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white focus:border-[#D4AF37] outline-none transition-all"
                  placeholder="أدخل اسمك هنا"
                />
              </div>

              <div>
                <label className="text-zinc-500 text-sm mb-2 block">رقم الجوال أو البريد</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white focus:border-[#D4AF37] outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-zinc-500 text-sm mb-2 block">كيف يمكننا مساعدتك؟</label>
                <textarea 
                  rows={4}
                  className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white focus:border-[#D4AF37] outline-none transition-all"
                ></textarea>
              </div>

              <button className="w-full bg-[#D4AF37] text-black font-black py-5 rounded-2xl hover:bg-yellow-600 transition-all active:scale-95 shadow-xl shadow-[#D4AF37]/20 text-lg">
                إرسال الرسالة
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}