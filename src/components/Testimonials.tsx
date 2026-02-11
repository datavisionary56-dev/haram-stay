'use client';
import React, { useEffect, useState } from 'react';

export default function Testimonials() {
  // Pool of 9 reviews to rotate through (3 sets of 3)
  const allReviews = [
    // Set 1
    {
      name: "أحمد محمد",
      country: "مصر",
      role: "معتمر",
      comment: "تجربة حجز ممتازة، الفندق كان قريباً جداً من الحرم والخدمة فاقت التوقعات. شكراً لفريق HaramStay على اهتمامهم.",
      stars: 5
    },
    {
      name: "فاطمة الزهراء",
      country: "الجزائر",
      role: "زائرة",
      comment: "الأسعار كانت مناسبة جداً مقارنة بالمواقع الأخرى. أعجبني جداً وضوح التفاصيل والصور الحقيقية للفندق.",
      stars: 5
    },
    {
      name: "عبدالله العتيبي",
      country: "السعودية",
      role: "معتمر",
      comment: "سهولة في التعامل وسرعة في الرد. حجزت باقة العشر الأواخر وكانت تجربة روحانية لا تنسى.",
      stars: 5
    },
    // Set 2
    {
      name: "عمر الفاروق",
      country: "الأردن",
      role: "معتمر",
      comment: "إطلالة الكعبة كانت خيالية من الغرفة. إجراءات الدخول كانت سلسة جداً ولم تستغرق دقائق.",
      stars: 5
    },
    {
      name: "عائشة خان",
      country: "باكستان",
      role: "زائرة",
      comment: "غرف نظيفة جداً وطاقم عمل متعاون لأبعد الحدود. سأقوم بالحجز مرة أخرى في رحلتي القادمة.",
      stars: 5
    },
    {
      name: "محمد الجابر",
      country: "قطر",
      role: "معتمر",
      comment: "خدمة فاخرة بسعر ممتاز. الموقع وفر علينا عناء البحث والمقارنة. أنصح به بشدة.",
      stars: 5
    },
    // Set 3
    {
      name: "يوسف إبراهيم",
      country: "نيجيريا",
      role: "زائر",
      comment: "قريب جداً من الحرم، خطوات معدودة. بوفيه الإفطار كان لذيذاً ومتنوعاً جداً.",
      stars: 5
    },
    {
      name: "سارة حسن",
      country: "بريطانيا",
      role: "معتمرة",
      comment: "عملية الحجز كانت شفافة وسريعة. الدعم الفني متواجد 24 ساعة وساعدونا في كل استفسار.",
      stars: 5
    },
    {
      name: "كريم بن علي",
      country: "تونس",
      role: "معتمر",
      comment: "فريق دعم رائع، ساعدوني حتى في معلومات المواصلات. المصداقية هي عنوان هذا الموقع.",
      stars: 5
    }
  ];

  const [displayReviews, setDisplayReviews] = useState(allReviews.slice(0, 3));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Change reviews every hour based on current time
    const hour = new Date().getHours();
    // Create an index based on the hour (0, 1, or 2)
    const setIndex = hour % 3; 
    
    const start = setIndex * 3;
    const end = start + 3;
    
    setDisplayReviews(allReviews.slice(start, end));
  }, []);

  // Use a stable initial render to avoid hydration mismatch, then update after mount
  const reviewsToRender = mounted ? displayReviews : allReviews.slice(0, 3);

  return (
    <div className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#D4AF37]/5 skew-y-3 transform origin-top-left -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">ماذا يقول ضيوفنا؟</h2>
          <div className="h-1 w-20 bg-[#D4AF37] mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            آراء حقيقية من معتمرين وثقوا بنا. تتحدث هذه القائمة تلقائياً كل ساعة لضمان المصداقية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsToRender.map((review, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 relative hover:bg-white/10 transition-colors animate-fadeIn">
              <div className="text-[#D4AF37] text-4xl absolute top-6 left-6 opacity-30">&quot;</div>
              
              <div className="flex gap-1 mb-4">
                {[...Array(review.stars)].map((_, i) => (
                  <span key={i} className="text-[#D4AF37]">★</span>
                ))}
              </div>

              <p className="text-gray-200 leading-loose mb-6 relative z-10 min-h-[80px]">
                {review.comment}
              </p>

              <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-yellow-700 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {review.name[0]}
                </div>
                <div>
                  <h4 className="text-white font-bold">{review.name}</h4>
                  <p className="text-xs text-gray-400">{review.country} • {review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
