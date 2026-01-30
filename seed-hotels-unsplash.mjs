import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsnroFUGP7aiwk6KJzIbwzHLCPI_CbMd4",
  authDomain: "sacreddeals.firebaseapp.com",
  projectId: "sacreddeals",
  storageBucket: "sacreddeals.firebasestorage.app",
  messagingSenderId: "424963989016",
  appId: "1:424963989016:web:2c67b806b6c8ffb6fd6d6d",
  measurementId: "G-BLRJ9SESM0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Unsplash Images (Reliable & High Quality)
const luxuryImages = [
  "https://images.unsplash.com/photo-1565056637389-9134a9e52c8c?auto=format&fit=crop&w=1280&q=80", // Makkah Clock Tower
  "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1280&q=80", // Luxury Room
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1280&q=80", // Hotel Interior
  "https://images.unsplash.com/photo-1578895210405-927510122d6e?auto=format&fit=crop&w=1280&q=80", // Kaaba View
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1280&q=80"  // Luxury Pool/Hall
];

const standardImages = [
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1280&q=80", // Bedroom
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1280&q=80", // Building
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1280&q=80", // Interior
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1280&q=80", // Room
  "https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&w=1280&q=80"  // View
];

const hotels = [
  // 1. Front Row / Luxury (5 Hotels)
  {
    name: "Swissôtel Al Maqam Makkah",
    city: "مكة المكرمة - وقف الملك عبدالعزيز",
    lat: 21.4198,
    lng: 39.8253,
    images: [luxuryImages[0], luxuryImages[1], luxuryImages[2]],
    stars: 5,
    price: 850,
    price1to20: 850,
    description: "يقع فندق سويس أوتيل المقام مكة في قلب العالم الإسلامي، ويوفر إطلالات خلابة على الكعبة المشرفة والمسجد الحرام.",
    facilities: ["إطلالة على الحرم", "واي فاي مجاني", "مطعم", "خدمة غرف", "مواقف سيارات"],
    originalUrl: "https://www.booking.com/hotel/sa/swissotel-al-maqam-makkah.ar.html"
  },
  {
    name: "Makkah Hotel & Towers",
    city: "مكة المكرمة - مطل على الحرم",
    lat: 21.4207,
    lng: 39.8239,
    images: [luxuryImages[3], luxuryImages[1], luxuryImages[4]],
    stars: 5,
    price: 750,
    price1to20: 750,
    description: "فندق وأبراج مكة يتميز بموقعه الاستراتيجي المطل مباشرة على ساحة الحرم وبوابة الملك فهد.",
    facilities: ["إطلالة مباشرة", "مصلى خاص", "مطاعم عالمية", "مركز تجاري"],
    originalUrl: "https://www.booking.com/hotel/sa/makkah-hilton-towers.ar.html"
  },
  {
    name: "Pullman ZamZam Makkah",
    city: "مكة المكرمة - وقف الملك عبدالعزيز",
    lat: 21.4196,
    lng: 39.8247,
    images: [luxuryImages[2], luxuryImages[0], luxuryImages[3]],
    stars: 5,
    price: 900,
    price1to20: 900,
    description: "فندق بولمان زمزم مكة يوفر إقامة فاخرة على بعد خطوات من الكعبة المشرفة مع نظام صوتي لسماع الأذان والصلاة.",
    facilities: ["إطلالة على الكعبة", "إفطار فاخر", "خدمة كونسيرج", "غرف عائلية"],
    originalUrl: "https://www.booking.com/hotel/sa/pullman-zamzam-makkah.ar.html"
  },
  {
    name: "Hilton Hotel & Convention Jabal Omar",
    city: "مكة المكرمة - جبل عمر",
    lat: 21.4233,
    lng: 39.8213,
    images: [luxuryImages[4], luxuryImages[2], luxuryImages[1]],
    stars: 5,
    price: 950,
    price1to20: 950,
    description: "يتميز فندق ومؤتمرات هيلتون مكة بإطلالات مهيبة على الحرم المكي وموقع مميز في جبل عمر.",
    facilities: ["مركز مؤتمرات", "نادي صحي", "مطاعم فاخرة", "خدمة ليموزين"],
    originalUrl: "https://www.booking.com/hotel/sa/makkah-hilton.ar.html"
  },
  {
    name: "Jabal Omar Hyatt Regency Makkah",
    city: "مكة المكرمة - جبل عمر",
    lat: 21.4214,
    lng: 39.8222,
    images: [luxuryImages[1], luxuryImages[3], luxuryImages[0]],
    stars: 5,
    price: 880,
    price1to20: 880,
    description: "حياة ريجنسي جبل عمر يوفر تجربة إقامة عصرية وفاخرة على بعد دقيقة واحدة مشياً من الحرم.",
    facilities: ["صالة نادي", "جيم", "خدمة غرف 24 ساعة", "واي فاي سريع"],
    originalUrl: "https://www.booking.com/hotel/sa/hyatt-regency-makkah-jabal-omar.ar.html"
  },

  // 2. Ibrahim Al Khalil St (< 600m) (5 Hotels)
  {
    name: "M Hotel Makkah by Millennium",
    city: "مكة المكرمة - شارع إبراهيم الخليل",
    lat: 21.4150,
    lng: 39.8210,
    images: [standardImages[0], standardImages[1], standardImages[2]],
    stars: 5,
    price: 450,
    price1to20: 450,
    description: "فندق إم مكة من ميلينيوم يقدم خدمات 5 نجوم بأسعار مميزة، يقع على شارع إبراهيم الخليل.",
    facilities: ["نقل للحرم", "مطعم", "مسبح", "غرف مكيفة"],
    originalUrl: "https://www.booking.com/hotel/sa/m-makkah-by-millennium.ar.html"
  },
  {
    name: "Emaar Grand Hotel",
    city: "مكة المكرمة - شارع إبراهيم الخليل",
    lat: 21.4120,
    lng: 39.8200,
    images: [standardImages[2], standardImages[0], standardImages[3]],
    stars: 4,
    price: 300,
    price1to20: 300,
    description: "فندق إعمار جراند يتميز بموقع حيوي في المسفلة، قريب من الخدمات والأسواق.",
    facilities: ["مطعم", "واي فاي", "استقبال 24 ساعة", "خدمة تنظيف"],
    originalUrl: "https://www.booking.com/hotel/sa/dar-al-eiman-grand.ar.html"
  },
  {
    name: "Taj Al Khalil Hotel",
    city: "مكة المكرمة - شارع إبراهيم الخليل",
    lat: 21.4100,
    lng: 39.8190,
    images: [standardImages[3], standardImages[2], standardImages[4]],
    stars: 3,
    price: 200,
    price1to20: 200,
    description: "فندق تاج الخليل خيار اقتصادي ممتاز على مسافة مشي معقولة من الحرم.",
    facilities: ["غرف عائلية", "مصعد", "تكييف", "واي فاي"],
    originalUrl: "#"
  },
  {
    name: "Emaar Al Khalil",
    city: "مكة المكرمة - شارع إبراهيم الخليل",
    lat: 21.4080,
    lng: 39.8180,
    images: [standardImages[1], standardImages[3], standardImages[0]],
    stars: 3,
    price: 180,
    price1to20: 180,
    description: "فندق إعمار الخليل يوفر إقامة مريحة واقتصادية للحجاج والمعتمرين.",
    facilities: ["استقبال", "نظافة يومية", "قريب من الأسواق"],
    originalUrl: "#"
  },
  {
    name: "Le Meridien Makkah",
    city: "مكة المكرمة - أجياد / إبراهيم الخليل",
    lat: 21.4200,
    lng: 39.8280, // Approximate
    images: [luxuryImages[2], luxuryImages[4], luxuryImages[1]],
    stars: 5,
    price: 600,
    price1to20: 600,
    description: "فندق لو ميريديان مكة يتميز بالفخامة والإطلالة الجزئية على الحرم.",
    facilities: ["مطعم فاخر", "خدمة غرف", "أجنحة ملكية"],
    originalUrl: "https://www.booking.com/hotel/sa/le-meridien-makkah.ar.html"
  },

  // 3. Ajyad Street (< 600m) (5 Hotels)
  {
    name: "Makarem Ajyad Makkah Hotel",
    city: "مكة المكرمة - شارع أجياد",
    lat: 21.4180,
    lng: 39.8280,
    images: [standardImages[4], standardImages[1], standardImages[2]],
    stars: 5,
    price: 550,
    price1to20: 550,
    description: "فندق مكارم أجياد يعتبر من أعرق فنادق مكة، ويبعد دقائق قليلة سيراً عن باب الملك عبدالعزيز.",
    facilities: ["بهو واسع", "خدمات روحانية", "مطعم", "قريب من الحرم"],
    originalUrl: "https://www.booking.com/hotel/sa/ajyad-makkah-makarim.ar.html"
  },
  {
    name: "Mira Ajyad Hotel",
    city: "مكة المكرمة - شارع أجياد",
    lat: 21.4160,
    lng: 39.8290,
    images: [standardImages[0], standardImages[3], standardImages[1]],
    stars: 3,
    price: 250,
    price1to20: 250,
    description: "فندق ميرا أجياد خيار جيد لمن يبحث عن موقع قريب بسعر مناسب.",
    facilities: ["مطعم", "واي فاي", "خدمة غرف"],
    originalUrl: "#"
  },
  {
    name: "Al Massa Hotel",
    city: "مكة المكرمة - شارع أجياد",
    lat: 21.4190,
    lng: 39.8270,
    images: [standardImages[2], standardImages[4], standardImages[0]],
    stars: 4,
    price: 400,
    price1to20: 400,
    description: "فندق الماسة يتميز بقربه الشديد من ساحات الحرم.",
    facilities: ["موقع مميز", "مطعم", "خدمات فندقية"],
    originalUrl: "#"
  },
  {
    name: "Rayyana Hotel Ajyad",
    city: "مكة المكرمة - شارع أجياد",
    lat: 21.4170,
    lng: 39.8285,
    images: [standardImages[1], standardImages[2], standardImages[3]],
    stars: 4,
    price: 350,
    price1to20: 350,
    description: "فندق ريانة أجياد يوفر إقامة عصرية ومريحة للحجاج.",
    facilities: ["واي فاي", "بوفيه إفطار", "غرف نظيفة"],
    originalUrl: "#"
  },
  {
    name: "Swissôtel Makkah",
    city: "مكة المكرمة - مدخل أجياد",
    lat: 21.4185,
    lng: 39.8260,
    images: [luxuryImages[0], luxuryImages[3], luxuryImages[2]],
    stars: 5,
    price: 800,
    price1to20: 800,
    description: "سويس أوتيل مكة، الفندق الوحيد الذي له مدخل مباشر عبر شارع أجياد إلى داخل أبراج البيت.",
    facilities: ["مدخل خاص", "إطلالة", "مطاعم فاخرة", "خدمة 5 نجوم"],
    originalUrl: "https://www.booking.com/hotel/sa/swissotel-makkah.ar.html"
  }
];

async function seedHotels() {
  console.log("🚀 Starting to clear and re-seed hotels with WORKING IMAGES...");
  
  // 1. Delete existing hotels to avoid duplicates/confusion
  try {
    const q = await getDocs(collection(db, "hotels"));
    const deletePromises = q.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("🗑️ Cleared existing hotels.");
  } catch (e) {
    console.error("Warning: Could not clear existing hotels", e);
  }

  // 2. Add new hotels
  for (const hotel of hotels) {
    try {
      await addDoc(collection(db, "hotels"), {
        ...hotel,
        createdAt: serverTimestamp()
      });
      console.log(`✅ Added: ${hotel.name}`);
    } catch (error) {
      console.error(`❌ Error adding ${hotel.name}:`, error);
    }
  }
  
  console.log("🎉 Re-Seeding completed with Unsplash images!");
}

seedHotels();
