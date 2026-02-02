import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'من نحن | HaramStay',
  description: 'تعرف على منصة HaramStay، رفيقك الأمثل لحجز فنادق مكة المكرمة والمدينة المنورة.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans" dir="rtl">
      
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('/images/makkah.jpg')] bg-cover bg-center blur-sm scale-105" />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-white drop-shadow-2xl">
            من نحن
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
            نحن بوابتك الروحانية لأطهر بقاع الأرض. نسعى لتقديم تجربة حجز استثنائية لضيوف الرحمن.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        
        <div className="grid gap-12">
          {/* Mission */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl hover:bg-white/10 transition-colors">
            <h2 className="text-3xl font-bold text-[#D4AF37] mb-4">رسالتنا</h2>
            <p className="text-gray-300 leading-loose text-lg">
              في &quot;HaramStay&quot;، نؤمن بأن رحلة العمرة والحج تبدأ براحة البال. رسالتنا هي تبسيط عملية حجز الفنادق في مكة المكرمة والمدينة المنورة، مع توفير خيارات تناسب جميع الميزانيات، من الفنادق الاقتصادية إلى الأجنحة الفاخرة المطلة على الكعبة المشرفة.
            </p>
          </div>

          {/* Vision */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl hover:bg-white/10 transition-colors">
            <h2 className="text-3xl font-bold text-[#D4AF37] mb-4">رؤيتنا</h2>
            <p className="text-gray-300 leading-loose text-lg">
              أن نكون المنصة الرقمية الأولى والموثوقة لكل مسلم يخطط لزيارة الحرمين الشريفين، من خلال تقديم معلومات دقيقة، صور واقعية، وأسعار منافسة، مدعومة بخدمة عملاء متميزة تفهم احتياجات المعتمر والحاج.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl hover:bg-white/10 transition-colors">
            <h2 className="text-3xl font-bold text-[#D4AF37] mb-6">لماذا تختارنا؟</h2>
            <ul className="grid md:grid-cols-2 gap-6">
              {[
                "أسعار تنافسية وعروض حصرية.",
                "معلومات دقيقة وصور عالية الجودة.",
                "دعم فني متواجد لخدمتكم.",
                "خيارات دفع آمنة ومتنوعة.",
                "تغطية شاملة لفنادق مكة والمدينة.",
                "سهولة البحث والحجز."
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-300">
                  <span className="text-[#D4AF37] text-xl">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
