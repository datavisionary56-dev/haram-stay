import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const hotelsRef = collection(db, "hotels");
    console.log("Connecting to Firestore Project:", db.app.options.projectId);

    if (type === "verify_db") {
      const snapshot = await getDocs(hotelsRef);
      const hotels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return NextResponse.json({ 
        success: true, 
        count: hotels.length,
        hotels: hotels 
      });
    }
    
    // 1. Get ALL existing docs
    const snapshot = await getDocs(hotelsRef);
    // IMPORTANT: Store doc ID as 'docId' to avoid overwriting if data contains 'id' field
    const hotels = snapshot.docs.map(d => ({ docId: d.id, data: d.data() }));
    
    const logs: string[] = [];
    logs.push(`Timestamp: ${new Date().toISOString()}`);
    logs.push(`Connected to Project: ${db.app.options.projectId}`);
    logs.push(`Found ${hotels.length} existing hotels.`);

    // 2. Define Target Hotels (Restoring FULL LIST + Rich Data for Swiss/Sheraton)
    const targetHotels = [
      // --- RICH DATA HOTELS (Requested specifically) ---
      {
        id: "swissotel-al-maqam",
        name: "سويس أوتيل المقام مكة",
        nameEn: "Swissôtel Al Maqam Makkah",
        location: "مكة المكرمة - وقف الملك عبدالعزيز",
        city: "مكة المكرمة - وقف الملك عبدالعزيز",
        lat: 21.4198,
        lng: 39.8253,
        stars: 5,
        price: 850,
        night_price: 850,
        price1to20: 850,
        description: `يقع فندق سويس أوتيل المقام مكة في برج مرتفع في قلب العالم الإسلامي، ويتميز بإطلالات على المدينة المقدسة. والفندق جزء من مجمع أبراج البيت الرائع ويواجه الكعبة المشرفة ويتيح الوصول المباشر إلى المسجد الحرام من شارع إبراهيم الخليل ومدخل نفق أم القرى. كما تتوفر إمكانية أخرى للدخول المباشر إلى الفندق من مجمع أبراج البيت.

تتميز الغرف والأجنحة البالغ عددها 1,624 بأجواء دافئة، ويتميز العديد منها بإطلالات رائعة على الكعبة المشرفة.

يتميز مطعم Al Khairat وصالة Masharif للشاي بأجواء منعشة مع خدمة ذات جودة عالية، بالإضافة إلى تقديم مجموعة متنوعة من المأكولات الشهية الدولية والشرقية.

لضمان تجربة تسوق مريحة في مكة المكرمة، يوفر الفندق إمكانية الوصول المباشر إلى مركز التسوق الموجود في مجمع أبراج البيت. ويعد مطار الملك عبد العزيز الدولي أقرب المطارات من مكان الإقامة، حيث يقع على مسافة 75 كم.`,
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Swissotel_Hotels_and_Resorts_logo.svg/1200px-Swissotel_Hotels_and_Resorts_logo.svg.png",
        images: [
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Abraj_Al_Bait_Towers.JPG/1280px-Abraj_Al_Bait_Towers.JPG",
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1280&q=80",
          "https://images.unsplash.com/photo-1531303435785-3c5310c69135?auto=format&fit=crop&w=1280&q=80"
        ],
        facilities: ["إطلالة على الحرم", "واي فاي مجاني", "مطعم", "خدمة غرف", "مواقف سيارات"]
      },
      {
        id: "sheraton-makkah-jabal-kaaba",
        name: "فندق شيراتون مكة جبل الكعبة",
        nameEn: "Sheraton Makkah Jabal Al Kaaba Hotel",
        location: "مكة المكرمة - جبل الكعبة",
        city: "مكة المكرمة - جبل الكعبة",
        lat: 21.4246,
        lng: 39.8183,
        stars: 5,
        price: 850,
        night_price: 850,
        price1to20: 850,
        description: `استمتع بروحانية الجوار في فندق شيراتون مكة جبل الكعبة 🕋✨.

يتميز الفندق بموقعه الاستراتيجي الذي يجمع بين الفخامة والسكينة، حيث يوفر إطلالات خلابة على المسجد الحرام 🕌.
يتمتع ضيوفنا بميزة استثنائية عبر جسر مشاة خاص يوصلك مباشرة إلى توسعة الملك عبدالله بالحرم المكي، لتسهيل أداء مناسكك بكل يسر وسهولة 🚶‍♂️💫.

✨ **مميزات الفندق:**
• 🛏️ غرف عصرية بتصاميم إسلامية راقية تضمن لك الراحة التامة بعد عناء العمرة.
• 🍽️ خيارات طعام متنوعة في مطاعمنا الفاخرة التي تقدم أشهى المأكولات العالمية والشرقية.
• 🕌 إطلالات روحانية مباشرة تأسر القلوب.
• 🤝 خدمة ضيافة عربية أصيلة تليق بضيوف الرحمن.

شيراتون مكة.. حيث تجتمع الرفاهية مع قدسية المكان. 🤲💎`,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sheraton_Hotels_and_Resorts_Logo.svg/1200px-Sheraton_Hotels_and_Resorts_Logo.svg.png",
        images: [
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop"
        ],
        facilities: ["إطلالة روحانية", "جسر مشاة خاص للحرم", "مطاعم فاخرة", "غرف عصرية"]
      },
      
      // --- RESTORED HOTELS (From seed-hotels-real.mjs) ---
      {
        name: "Makkah Hotel & Towers",
        city: "مكة المكرمة - مطل على الحرم",
        location: "مكة المكرمة - مطل على الحرم",
        lat: 21.4207,
        lng: 39.8239,
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Makkah_Royal_Clock_Tower_Hotel.jpg/800px-Makkah_Royal_Clock_Tower_Hotel.jpg", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1565056637389-9134a9e52c8c?auto=format&fit=crop&w=1280&q=80"],
        stars: 5,
        price: 750,
        price1to20: 750,
        description: "فندق وأبراج مكة يتميز بموقعه الاستراتيجي المطل مباشرة على ساحة الحرم وبوابة الملك فهد.",
        facilities: ["إطلالة مباشرة", "مصلى خاص", "مطاعم عالمية", "مركز تجاري"]
      },
      {
        name: "Pullman ZamZam Makkah",
        city: "مكة المكرمة - وقف الملك عبدالعزيز",
        location: "مكة المكرمة - وقف الملك عبدالعزيز",
        lat: 21.4196,
        lng: 39.8247,
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Abraj_Al_Bait_Towers.JPG/1280px-Abraj_Al_Bait_Towers.JPG", "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1531303435785-3c5310c69135?auto=format&fit=crop&w=1280&q=80"],
        stars: 5,
        price: 900,
        price1to20: 900,
        description: "فندق بولمان زمزم مكة يوفر إقامة فاخرة على بعد خطوات من الكعبة المشرفة مع نظام صوتي لسماع الأذان والصلاة.",
        facilities: ["إطلالة على الكعبة", "إفطار فاخر", "خدمة كونسيرج", "غرف عائلية"]
      },
      {
        name: "Hilton Hotel & Convention Jabal Omar",
        city: "مكة المكرمة - جبل عمر",
        location: "مكة المكرمة - جبل عمر",
        lat: 21.4233,
        lng: 39.8213,
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Jabal_Omar.jpg/1280px-Jabal_Omar.jpg", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1565056637389-9134a9e52c8c?auto=format&fit=crop&w=1280&q=80"],
        stars: 5,
        price: 950,
        price1to20: 950,
        description: "يتميز فندق ومؤتمرات هيلتون مكة بإطلالات مهيبة على الحرم المكي وموقع مميز في جبل عمر.",
        facilities: ["مركز مؤتمرات", "نادي صحي", "مطاعم فاخرة", "خدمة ليموزين"]
      },
      {
        name: "Jabal Omar Hyatt Regency Makkah",
        city: "مكة المكرمة - جبل عمر",
        location: "مكة المكرمة - جبل عمر",
        lat: 21.4214,
        lng: 39.8222,
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Jabal_Omar_Makkah.jpg/1024px-Jabal_Omar_Makkah.jpg", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1531303435785-3c5310c69135?auto=format&fit=crop&w=1280&q=80"],
        stars: 5,
        price: 880,
        price1to20: 880,
        description: "حياة ريجنسي جبل عمر يوفر تجربة إقامة عصرية وفاخرة على بعد دقيقة واحدة مشياً من الحرم.",
        facilities: ["صالة نادي", "جيم", "خدمة غرف 24 ساعة", "واي فاي سريع"]
      },
      {
        name: "M Hotel Makkah by Millennium",
        city: "مكة المكرمة - شارع إبراهيم الخليل",
        location: "مكة المكرمة - شارع إبراهيم الخليل",
        lat: 21.4150,
        lng: 39.8210,
        images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1580418425653-5c17d7808925?auto=format&fit=crop&w=1280&q=80"],
        stars: 5,
        price: 450,
        price1to20: 450,
        description: "فندق إم مكة من ميلينيوم يقدم خدمات 5 نجوم بأسعار مميزة، يقع على شارع إبراهيم الخليل.",
        facilities: ["نقل للحرم", "مطعم", "مسبح", "غرف مكيفة"]
      },
      {
        name: "Emaar Grand Hotel",
        city: "مكة المكرمة - شارع إبراهيم الخليل",
        location: "مكة المكرمة - شارع إبراهيم الخليل",
        lat: 21.4120,
        lng: 39.8200,
        images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1565056637389-9134a9e52c8c?auto=format&fit=crop&w=1280&q=80"],
        stars: 4,
        price: 300,
        price1to20: 300,
        description: "فندق إعمار جراند يتميز بموقع حيوي في المسفلة، قريب من الخدمات والأسواق.",
        facilities: ["مطعم", "واي فاي", "استقبال 24 ساعة", "خدمة تنظيف"]
      },
      {
        name: "Taj Al Khalil Hotel",
        city: "مكة المكرمة - شارع إبراهيم الخليل",
        location: "مكة المكرمة - شارع إبراهيم الخليل",
        lat: 21.4100,
        lng: 39.8190,
        images: ["https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1580418425653-5c17d7808925?auto=format&fit=crop&w=1280&q=80"],
        stars: 3,
        price: 200,
        price1to20: 200,
        description: "فندق تاج الخليل خيار اقتصادي ممتاز على مسافة مشي معقولة من الحرم.",
        facilities: ["غرف عائلية", "مصعد", "تكييف", "واي فاي"]
      },
      {
        name: "Le Meridien Makkah",
        city: "مكة المكرمة - أجياد / إبراهيم الخليل",
        location: "مكة المكرمة - أجياد / إبراهيم الخليل",
        lat: 21.4200,
        lng: 39.8280, 
        images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1531303435785-3c5310c69135?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1565056637389-9134a9e52c8c?auto=format&fit=crop&w=1280&q=80"],
        stars: 5,
        price: 600,
        price1to20: 600,
        description: "فندق لو ميريديان مكة يتميز بالفخامة والإطلالة الجزئية على الحرم.",
        facilities: ["مطعم فاخر", "خدمة غرف", "أجنحة ملكية"]
      },
      {
        name: "Makarem Ajyad Makkah Hotel",
        city: "مكة المكرمة - شارع أجياد",
        location: "مكة المكرمة - شارع أجياد",
        lat: 21.4180,
        lng: 39.8280,
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1580418425653-5c17d7808925?auto=format&fit=crop&w=1280&q=80"],
        stars: 5,
        price: 550,
        price1to20: 550,
        description: "فندق مكارم أجياد يعتبر من أعرق فنادق مكة، ويبعد دقائق قليلة سيراً عن باب الملك عبدالعزيز.",
        facilities: ["بهو واسع", "خدمات روحانية", "مطعم", "قريب من الحرم"]
      },
      {
        name: "Swissôtel Makkah",
        city: "مكة المكرمة - مدخل أجياد",
        location: "مكة المكرمة - مدخل أجياد",
        lat: 21.4185,
        lng: 39.8260,
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Abraj_Al_Bait_Towers.JPG/1280px-Abraj_Al_Bait_Towers.JPG", "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1280&q=80", "https://images.unsplash.com/photo-1531303435785-3c5310c69135?auto=format&fit=crop&w=1280&q=80"],
        stars: 5,
        price: 800,
        price1to20: 800,
        description: "سويس أوتيل مكة، الفندق الوحيد الذي له مدخل مباشر عبر شارع أجياد إلى داخل أبراج البيت.",
        facilities: ["مدخل خاص", "إطلالة", "مطاعم فاخرة", "خدمة 5 نجوم"]
      }
    ];

    const targetIds = targetHotels.map(h => h.id);
    const batch = writeBatch(db);
    let operationCount = 0;

    // 3. Force Clean (Delete All or Duplicates)
    if (type === "force_clean" || type === "delete_all") {
      hotels.forEach(({ docId, data }) => {
        const hData = data as any;
        
        // For "delete_all", we delete EVERYTHING.
        // For "force_clean", we delete non-targets.
        
        if (type === "delete_all") {
          const docRef = doc(db, "hotels", docId);
          batch.delete(docRef);
          logs.push(`[BATCH DELETE ALL]: ${docId} (${hData.name})`);
          operationCount++;
        } else {
          // Existing force_clean logic (keep targets)
          const isTarget = targetHotels.some(t => 
            (t.id && t.id === hData.id) || 
            (t.name === hData.name)
          );

          if (!isTarget) {
            const docRef = doc(db, "hotels", docId);
            batch.delete(docRef);
            logs.push(`[BATCH DELETE]: ${docId} (${hData.name})`);
            operationCount++;
          }
        }
      });
    }

    // 4. Upsert Targets (Rich Data) - Restore Swissotel & Sheraton
    if (type === "restore_swiss" || type === "fix_all") {
        for (const hotel of targetHotels) {
          // Generate ID if missing
          const hotelId = hotel.id || (hotel as any).nameEn?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || hotel.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `hotel-${Math.random().toString(36).substr(2, 9)}`;

          const docRef = doc(db, "hotels", hotelId);
          
          // Use set with merge: true
          batch.set(docRef, {
            ...hotel,
            id: hotelId,
            updatedAt: new Date().toISOString(),
            // Only set createdAt if it doesn't exist? Firestore merge handles this if we don't send it?
            // Actually, for a restore, we can just update it.
          }, { merge: true });
          
          logs.push(`[BATCH UPSERT]: ${hotel.name}`);
          operationCount++;
        }
    }

    // 5. Commit Batch
    if (operationCount > 0) {
      await batch.commit();
      logs.push(`Batch committed successfully with ${operationCount} operations.`);
    } else {
      logs.push("No changes needed.");
    }

    // 6. Final Verification & List Current Hotels
    const finalSnapshot = await getDocs(hotelsRef);
    const finalCount = finalSnapshot.size;
    
    // Explicitly list what remains with FULL DATA
    const remaining = finalSnapshot.docs.map(d => ({
        id: d.id,
        name: d.data().name,
        location: d.data().location,
        description: d.data().description
    }));
    
    logs.push(`FINAL COUNT: ${finalCount}`);

    return NextResponse.json({ 
      success: true, 
      logs,
      finalCount,
      hotels: remaining // Return actual data to inspect
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    console.error("Fix DB Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}