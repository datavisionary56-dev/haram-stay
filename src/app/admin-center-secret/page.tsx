'use client';

import React, { useState } from 'react';
import { FaUpload, FaSave, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminSecretPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('fairmont');
  const [newHotelName, setNewHotelName] = useState('');
  
  // Prices State
  const [priceNightly, setPriceNightly] = useState('');
  const [priceWeekend, setPriceWeekend] = useState('');
  const [priceLast10, setPriceLast10] = useState('');
  
  // New Fields
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [extraBedPrice, setExtraBedPrice] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('جاري المعالجة...');
    
    try {
        const formData = new FormData();
        formData.append('hotelId', selectedHotel);
        if (selectedHotel === 'new_hotel') {
             formData.append('newHotelName', newHotelName);
        }
        
        const prices = {
             nightly: priceNightly,
             weekend: priceWeekend,
             last10: priceLast10,
             startDate,
             endDate,
             extraBedPrice
        };
        formData.append('prices', JSON.stringify(prices));
        
        if (files) {
             for (let i = 0; i < files.length; i++) {
                 formData.append('files', files[i]);
             }
        }

        const res = await fetch('/api/admin-upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await res.json();
        
        if (data.success) {
            setStatus(`تم العملية بنجاح! ${data.message}`);
        } else {
            setStatus(`فشلت العملية: ${data.error || 'خطأ غير معروف'}`);
        }
    } catch (error: any) {
        setStatus(`حدث خطأ في الاتصال: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#D4AF37]">Admin Center</h1>
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            العودة للرئيسية <FaArrowRight />
          </Link>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">إدارة الفنادق</h2>
          
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">اختر الفندق</label>
              <select 
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white"
              >
                <option value="fairmont">فندق فيرمونت مكة (Fairmont Makkah)</option>
                <option value="dar_al_wafideen">فندق دار الوافدين (Dar Al Wafideen)</option>
                <option value="new_hotel">--- إضافة فندق جديد ---</option>
              </select>
            </div>

            {selectedHotel === 'new_hotel' && (
                <div className="bg-gray-700/50 p-4 rounded-xl border border-[#D4AF37]/30 animate-fadeIn">
                    <label className="block text-sm font-bold mb-2 text-[#D4AF37]">اسم الفندق الجديد</label>
                    <input 
                        type="text" 
                        value={newHotelName}
                        onChange={(e) => setNewHotelName(e.target.value)}
                        placeholder="أدخل اسم الفندق الجديد هنا..." 
                        required
                        className="w-full p-3 bg-gray-900 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white" 
                    />
                    <p className="text-xs text-gray-400 mt-2">* سيتم إنشاء مجلد صور جديد تلقائياً لهذا الفندق.</p>
                </div>
            )}
            
            <div className="p-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer text-center relative">
              <FaUpload className="mx-auto text-3xl mb-2 text-gray-400" />
              <label className="block text-sm font-medium text-gray-300 cursor-pointer w-full h-full absolute inset-0 flex items-center justify-center opacity-0">
                <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={(e) => setFiles(e.target.files)}
                />
              </label>
              <span className="block text-sm font-medium text-gray-300">
                  {files && files.length > 0 ? `${files.length} صور تم اختيارها` : "رفع الصور الجديدة (اضغط هنا)"}
              </span>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG allowed (Auto WebP Conversion)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">سعر الليلة (عادية)</label>
                    <input 
                        type="number" 
                        value={priceNightly}
                        onChange={(e) => setPriceNightly(e.target.value)}
                        placeholder="2500" 
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">سعر الويك إيند</label>
                    <input 
                        type="number" 
                        value={priceWeekend}
                        onChange={(e) => setPriceWeekend(e.target.value)}
                        placeholder="3100" 
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300 font-tajawal">تاريخ البداية (من)</label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white font-tajawal" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300 font-tajawal">تاريخ النهاية (إلى)</label>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white font-tajawal" 
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2 text-gray-300 font-tajawal">سعر السرير الإضافي</label>
                <input 
                    type="number" 
                    value={extraBedPrice}
                    onChange={(e) => setExtraBedPrice(e.target.value)}
                    placeholder="350" 
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white font-tajawal" 
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">سعر العشر الأواخر</label>
                <input 
                    type="number" 
                    value={priceLast10}
                    onChange={(e) => setPriceLast10(e.target.value)}
                    placeholder="76000" 
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white" 
                />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-lg hover:bg-[#b5952f] transition flex items-center justify-center gap-2"
            >
              {loading ? 'جاري الحفظ...' : <><FaSave /> حفظ وتحديث البيانات</>}
            </button>
            
            {status && (
                <div className={`mt-4 p-3 rounded-lg text-center font-bold border ${status.includes('فشلت') ? 'bg-red-900/50 border-red-700 text-red-400' : 'bg-green-900/50 border-green-700 text-green-400'}`}>
                    {status}
                </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
