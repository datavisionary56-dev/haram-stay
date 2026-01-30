import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";

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

async function cleanDB() {
  console.log("🗑️ Starting database cleanup...");
  
  try {
    const querySnapshot = await getDocs(collection(db, "hotels"));
    
    if (querySnapshot.empty) {
      console.log("✅ Database is already empty.");
      return;
    }

    console.log(`🔍 Found ${querySnapshot.size} documents to delete.`);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log("✅ Database cleared successfully! Ready for a fresh start.");
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
  }
}

cleanDB();
