import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function verifyData() {
  console.log("🔍 Verifying 'Dar Al Wafideen' data...");
  
  const snapshot = await getDocs(collection(db, "hotels"));
  let found = false;

  snapshot.forEach(d => {
              const data = d.data();
              if (data.name && data.name.includes("فندق دار الوافدين")) {
                  console.log(`✅ Found ID: ${d.id}`);
                  console.log(`   Price: ${data.price} (Type: ${typeof data.price})`);
                  console.log(`   CreatedAt: ${data.createdAt ? data.createdAt.toDate() : 'N/A'}`);
                  found = true;
              }
          });

  if (!found) console.log("❌ Hotel NOT found in database.");
}

verifyData();
