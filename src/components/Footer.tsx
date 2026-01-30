import React from 'react';
import { FaHeart, FaTwitter, FaInstagram, FaSnapchatGhost, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer({ onAdminClick }: { onAdminClick?: () => void }) {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 font-cairo relative z-30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">HaramStay</h3>
            <p className="text-gray-400 leading-relaxed">
              منصتك الأولى لحجز فنادق مكة المكرمة والمدينة المنورة.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">الرئيسية</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">الفنادق</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <FaWhatsapp className="text-green-500" />
                <span>+966 50 000 0000</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">تابعنا</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
          <p className="flex items-center justify-center gap-2 mb-4">
            صنع بحب <FaHeart className="text-red-500" /> في مكة المكرمة
          </p>
          <p>&copy; {new Date().getFullYear()} HaramStay. جميع الحقوق محفوظة.</p>
          
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
