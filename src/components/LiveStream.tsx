import React from 'react';

export default function LiveStream() {
  return (
    <div className="py-10 bg-gradient-to-b from-gray-900 to-black border-y border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-red-500 font-bold text-sm tracking-widest uppercase">بث مباشر</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">عش أجواء الحرم المكي الآن</h2>
            <p className="text-gray-300 leading-loose mb-6">
              شاهد البث المباشر من المسجد الحرام واستشعر الروحانية في كل لحظة. لا تفوت فرصة مشاهدة الطواف والصلاة مباشرة من قلب مكة المكرمة.
            </p>
            <button className="bg-[#D4AF37] text-black font-bold py-3 px-8 rounded-full hover:bg-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              احجز فندقاً مطلاً على الحرم
            </button>
          </div>

          <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/20">
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/live_stream?channel=UCC9g7p8y_1s9y-02z2yD-wQ&autoplay=1&mute=1" 
                title="Makkah Live"  
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-inset ring-white/10"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
