import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaCalendarAlt, FaUser, FaClock, FaArrowRight } from 'react-icons/fa';
import { articles } from '../page'; // Import articles from the main blog page

// This is required for static site generation with dynamic routes
export function generateStaticParams() {
  return articles.map((article) => ({
    id: article.id,
  }));
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const article = articles.find((a) => a.id === params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12" dir="rtl">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full mb-12">
        <Image 
          src={article.image} 
          alt={article.title}
          fill
          className="object-cover opacity-60"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#D4AF37] mb-6 hover:text-white transition-colors">
            <FaArrowRight /> العودة للمدونة
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl mb-6 leading-tight max-w-4xl">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-300">
            <div className="flex items-center gap-2">
              <FaUser className="text-[#D4AF37]" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#D4AF37]" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-[#D4AF37]" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <div 
          className="prose prose-lg prose-invert max-w-none prose-headings:text-[#D4AF37] prose-a:text-[#D4AF37] prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        {/* Share / Tags Section (Optional) */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4">
          <span className="text-gray-400">مشاركة المقال:</span>
          {/* Add share buttons here if needed */}
        </div>
      </div>
    </div>
  );
}
