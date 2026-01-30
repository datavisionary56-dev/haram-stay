
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBsnroFUGP7aiwk6KJzIbwzHLCPI_CbMd4",
  authDomain: "sacreddeals.firebaseapp.com",
  projectId: "sacreddeals",
  storageBucket: "sacreddeals.firebasestorage.app",
  messagingSenderId: "424963989016",
  appId: "1:424963989016:web:2c67b806b6c8ffb6fd6d6d",
  measurementId: "G-BLRJ9SESM0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  console.log("🔥 Testing Firestore Connection...");
  try {
    const hotelsRef = collection(db, "hotels");
    const snapshot = await getDocs(hotelsRef);
    
    if (snapshot.empty) {
      console.log("⚠️ Collection 'hotels' is empty.");
    } else {
      console.log(`✅ Successfully connected! Found ${snapshot.size} documents.`);
      snapshot.forEach(doc => {
        console.log(`   - ID: ${doc.id}, Name: ${doc.data().name}, Price: ${doc.data().price}`);
      });
    }
  } catch (error) {
    console.error("❌ Connection Failed:", error.message);
    if (error.code === 'permission-denied') {
      console.error("🚫 Permission Denied: Check Firestore Security Rules.");
    } else if (error.code === 'unavailable') {
      console.error("📡 Network Unavailable: Check internet connection or firewall.");
    }
  }
}

testConnection();
