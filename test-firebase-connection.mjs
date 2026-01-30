import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsnroFUGP7aiwk6KJzIbwzHLCPI_CbMd4",
  authDomain: "sacreddeals.firebaseapp.com",
  projectId: "sacreddeals",
  storageBucket: "sacreddeals.firebasestorage.app",
  messagingSenderId: "424963989016",
  appId: "1:424963989016:web:2c67b806b6c8ffb6fd6d6d",
  measurementId: "G-BLRJ9SESM0",
};

console.log("🔥 Initializing Firebase with Project ID:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runDiagnostics() {
  console.log("🔍 Starting connectivity test...");

  try {
    // 1. Try to write a test document
    console.log("📝 Attempting to write to 'debug_logs' collection...");
    const testRef = doc(db, "debug_logs", "connection_test");
    await setDoc(testRef, {
      timestamp: new Date().toISOString(),
      message: "Direct Node.js connection successful",
      environment: "local_script"
    });
    console.log("✅ Write successful! Document ID: connection_test");

    // 2. Try to read it back
    console.log("📖 Attempting to read back the document...");
    const docSnap = await getDoc(testRef);
    if (docSnap.exists()) {
      console.log("✅ Read successful! Data:", docSnap.data());
    } else {
      console.log("❌ Read failed! Document not found.");
    }

    // 3. Check 'hotels' collection count
    console.log("🏨 Checking 'hotels' collection...");
    const hotelsSnap = await getDocs(collection(db, "hotels"));
    console.log(`📊 Found ${hotelsSnap.size} documents in 'hotels' collection.`);
    
    if (hotelsSnap.size > 0) {
        console.log("   Listing first 3 hotels:");
        hotelsSnap.docs.slice(0, 3).forEach(d => console.log(`   - ${d.id}: ${d.data().name}`));
    } else {
        console.log("⚠️ 'hotels' collection appears empty to this SDK.");
    }

  } catch (error) {
    console.error("❌ CONNECTION FAILED:", error);
    if (error.code === 'permission-denied') {
        console.error("   Reason: Firestore Rules might be blocking access.");
    } else if (error.code === 'unavailable') {
        console.error("   Reason: Network issue or Firestore service is down.");
    }
  }
}

runDiagnostics();
