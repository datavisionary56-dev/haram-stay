'use client';

import React, { useState, useEffect } from 'react';
import { FaUpload, FaSave, FaArrowRight, FaTerminal, FaWifi } from 'react-icons/fa';
import Link from 'next/link';
import { db, auth } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, query, where, arrayUnion } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

export default function AdminSecretPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [selectedHotel, setSelectedHotel] = useState('fairmont');
  const [newHotelName, setNewHotelName] = useState('');
  const [category, setCategory] = useState('front_row'); // Default category

  // Prices State
  const [priceRamadan1to20, setPriceRamadan1to20] = useState(''); // Was priceNightly
  const [priceRamadanLast10, setPriceRamadanLast10] = useState(''); // Was priceLast10
  
  // New Fields
  const [extraBedPrice, setExtraBedPrice] = useState('');
  const [stars, setStars] = useState('5');
  const [distance, setDistance] = useState('');
  const [streetName, setStreetName] = useState('');

  const [files, setFiles] = useState<FileList | null>(null);
  const [projectId, setProjectId] = useState('');

  const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    setLogs(prev => [`[${timestamp}] ${prefix} ${message}`, ...prev]);
  };

  useEffect(() => {
    // Show which project we are connected to
    setProjectId(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'unknown');
    
    addLog(`Environment Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`, 'info');

    addLog("جاري محاولة الاتصال بـ Firebase...", 'info');
    signInAnonymously(auth)
      .then((userCred) => {
        addLog(`✅ تم الاتصال بنجاح! (User ID: ${userCred.user.uid})`, 'success');
        setIsConnected(true);
      })
      .catch((error) => {
        console.error("Auth Error:", error);
        addLog(`❌ فشل الاتصال: ${error.message}`, 'error');
        addLog(`⚠️ تأكد من تفعيل 'Anonymous' في Firebase Authentication > Sign-in method`, 'error');
        setIsConnected(false);
      });
  }, []);

  const testConnection = async () => {
      try {
          addLog("جاري اختبار الكتابة في قاعدة البيانات...", 'info');
          const testRef = doc(collection(db, "system_logs"));
          await setDoc(testRef, { 
              message: "Test Connection", 
              timestamp: new Date().toISOString(),
              uid: auth.currentUser?.uid || 'unknown'
          });
          addLog("✅ نجح اختبار الكتابة في Firestore!", 'success');
          alert("الاتصال يعمل بشكل ممتاز! يمكنك البدء في رفع الفنادق.");
      } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          console.error("Test Error:", error);
          addLog(`❌ فشل اختبار الكتابة: ${message}`, 'error');
          if (error instanceof Error && (error as { code?: string }).code === 'permission-denied') {
              addLog(`⚠️ خطأ في الصلاحيات! يجب تعديل Firestore Rules إلى: allow read, write: if true;`, 'error');
          }
          alert(`فشل الاتصال: ${message}`);
      }
  };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('جاري المعالجة...');
    setLogs([]); // Clear previous logs
    addLog("بدء عملية الرفع والحفظ...", 'info');
    
    // Auth Check
    let currentUser = auth.currentUser;
    if (!currentUser) {
        try {
            addLog("⚠️ لم يتم العثور على جلسة نشطة، جاري تسجيل الدخول...", 'info');
            const userCred = await signInAnonymously(auth);
            currentUser = userCred.user;
            addLog(`✅ تم تسجيل الدخول بنجاح (UID: ${currentUser.uid})`, 'success');
        } catch (authError: unknown) {
            const message = authError instanceof Error ? authError.message : String(authError);
            console.error("Auth failed:", authError);
            addLog(`⚠️ فشل تسجيل الدخول المجهول: ${message}`, 'error');
            addLog(`⚠️ جاري محاولة الحفظ بدون تسجيل دخول (يعتمد على قواعد الأمان)...`, 'info');
            // Do not return here - let it proceed!
        }
    }

    try {
        const hotelId = selectedHotel;
        let hotelName = "";
        let folderName = "";

        // 1. Determine Hotel Info
        if (selectedHotel === 'new_hotel') {
            if (!newHotelName) throw new Error("اسم الفندق الجديد مطلوب");
            hotelName = newHotelName;
            // Sanitize folder name: remove special chars. If result is empty or just underscores (common for Arabic names), use timestamp.
            let safeName = newHotelName.replace(/\s+/g, '_').toLowerCase().replace(/[^a-z0-9_]/g, '');
            if (!safeName || /^_+$/.test(safeName)) {
                safeName = "hotel_" + Date.now();
            }
            folderName = safeName;
        } else {
            folderName = selectedHotel;
            if (selectedHotel === 'fairmont') hotelName = "فندق فيرمونت مكة";
            else if (selectedHotel === 'dar_al_wafideen') hotelName = "فندق دار الوافدين";
            else hotelName = selectedHotel;
        }

        addLog(`تم تحديد الفندق: ${hotelName} (المجلد: ${folderName})`, 'info');
        console.log(`Target Collection: hotels, Folder: ${folderName}`);

        // 2. Upload Images to Firebase Storage (Server-Side Bypass)
        const uploadPromises = Array.from(files || []).map(async (file) => {
            try {
                addLog(`جاري رفع ${file.name} عبر السيرفر (تجاوز CORS)...`, 'info');
                
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', `hotels/${folderName}`);

                const response = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Upload failed');
                }

                const data = await response.json();
                
                console.log(`Upload Success: ${file.name} -> ${data.url}`);
                addLog(`✅ تم رفع ${file.name}`, 'success');
                return { status: 'fulfilled', url: data.url };
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                console.error(`Upload Failed: ${file.name}`, error);
                addLog(`❌ فشل رفع ${file.name}: ${message}`, 'error');
                return { status: 'rejected', reason: error };
            }
        });

        setStatus(`جاري رفع ${files?.length || 0} صور...`);
        const uploadResults = await Promise.all(uploadPromises);
        
        const imageUrls = uploadResults
            .filter((result): result is { status: 'fulfilled', url: string } => result.status === 'fulfilled')
            .map(result => result.url);

        if (imageUrls.length === 0 && files && files.length > 0) {
            addLog("⚠️ فشل رفع جميع الصور! سيتم حفظ بيانات الفندق النصية فقط (Fallback Mode).", 'error');
            addLog("⚠️ السبب المحتمل: خدمة التخزين (Storage) غير مفعلة في فيربيز.", 'error');
            addLog("💡 الحل: اذهب إلى Firebase Console -> Storage واضغط 'Get Started' لتفعيله.", 'info');
        }

        console.log("All Uploads Finished. Successful URLs:", imageUrls);

        // 3. Prepare Data for Firestore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {
            updatedAt: new Date().toISOString()
        };

        if (hotelName) updateData.name = hotelName;
        if (priceRamadan1to20) updateData.priceRamadan1to20 = Number(priceRamadan1to20);
        if (priceRamadanLast10) updateData.priceRamadanLast10 = Number(priceRamadanLast10);
        if (extraBedPrice) updateData.extraBedPrice = Number(extraBedPrice);
        if (stars) updateData.stars = Number(stars);
        if (distance) updateData.distance = distance;
        if (streetName) updateData.streetName = streetName;
        updateData.category = category; // Save category

        // Pricing Rules (Legacy Support & Structure)
        const newRange = {
            start: "2025-03-01", // Ramadan Start approx
            end: "2025-03-20",
            weekdayPrice: Number(priceRamadan1to20 || 0),
            weekendPrice: Number(priceRamadan1to20 || 0),
            extraBed: Number(extraBedPrice || 0),
            notes: "1-20 رمضان"
        };
        
        // 4. Save to Firestore
        setStatus('جاري حفظ البيانات في قاعدة البيانات...');
        addLog("جاري حفظ البيانات في Firestore...", 'info');
        
        let docRef;
        let isNewDoc = false;

        if (selectedHotel === 'new_hotel') {
            const q = query(collection(db, "hotels"), where("name", "==", hotelName));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                docRef = doc(db, "hotels", querySnapshot.docs[0].id);
                addLog(`تم العثور على فندق موجود بنفس الاسم (ID: ${docRef.id})، سيتم تحديثه.`, 'info');
            } else {
                isNewDoc = true;
                docRef = doc(collection(db, "hotels"));
                addLog(`إنشاء سجل فندق جديد (ID: ${docRef.id}).`, 'info');
            }
        } else {
            docRef = doc(db, "hotels", selectedHotel); 
            addLog(`تحديث فندق موجود (ID: ${selectedHotel}).`, 'info');
        }

        const finalData = { ...updateData };
        
        if (imageUrls.length > 0) {
             if (isNewDoc) {
                 finalData.images = imageUrls;
             } else {
                 finalData.images = arrayUnion(...imageUrls);
             }
        }
        
        if (isNewDoc) {
             finalData.pricingRules = {
                 commission: 0,
                 ranges: [newRange]
             };
             if (priceRamadanLast10) {
                 finalData.pricingRules.ranges.push({
                    start: "2025-03-20", 
                    end: "2025-03-30",
                    weekdayPrice: Number(priceRamadanLast10),
                    weekendPrice: Number(priceRamadanLast10),
                    extraBed: Number(extraBedPrice || 0),
                    notes: "العشر الأواخر",
                    isPackage: true,
                    packagePrice: Number(priceRamadanLast10)
                 });
             }
             finalData.city = "مكة المكرمة";
             finalData.stars = Number(stars);
             finalData.description = "وصف الفندق...";
             finalData.location = "موقع الفندق...";
             finalData.facilities = ["واي فاي", "موقف سيارات"];
             finalData.lat = 21.4;
             finalData.lng = 39.8;
        } else {
             finalData.pricingRules = {
                 commission: 0,
                 ranges: [newRange]
             };
             if (priceRamadanLast10) {
                 finalData.pricingRules.ranges.push({
                    start: "2025-03-20", 
                    end: "2025-03-30",
                    weekdayPrice: Number(priceRamadanLast10),
                    weekendPrice: Number(priceRamadanLast10),
                    extraBed: Number(extraBedPrice || 0),
                    notes: "العشر الأواخر",
                    isPackage: true,
                    packagePrice: Number(priceRamadanLast10)
                 });
             }
        }

        await setDoc(docRef, finalData, { merge: true });
        
        addLog(`تم حفظ البيانات بنجاح!`, 'success');
        setStatus(`تم الحفظ بنجاح! ID: ${docRef.id}`);
        setFiles(null);
        
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(error);
        addLog(`خطأ عام: ${message}`, 'error');
        setStatus(`فشلت العملية: ${message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#D4AF37]">Admin Center</h1>
            <p className="text-xs text-gray-500 mt-1">Project: {projectId}</p>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={testConnection}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${isConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
                <FaWifi /> {isConnected === null ? 'جاري الاتصال...' : isConnected ? 'متصل (اضغط للاختبار)' : 'غير متصل'}
            </button>
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                العودة للرئيسية <FaArrowRight />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
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
                            className="w-full p-3 bg-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#D4AF37] outline-none"
                            placeholder="مثال: فندق الصفوة"
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">سعر الليلة (1-20 رمضان)</label>
                        <input 
                            type="number" 
                            value={priceRamadan1to20}
                            onChange={(e) => setPriceRamadan1to20(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                            placeholder="مثال: 450"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">سعر الليلة (العشر الأواخر)</label>
                        <input 
                            type="number" 
                            value={priceRamadanLast10}
                            onChange={(e) => setPriceRamadanLast10(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                            placeholder="مثال: 3500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">سعر السرير الإضافي</label>
                        <input 
                            type="number" 
                            value={extraBedPrice}
                            onChange={(e) => setExtraBedPrice(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                            placeholder="مثال: 150"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">عدد النجوم</label>
                        <select 
                            value={stars}
                            onChange={(e) => setStars(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                        >
                            <option value="1">1 نجمة</option>
                            <option value="2">2 نجمة</option>
                            <option value="3">3 نجوم</option>
                            <option value="4">4 نجوم</option>
                            <option value="5">5 نجوم</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">المسافة للحرم (متر)</label>
                        <input 
                            type="text" 
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                            placeholder="مثال: 100 متر"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">اسم الشارع (اختياري)</label>
                        <input 
                            type="text" 
                            value={streetName}
                            onChange={(e) => setStreetName(e.target.value)}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white text-center"
                            placeholder="مثال: شارع أجياد"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">تصنيف العرض (الصفحة الرئيسية)</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-white"
                    >
                      <option value="front_row">فنادق الصف الأول (Front Row)</option>
                      <option value="ajyad_khalil">فنادق إبراهيم الخليل وأجياد</option>
                      <option value="madinah">فنادق المدينة المنورة</option>
                    </select>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-[#D4AF37] transition-colors">
                <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => setFiles(e.target.files)}
                    className="hidden" 
                    id="hotel-images"
                />
                <label htmlFor="hotel-images" className="cursor-pointer flex flex-col items-center gap-2">
                    <FaUpload className="text-3xl text-gray-400" />
                    <span className="text-gray-300">اختر صور الفندق (يمكنك اختيار أكثر من صورة)</span>
                    {files && <span className="text-[#D4AF37] font-bold">{files.length} ملفات تم اختيارها</span>}
                </label>
                </div>

                <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#b5952f] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                {loading ? (
                    <>جاري الرفع والحفظ...</>
                ) : (
                    <>
                    <FaSave /> حفظ وتحديث البيانات
                    </>
                )}
                </button>

                {status && (
                <div className={`p-4 rounded-lg text-center font-bold ${status.includes('نجاح') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
                    {status}
                </div>
                )}
            </form>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-black rounded-2xl p-6 shadow-2xl border border-gray-800 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
                        <FaTerminal className="text-[#D4AF37]" />
                        <h3 className="text-lg font-bold text-gray-200">سجل العمليات (System Logs)</h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto max-h-[600px] font-mono text-sm space-y-2 custom-scrollbar">
                        {logs.length === 0 ? (
                            <p className="text-gray-600 italic text-center mt-10">بانتظار بدء العملية...</p>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="p-2 rounded bg-gray-900/50 border-l-2 border-gray-700 break-words">
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <p className="text-xs text-gray-500 text-center">
                            في حال واجهت خطأ &quot;Permission denied&quot;، يرجى التأكد من قواعد الأمان في Firebase Storage.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
