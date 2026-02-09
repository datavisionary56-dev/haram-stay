import React from 'react';
import { FaHeart, FaTwitter, FaInstagram, FaSnapchatGhost, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 font-cairo relative z-30 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Description */}
          <div>
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">HaramStay</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              منصتك الأولى والموثوقة لحجز فنادق مكة المكرمة والمدينة المنورة. نسعى لتقديم أفضل العروض والخدمات لضيوف الرحمن، مع ضمان الراحة والجودة في كل خطوة.
            </p>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">الشركة</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"><span>←</span> من نحن</Link></li>
              <li><Link href="/contact" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"><span>←</span> اتصل بنا</Link></li>
              {/* <li><Link href="/careers" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"><span>←</span> فرص العمل</Link></li> */}
            </ul>
          </div>

          {/* Legal & Support Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">معلومات ودعم</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/terms" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"><span>←</span> شروط الخدمة</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"><span>←</span> سياسة الخصوصية</Link></li>
              <li><Link href="/faq" className="hover:text-[#D4AF37] transition-colors flex items-center gap-2"><span>←</span> الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">تواصل معنا</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all">
                <FaWhatsapp className="text-[#25D366] text-xl" />
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500">واتساب (حجز فوري)</span>
                    <a href="https://wa.me/966548690356" target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-[#D4AF37] dir-ltr">
                    +966 54 869 0356
                    </a>
                </div>
              </li>
            </ul>
             <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all border border-white/10">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-all border border-white/10">
                <FaInstagram />
              </a>
               <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FFFC00] hover:text-black transition-all border border-white/10">
                <FaSnapchatGhost />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400 text-sm">
          <p className="flex items-center justify-center gap-2 mb-4">
            صنع بحب <FaHeart className="text-red-500" /> في مكة المكرمة
          </p>
         <p>&copy; {new Date().getFullYear()} HaramStay. جميع الحقوق محفوظة. <span className="text-gray-600 text-xs ml-2">v2.4 (Medina Split + Headers)</span></p>
          
          {/* Admin Link */}
          <div className="mt-6 flex justify-center">
            <Link 
                href="/admin-center-secret"
                className="text-xs text-gray-800 hover:text-gray-600 transition-colors"
            >
                Admin Center
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
