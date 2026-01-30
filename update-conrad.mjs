import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

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

async function updateConradPrice() {
  console.log("🔍 Searching for Conrad Makkah...");
  
  try {
    const querySnapshot = await getDocs(collection(db, "hotels"));
    let found = false;

    for (const d of querySnapshot.docs) {
      const data = d.data();
      // Check for loose match
      if (data.name && data.name.toLowerCase().includes("conrad")) {
        console.log(`✅ Found hotel: ${data.name} (ID: ${d.id})`);
        console.log(`   Current Price: ${data.price}`);
        
        // New price from Booking.com (approx 1050 SAR)
        const newPrice = 1050;
        
        await updateDoc(doc(db, "hotels", d.id), {
          price: newPrice,
          // Ensure other price fields are consistent if they exist
          price1to20: newPrice
        });
        
        console.log(`🎉 Updated price to ${newPrice} SAR successfully!`);
        found = true;
      }
    }

    if (!found) {
      console.log("❌ Conrad Makkah not found in database.");
    }
  } catch (error) {
    console.error("❌ Error updating database:", error);
  }
}

updateConradPrice();
