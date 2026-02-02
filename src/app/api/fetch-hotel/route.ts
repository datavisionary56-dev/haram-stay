import { NextResponse } from 'next/server';
import axios from 'axios';
import { scrapeGoogleMapsImages } from '@/lib/google-scraper';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    // التحقق مما إذا كان الرابط من خرائط جوجل
    if (url.includes('google.com/maps')) {
      return await handleGoogleMaps(url);
    }

    const hotelNameMatch = url.match(/hotel\/[a-z]{2}\/([^.?]+)/);
    const hotelSlug = hotelNameMatch ? hotelNameMatch[1].replace(/-/g, ' ') : null;

    if (!hotelSlug) return NextResponse.json({ success: false, error: "رابط غير صحيح" });

    const headers = {
      'x-rapidapi-key': '289205acf6msha2deef8357bf96bp1c034bjsnd00ce488ff32',
      'x-rapidapi-host': 'booking-com.p.rapidapi.com'
    };

    const searchRes = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/locations', {
      params: { name: hotelSlug, locale: 'ar' },
      headers
    });

    const hotelData = searchRes.data.find((item: { dest_type: string; dest_id: string }) => item.dest_type === 'hotel');
    if (!hotelData) throw new Error("لم يتم العثور على المعرف الرقمي");

    const hotelId = hotelData.dest_id;

    // جلب البيانات والصور والمرافق في وقت واحد
    const [detailsRes, photosRes, facilitiesRes] = await Promise.all([
      axios.get('https://booking-com.p.rapidapi.com/v1/hotels/data', {
        params: { hotel_id: hotelId, locale: 'ar' },
        headers
      }),
      axios.get('https://booking-com.p.rapidapi.com/v1/hotels/photos', {
        params: { hotel_id: hotelId, locale: 'ar' },
        headers
      }),
      axios.get('https://booking-com.p.rapidapi.com/v1/hotels/facilities', {
        params: { hotel_id: hotelId, locale: 'ar' },
        headers
      })
    ]);

    const finalData = detailsRes.data;
    
    // معالجة الصور بجودة عالية
    let allPhotos = [];
    if (Array.isArray(photosRes.data)) {
      allPhotos = photosRes.data.slice(0, 15).map(photo => 
        (photo.url_max1280 || photo.url_square60 || "").replace('square60', 'max1280')
      ).filter(u => u !== "");
    }

    if (allPhotos.length === 0 && finalData.main_photo_url) {
      allPhotos = [finalData.main_photo_url.replace('square60', 'max1280')];
    }

    // استخراج المرافق
    const facilities = facilitiesRes.data?.map((f: { facility_name: string }) => f.facility_name) || [];

    // استخراج الوصف (إذا لم يتوفر مباشرة، نستخدم وصفاً عاماً بناءً على البيانات)
    // ملاحظة: endpoint /data لا يعيد الوصف دائماً بشكل مباشر في بعض الحالات، 
    // ولكن سنحاول استخراجه أو بناء وصف جذاب.
    const description = finalData.description_translations?.find((d: { languagecode: string; description: string }) => d.languagecode === 'ar')?.description 
      || `استمتع بإقامة فاخرة في ${finalData.hotel_name}، الذي يتميز بموقعه الاستراتيجي في ${finalData.city}. يوفر الفندق خدمات مميزة لضيوف الرحمن.`;

    return NextResponse.json({
      success: true,
      data: {
        name: finalData.hotel_name || hotelSlug,
        images: allPhotos,
        stars: finalData.class || 5,
        location: finalData.city || "مكة المكرمة",
        // القضاء على علامات التنصيص نهائياً باستخدام Number()
        lat: Number(finalData.latitude), 
        lng: Number(finalData.longitude),
        description: description,
        facilities: facilities.slice(0, 10), // نأخذ أهم 10 مرافق
        originalUrl: url, // نحتفظ بالرابط الأصلي للحجز
        source: 'booking'
      }
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ فشل الجلب:", message);
    return NextResponse.json({ success: false, error: message || "خطأ في الجلب" });
  }
}

// دالة منفصلة للتعامل مع روابط جوجل ماب
async function handleGoogleMaps(url: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  // الخيار الأول: استخدام Puppeteer (مجاني، لا يحتاج مفتاح)
  if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY_HERE') {
    console.log("⚠️ لا يوجد مفتاح API، جاري استخدام الكشط الذكي (Puppeteer)...");
    
    try {
        const nameMatch = url.match(/place\/([^/@]+)/);
        let hotelName = "فندق غير معروف";
        if (nameMatch) {
             hotelName = decodeURIComponent(nameMatch[1]).replace(/\+/g, ' ');
        }
        
        // نمرر الاسم للبحث في صور جوجل إذا فشل الرابط المباشر
        const images = await scrapeGoogleMapsImages(url, hotelName);

        if (images.length === 0) {
             // Fallback: If scraper fails, return error asking for API key or valid link
             return NextResponse.json({ success: false, error: "فشل استخراج الصور تلقائياً. يرجى المحاولة لاحقاً أو إضافة API Key." });
        }

        return NextResponse.json({
            success: true,
            data: {
                name: hotelName,
                images: images,
                stars: 0,
                location: "موقع من خرائط جوجل",
                lat: 0, 
                lng: 0,
                description: "تم جلب الصور باستخدام التقنية الذكية من خرائط جوجل.",
                facilities: ["صور حقيقية"],
                originalUrl: url,
                source: 'google_maps_scraper'
            }
        });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ success: false, error: "فشل الكشط: " + message });
    }
  }

  // الخيار الثاني: استخدام Google Places API (إذا توفر المفتاح)
  try {
    const nameMatch = url.match(/place\/([^/@]+)/);
    if (!nameMatch) throw new Error("لم يتم العثور على اسم الفندق في الرابط");

    let hotelName = decodeURIComponent(nameMatch[1]).replace(/\+/g, ' ');
    hotelName = hotelName.replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim();

    console.log(`🔍 البحث في جوجل API عن: ${hotelName}`);

    const searchRes = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json`, {
      params: {
        input: hotelName,
        inputtype: 'textquery',
        fields: 'place_id,name,geometry',
        language: 'ar',
        key: apiKey
      }
    });

    let placeId;
    if (searchRes.data.candidates && searchRes.data.candidates.length > 0) {
        placeId = searchRes.data.candidates[0].place_id;
    } else {
        const textSearchRes = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
            params: { query: hotelName, language: 'ar', key: apiKey }
        });
        if (!textSearchRes.data.results || textSearchRes.data.results.length === 0) {
            throw new Error("لم يتم العثور على الفندق");
        }
        placeId = textSearchRes.data.results[0].place_id;
    }

    const detailsRes = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,rating,formatted_address,geometry,photos,editorial_summary,reviews',
        language: 'ar',
        key: apiKey
      }
    });

    const details = detailsRes.data.result;
    let images: string[] = [];
    if (details.photos) {
      images = details.photos.map((photo: { photo_reference: string }) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1280&photo_reference=${photo.photo_reference}&key=${apiKey}`
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        name: details.name,
        images: images,
        stars: 0,
        location: details.formatted_address,
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
        description: details.editorial_summary?.overview || `يقع ${details.name} في ${details.formatted_address}`,
        facilities: ["موقع مميز", "صور حقيقية", "تقييمات الزوار"],
        originalUrl: url,
        source: 'google_maps_api',
        rating: details.rating
      }
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Google Maps Error:", message);
    return NextResponse.json({ success: false, error: "فشل جلب البيانات من جوجل: " + message });
  }
}