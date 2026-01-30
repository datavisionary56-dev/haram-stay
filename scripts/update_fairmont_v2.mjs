
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

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

const newImages = [
  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/7a/77/9c/fairmont-makkah-clock.jpg",
  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/52/63/87/kaaba-view-from-the-room.jpg",
  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/52/63/65/fairmont-gold-room.jpg"
];

const pricingRules = {
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
};

async function updateFairmont() {
  try {
    const q = query(collection(db, "hotels"), where("name", "==", "فندق فيرمونت مكة"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents found.");
      return;
    }

    querySnapshot.forEach(async (document) => {
      const docRef = doc(db, "hotels", document.id);
      await updateDoc(docRef, {
        images: newImages,
        pricingRules: pricingRules,
        price: 2500 // Ensure base price is updated
      });
      console.log(`Updated document ID: ${document.id}`);
    });
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

updateFairmont();
