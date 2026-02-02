import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaClock } from 'react-icons/fa';

export const articles = [
  {
    id: "umrah-guide-step-by-step",
    title: "دليل مناسك العمرة خطوة بخطوة (2025)",
    excerpt: "شرح مفصل ومصور لكيفية أداء مناسك العمرة، بدءاً من الإحرام وحتى التحلل، مع نصائح هامة للمعتمرين.",
    content: `
      <div class="space-y-6 text-lg leading-relaxed text-gray-200">
        <p>العمرة هي زيارة بيت الله الحرام في مكة المكرمة لأداء مناسك محددة، وهي سنة مؤكدة مرة واحدة في العمر. في هذا الدليل، سنشرح لك الخطوات بالتفصيل:</p>
        
        <div class="bg-white/5 p-6 rounded-2xl border border-white/10 my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-4">1. الإحرام (النية)</h3>
          <p>يبدأ المعتمر بالإحرام من الميقات المحدد لبلده. والإحرام هو نية الدخول في النسك.</p>
          <ul class="list-disc list-inside mt-4 space-y-2 text-gray-300">
            <li><strong>الاغتسال والتطيب:</strong> يسن للمعتمر أن يغتسل ويتطيب في بدنه.</li>
            <li><strong>لباس الإحرام:</strong> يلبس الرجل إزاراً ورداءً أبيضين، والمرأة تلبس ما شاءت من الثياب الساترة دون تبرج.</li>
            <li><strong>النية:</strong> يقول المعتمر "لبيك اللهم عمرة".</li>
          </ul>
        </div>

        <div class="bg-white/5 p-6 rounded-2xl border border-white/10 my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-4">2. الطواف حول الكعبة</h3>
          <p>عند الوصول إلى المسجد الحرام، يبدأ المعتمر بالطواف سبعة أشواط حول الكعبة المشرفة.</p>
          <ul class="list-disc list-inside mt-4 space-y-2 text-gray-300">
            <li>يبدأ كل شوط من الحجر الأسود وينتهي إليه.</li>
            <li>يسن للرجل الاضطباع (كشف الكتف الأيمن) والرمل (الإسراع في المشي) في الأشواط الثلاثة الأولى.</li>
            <li>يكثر من الذكر والدعاء وتلاوة القرآن.</li>
          </ul>
        </div>

        <div class="bg-white/5 p-6 rounded-2xl border border-white/10 my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-4">3. السعي بين الصفا والمروة</h3>
          <p>بعد الطواف وصلاة ركعتين خلف مقام إبراهيم، يتوجه المعتمر إلى المسعى.</p>
          <ul class="list-disc list-inside mt-4 space-y-2 text-gray-300">
            <li>يبدأ من الصفا وينتهي بالمروة (يعتبر شوطاً)، ثم يعود من المروة للصفا (شوطاً ثانياً).</li>
            <li>يكمل سبعة أشواط.</li>
            <li>يدعو الله بما شاء عند الصفا والمروة.</li>
          </ul>
        </div>

        <div class="bg-white/5 p-6 rounded-2xl border border-white/10 my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-4">4. التحلل (الحلق أو التقصير)</h3>
          <p>بعد الانتهاء من السعي، يقوم المعتمر بحلق شعر رأسه أو تقصيره (والحلق أفضل للرجال).</p>
          <p class="mt-2 text-[#D4AF37]">تقصر المرأة من شعرها قدر أنملة (رأس الإصبع).</p>
        </div>

        <p>بهذا تكون قد أتممت عمرتك، وتقبل الله طاعتك.</p>
      </div>
    `,
    image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=1200&auto=format&fit=crop",
    date: "12 رمضان 1446",
    author: "الشيخ أحمد الدوسري",
    readTime: "10 دقائق"
  },
  {
    id: "best-hotels-kaaba-view",
    title: "أفضل 5 فنادق مطلة على الكعبة (تحديث 2025)",
    excerpt: "قائمة مختارة لأرقى الفنادق التي توفر إطلالات بانورامية مباشرة على الكعبة المشرفة والمسجد الحرام.",
    content: `
      <div class="space-y-6 text-lg leading-relaxed text-gray-200">
        <p>تعتبر الإقامة في غرفة مطلة على الكعبة المشرفة حلماً يراود كل معتمر. إليك قائمتنا لأفضل الفنادق التي توفر هذه التجربة الروحانية الفريدة:</p>
        
        <div class="my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-2">1. فندق ساعة مكة فيرمونت (Fairmont Makkah Clock Royal Tower)</h3>
          <p>يقع داخل برج الساعة الشهير، ويوفر إطلالات لا مثيل لها على الحرم المكي بالكامل. يتميز بالفخامة المطلقة والخدمات الراقية.</p>
        </div>

        <div class="my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-2">2. قصر مكة رافلز (Raffles Makkah Palace)</h3>
          <p>يتميز بأجنحته الفاخرة وإطلالاته البانورامية المباشرة على الكعبة. خيار مثالي لمن يبحثون عن الخصوصية والرفاهية.</p>
        </div>

        <div class="my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-2">3. دار التوحيد إنتركونتيننتال (Dar Al Tawhid InterContinental)</h3>
          <p>يقع مباشرة أمام بوابة الملك فهد، ويتمتع بسمعة عريقة في تقديم أفضل الخدمات للحجاج والمعتمرين وكبار الشخصيات.</p>
        </div>

        <div class="my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-2">4. سويس أوتيل المقام (Swissôtel Al Maqam)</h3>
          <p>جزء من مجمع أبراج البيت، ويوفر مداخل مباشرة للحرم عبر نفق مكيف. خيار رائع للعائلات بفضل أسعاره المناسبة وخدماته الممتازة.</p>
        </div>

        <div class="my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-2">5. فندق كونراد مكة (Conrad Makkah)</h3>
          <p>يقع في جبل عمر، ويتميز بتصميمه العصري وغرفه الواسعة وإطلالاته الجميلة على الحرم.</p>
        </div>

        <div class="bg-[#D4AF37]/10 p-6 rounded-2xl border border-[#D4AF37]/30 mt-8">
          <strong>نصيحة:</strong> احجز غرفتك مبكراً، خاصة في مواسم الذروة مثل رمضان والحج، لضمان الحصول على الإطلالة التي ترغب بها.
        </div>
      </div>
    `,
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1200&auto=format&fit=crop",
    date: "8 رمضان 1446",
    author: "سارة محمد",
    readTime: "7 دقائق"
  },
  {
    id: "shopping-guide-makkah",
    title: "دليل التسوق في مكة: الأسواق الشعبية والمولات",
    excerpt: "اكتشف أفضل أماكن التسوق في مكة المكرمة لشراء الهدايا، التمور، والعطور، من الأسواق التقليدية إلى المراكز الحديثة.",
    content: `
      <div class="space-y-6 text-lg leading-relaxed text-gray-200">
        <p>لا تكتمل رحلة العمرة دون شراء الهدايا التذكارية للأهل والأصدقاء. مكة المكرمة تضم مزيجاً رائعاً من الأسواق الشعبية والمولات الفاخرة:</p>
        
        <div class="bg-white/5 p-6 rounded-2xl border border-white/10 my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-4">1. الأسواق الشعبية (أسعار مناسبة)</h3>
          <ul class="space-y-4">
            <li>
              <strong class="text-white">سوق العتيبية:</strong> يعتبر من أقدم وأشهر الأسواق وأرخصها. تجد فيه الملابس، الأقمشة، العبايات، والهدايا بأسعار تنافسية جداً.
            </li>
            <li>
              <strong class="text-white">سوق العزيزية:</strong> يقع في حي العزيزية، ويضم محلات الذهب، الملابس، والإكسسوارات.
            </li>
            <li>
              <strong class="text-white">سوق الستين:</strong> مشهور ببيع الأدوات المنزلية، الأقمشة، والجلديات.
            </li>
          </ul>
        </div>

        <div class="bg-white/5 p-6 rounded-2xl border border-white/10 my-8">
          <h3 class="text-2xl font-bold text-[#D4AF37] mb-4">2. المولات والمراكز الحديثة</h3>
          <ul class="space-y-4">
            <li>
              <strong class="text-white">مجمع أبراج البيت (Clock Tower):</strong> أفخم مول في مكة، يضم ماركات عالمية ومحلية، بالإضافة إلى ساحة مطاعم ضخمة.
            </li>
            <li>
              <strong class="text-white">سوق الضيافة:</strong> مول حديث بتصميم معماري جميل، يضم مناطق ترفيهية للأطفال ومطاعم متنوعة.
            </li>
            <li>
              <strong class="text-white">مكة مول:</strong> يعتبر من أكبر المولات، ويقع بعيداً قليلاً عن الحرم، لكنه يستحق الزيارة لتنوع محلاته.
            </li>
          </ul>
        </div>

        <div class="my-8">
          <h3 class="text-xl font-bold text-white mb-2">ماذا تشتري من مكة؟</h3>
          <ul class="list-disc list-inside text-gray-300 grid grid-cols-2 gap-2">
            <li>سجادة الصلاة</li>
            <li>ماء زمزم</li>
            <li>المسابح</li>
            <li>العطور والعود</li>
            <li>التمور (عجوة المدينة)</li>
            <li>الملابس التراثية</li>
          </ul>
        </div>
      </div>
    `,
    image: "https://images.unsplash.com/photo-1576785642838-86d49d9551c6?q=80&w=1200&auto=format&fit=crop",
    date: "5 رمضان 1446",
    author: "خالد العمري",
    readTime: "6 دقائق"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12" dir="rtl">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-[#D4AF37] mb-4 drop-shadow-lg">
            دليل المعتمر
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            مقالات ونصائح حصرية لتجعل رحلتك الإيمانية أكثر سهولة ويسراً.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link href={`/blog/${article.id}`} key={article.id} className="group">
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all hover:-translate-y-2 h-full flex flex-col">
                <div className="relative h-56 w-full">
                  <Image 
                    src={article.image} 
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-white/10">
                    <FaCalendarAlt className="text-[#D4AF37]" />
                    {article.date}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors leading-relaxed">
                    {article.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/10 pt-4 mt-auto">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-[#D4AF37]" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-[#D4AF37]" />
                      {article.readTime}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
