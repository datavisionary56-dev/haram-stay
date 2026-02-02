import React from 'react';
import { FaShieldAlt, FaHeadset, FaHotel, FaMoneyBillWave } from 'react-icons/fa';

export default function TrustFeatures() {
  const features = [
    {
      icon: <FaShieldAlt className="text-4xl text-[#D4AF37] mb-4" />,
      title: "حجز آمن ومؤكد",
      desc: "نضمن لك حجزاً مؤكداً مع خيارات دفع آمنة ومشفرة بالكامل."
    },
    {
      icon: <FaHeadset className="text-4xl text-[#D4AF37] mb-4" />,
      title: "دعم فني 24/7",
      desc: "فريقنا متواجد على مدار الساعة لخدمتك عبر الواتساب والهاتف."
    },
    {
      icon: <FaHotel className="text-4xl text-[#D4AF37] mb-4" />,
      title: "أفضل فنادق الحرم",
      desc: "نختار لك بعناية أرقى الفنادق بأفضل الإطلالات على الكعبة المشرفة."
    },
    {
      icon: <FaMoneyBillWave className="text-4xl text-[#D4AF37] mb-4" />,
      title: "أفضل الأسعار",
      desc: "نقدم لك عروضاً حصرية وأسعاراً تنافسية لا تجدها في مكان آخر."
    }
  ];

  return (
    <div className="py-16 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-all hover:-translate-y-2">
              {feature.icon}
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
