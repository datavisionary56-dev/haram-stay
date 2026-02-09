import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo, Tajawal } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HaramStay | عروض فنادق مكة المكرمة في رمضان 2025",
  description: "اكتشف أفضل عروض فنادق مكة المكرمة لرمضان 2025. حجوزات مؤكدة وأسعار تنافسية بالقرب من الحرم المكي الشريف.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${tajawal.variable} antialiased bg-black font-sans`}>
        {/* الهيدر سيظهر في كل الصفحات */}
        <div className="fixed top-0 left-0 right-0 z-[1000]">
           <TopBar />
           <Navbar />
        </div>
        
        {/* Padding for fixed header */}
        <div className="pt-24">
           {/* المحتوى المتغير */}
           {children}
        </div>

        {/* زر واتساب العائم */}
        <a
          href="https://wa.me/966548690356"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center border-4 border-black/20"
          title="تواصل معنا عبر واتساب"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.654-.698c.93.513 1.733.702 2.803.702 3.182 0 5.768-2.587 5.769-5.766.001-3.181-2.584-5.769-5.766-5.789zm11.244 3.704c-1.997-3.468-5.7-5.619-9.712-5.634-6.35 0-11.488 5.152-11.493 11.514-.001 2.053.53 4.02 1.528 5.749l-1.6 5.84 6.002-1.575c1.668.91 3.579 1.391 5.563 1.392h.005c6.354 0 11.49-5.152 11.495-11.514.002-3.076-1.192-5.969-3.39-8.151z" />
          </svg>
        </a>

        {/* تذييل بسيط (Footer) لإضافة لمسة فخامة */}
        <footer className="bg-black border-t border-zinc-900 py-10 text-center">
          <p className="text-zinc-600 text-sm">
            © 2026 HaramStay. جميع الحقوق محفوظة لخدمة ضيوف الرحمن
          </p>
        </footer>
      </body>
    </html>
  );
}