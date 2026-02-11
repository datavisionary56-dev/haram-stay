import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-4">سياسة الخصوصية</h1>
          <p className="text-gray-400">آخر تحديث: 1447هـ</p>
        </header>

        <section className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-4">مقدمة</h2>
          <p className="text-gray-300 leading-relaxed">
            مرحباً بكم في HaramStay. نحن نولي أهمية قصوى لخصوصية زوارنا وعملائنا. توضح هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمونها لنا عند استخدام موقعنا لحجز الفنادق في مكة المكرمة والمدينة المنورة.
          </p>
        </section>

        <section className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-4">المعلومات التي نجمعها</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 leading-relaxed">
            <li>معلومات الاتصال: مثل الاسم، رقم الهاتف، والبريد الإلكتروني عند التواصل معنا أو إتمام حجز.</li>
            <li>تفاصيل الحجز: تواريخ الوصول والمغادرة، وعدد الضيوف، والغرف المطلوبة.</li>
            <li>المعلومات التقنية: قد نجمع معلومات غير شخصية مثل نوع المتصفح وعنوان IP لتحسين تجربة المستخدم.</li>
          </ul>
        </section>

        <section className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-4">كيف نستخدم معلوماتك</h2>
          <p className="text-gray-300 leading-relaxed">
            نستخدم المعلومات التي نجمعها للأغراض التالية:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2 leading-relaxed">
            <li>إتمام وتأكيد حجوزات الفنادق الخاصة بك.</li>
            <li>التواصل معك عبر واتساب أو البريد الإلكتروني لتأكيد التفاصيل أو الرد على استفساراتك.</li>
            <li>تحسين خدماتنا وتجربة المستخدم على الموقع.</li>
            <li>إرسال عروض خاصة وموسمية (مثل عروض رمضان) إذا وافقت على ذلك.</li>
          </ul>
        </section>

        <section className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-4">حماية المعلومات</h2>
          <p className="text-gray-300 leading-relaxed">
            نحن نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفشاء. لا نقوم ببيع أو تأجير بياناتك الشخصية لأي طرف ثالث.
          </p>
        </section>

        <section className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-4">التواصل معنا</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر:
          </p>
          <div className="flex flex-col gap-2">
            <a href="https://wa.me/966548690356" className="text-[#D4AF37] hover:underline text-lg">
              واتساب: +966 54 869 0356
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
