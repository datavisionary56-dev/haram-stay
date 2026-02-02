import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'الأسئلة الشائعة | HaramStay',
  description: 'إجابات على الأسئلة الأكثر شيوعاً حول الحجز والإقامة مع HaramStay.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: "كيف يمكنني تأكيد حجزي؟",
      a: "بمجرد إتمام عملية الحجز والدفع، ستتلقى رسالة تأكيد عبر البريد الإلكتروني أو الواتساب تحتوي على كافة تفاصيل الحجز ورقم المرجع."
    },
    {
      q: "هل الأسعار شاملة الضرائب والرسوم؟",
      a: "نعم، جميع الأسعار المعروضة نهائية وتشمل كافة الضرائب والرسوم الحكومية، ما لم يذكر خلاف ذلك بوضوح في تفاصيل العرض."
    },
    {
      q: "ما هي سياسة الإلغاء؟",
      a: "تختلف سياسة الإلغاء حسب الفندق ونوع الغرفة المختار. يمكنك الاطلاع على شروط الإلغاء المحددة لكل غرفة قبل إتمام الحجز. بعض العروض غير قابلة للاسترداد."
    },
    {
      q: "هل يتوفر نقل من وإلى المطار؟",
      a: "نعم، نوفر خدمة النقل من وإلى مطار الملك عبد العزيز بجدة أو مطار الأمير محمد بن عبد العزيز بالمدينة المنورة كخدمة إضافية. يمكنك طلب هذه الخدمة أثناء الحجز أو التواصل مع خدمة العملاء."
    },
    {
      q: "هل الفنادق قريبة من الحرم؟",
      a: "نحرص في HaramStay على توضيح بعد كل فندق عن الحرم المكي أو المدني بدقة. يمكنك استخدام الفلاتر للبحث عن الفنادق المطلة على الكعبة أو القريبة من بوابات الحرم."
    },
    {
      q: "كيف يمكنني التواصل مع خدمة العملاء؟",
      a: "فريقنا متواجد لخدمتكم على مدار الساعة. يمكنك التواصل معنا عبر الواتساب، الهاتف، أو البريد الإلكتروني الموضح في صفحة 'اتصل بنا'."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans" dir="rtl">
      <nav className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent sticky top-0 z-50">
        <Link href="/" className="text-white/80 hover:text-[#D4AF37] flex items-center gap-2 backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full transition-all hover:bg-white/20">
          <span>→</span> العودة للرئيسية
        </Link>
        <h1 className="text-xl font-bold text-[#D4AF37] drop-shadow-md">HARAM STAY</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-12 text-center">الأسئلة الشائعة</h1>
        
        <div className="grid gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg hover:border-[#D4AF37]/30 transition-all">
              <h3 className="text-xl font-bold text-white mb-3 flex items-start gap-2">
                <span className="text-[#D4AF37]">?</span>
                {faq.q}
              </h3>
              <p className="text-gray-400 leading-relaxed pr-6 border-r-2 border-[#D4AF37]/20 mr-1">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-white/5 p-8 rounded-3xl border border-white/10">
          <h3 className="text-2xl font-bold mb-4">لم تجد إجابة لسؤالك؟</h3>
          <p className="text-gray-400 mb-6">فريقنا جاهز لمساعدتك في أي وقت.</p>
          <Link 
            href="/contact" 
            className="inline-block bg-[#D4AF37] text-black font-bold py-3 px-8 rounded-full hover:bg-[#b5952f] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            تواصل معنا
          </Link>
        </div>
      </div>
    </div>
  );
}
