
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

const fairmont = {
  name: "فندق فيرمونت مكة",
  stars: 5,
  location: "وقف الملك عبد العزيز، أبراج الساعة",
  city: "مكة المكرمة",
  description: "إقامة فاخرة في قلب مكة المكرمة، بإطلالات مباشرة على الكعبة المشرفة والحرم المكي. يوفر الفندق خدمات عالمية المستوى ومرافق متميزة لراحة ضيوف الرحمن.",
  facilities: ["إطلالة على الحرم", "مطاعم عالمية", "نادي صحي", "خدمة الغرف 24 ساعة", "اتصال مباشر بالحرم"],
  images: [
    "https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/29532504.jpg",
    "https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/29532454.jpg",
    "https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/43638321.jpg",
    "https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/29532467.jpg",
    "https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/29532470.jpg",
    "https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/43639144.jpg",
    "https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/43639433.jpg"
  ],
  price: 2500,
  pricingRules: {
    commission: 0,
    ranges: [
      {
        start: "2024-02-18",
        end: "2024-03-19",
        weekdayPrice: 2500,
        weekendPrice: 3100,
        extraBed: 350,
        notes: "الموسم الحالي"
      },
      {
        start: "2024-03-31", // Approximate Last 10 days
        end: "2024-04-09",
        isPackage: true,
        packagePrice: 76000,
        notes: "باقة العشر الأواخر من رمضان"
      }
    ]
  },
  createdAt: new Date().toISOString()
};

async function addHotel() {
  try {
    const docRef = await addDoc(collection(db, "hotels"), fairmont);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

addHotel();
