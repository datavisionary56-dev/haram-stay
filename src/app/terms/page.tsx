import React from 'react';

export const metadata = {
  title: 'شروط الخدمة | HaramStay',
  description: 'شروط الخدمة والاستخدام لمنصة HaramStay.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans" dir="rtl">
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-8 text-center">شروط الخدمة</h1>
        
        <div className="space-y-8 text-gray-300 leading-loose">
          <section className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">1. مقدمة</h2>
            <p>
              مرحباً بكم في منصة HaramStay. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بشروط الخدمة هذه، وجميع القوانين واللوائح المعمول بها، وتقر بأنك مسؤول عن الامتثال لأي قوانين محلية سارية.
            </p>
          </section>

          <section className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">2. الحجز والدفع</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>يجب أن تكون جميع المعلومات المقدمة أثناء عملية الحجز دقيقة وكاملة.</li>
              <li>الأسعار المعروضة قابلة للتغيير بناءً على التوافر والموسم.</li>
              <li>يتم تأكيد الحجز بعد استلام الدفع أو تأكيد الحجز المبدئي عبر الوسائل المتاحة.</li>
            </ul>
          </section>

          <section className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">3. سياسة الإلغاء</h2>
            <p>
              تخضع سياسات الإلغاء والاسترداد للشروط الخاصة بكل فندق أو باقة. يرجى مراجعة شروط الحجز المحددة قبل إتمام عملية الدفع. في بعض الحالات، قد تكون الحجوزات غير قابلة للاسترداد.
            </p>
          </section>

          <section className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">4. حقوق الملكية الفكرية</h2>
            <p>
              جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص والصور والشعارات، هي ملك لـ HaramStay أو مرخصيها ومحمية بموجب قوانين حقوق النشر والعلامات التجارية.
            </p>
          </section>

          <section className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">5. إخلاء المسؤولية</h2>
            <p>
              يتم توفير المواد الموجودة على موقع HaramStay "كما هي". لا تقدم HaramStay أي ضمانات، صريحة أو ضمنية، وتخلي مسؤوليتها عن كافة الضمانات الأخرى.
            </p>
          </section>

          <section className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">6. تعديلات الشروط</h2>
            <p>
              قد تقوم HaramStay بمراجعة شروط الخدمة هذه لموقعها الإلكتروني في أي وقت دون إشعار مسبق. باستخدامك لهذا الموقع، فإنك توافق على الالتزام بالإصدار الحالي من شروط الخدمة هذه.
            </p>
          </section>
          
           <section className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">7. القانون الواجب التطبيق</h2>
            <p>
              تخضع هذه الشروط والأحكام وتفسر وفقاً لقوانين المملكة العربية السعودية، وتخضع أنت بشكل غير قابل للنقض للاختصاص القضائي الحصري للمحاكم في تلك الدولة أو الموقع.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
