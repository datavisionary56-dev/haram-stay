import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogPreview() {
  const articles = [
    {
      id: "umrah-guide-step-by-step",
      title: "دليل مناسك العمرة خطوة بخطوة (2025)",
      excerpt: "شرح مفصل ومصور لكيفية أداء مناسك العمرة، بدءاً من الإحرام وحتى التحلل.",
      image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=800&auto=format&fit=crop",
      date: "12 رمضان 1446"
    },
    {
      id: "best-hotels-kaaba-view",
      title: "أفضل 5 فنادق مطلة على الكعبة",
      excerpt: "قائمة مختارة لأرقى الفنادق التي توفر إطلالات بانورامية مباشرة على الكعبة المشرفة.",
      image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop",
      date: "8 رمضان 1446"
    },
    {
      id: "shopping-guide-makkah",
      title: "دليل التسوق في مكة المكرمة",
      excerpt: "اكتشف أفضل أماكن التسوق، من الأسواق الشعبية الرخيصة إلى المولات الفاخرة.",
      image: "https://images.unsplash.com/photo-1576785642838-86d49d9551c6?q=80&w=800&auto=format&fit=crop",
      date: "5 رمضان 1446"
    }
  ];

  return (
    <div className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">دليل المعتمر</h2>
            <div className="h-1 w-20 bg-[#D4AF37] rounded-full" />
            <p className="text-gray-400 mt-4">مقالات ونصائح لتجعل رحلتك أكثر سهولة وروحانية.</p>
          </div>
          <Link href="/blog" className="hidden md:flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors">
            عرض كل المقالات <span>←</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <Link href={`/blog/${article.id}`} key={idx} className="group cursor-pointer">
              <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-4">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                <Image 
                  src={article.image} 
                  alt={article.title}
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                <span className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10">
                  {article.date}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors leading-relaxed">
                {article.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {article.excerpt}
              </p>
              <span className="text-[#D4AF37] text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                اقرأ المزيد <span>←</span>
              </span>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
             <Link href="/blog" className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors border border-[#D4AF37]/30 px-6 py-2 rounded-full">
            عرض كل المقالات <span>←</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
