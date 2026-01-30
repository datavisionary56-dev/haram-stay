import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

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

async function cleanupDuplicates() {
  console.log("🧹 Starting cleanup of duplicate 'Dar Al Wafideen'...");
  
  const snapshot = await getDocs(collection(db, "hotels"));
  const duplicates = [];

  snapshot.forEach(d => {
      const data = d.data();
      if (data.name && data.name.includes("فندق دار الوافدين")) {
          duplicates.push({ id: d.id, ...data });
      }
  });

  console.log(`📊 Found ${duplicates.length} instances.`);

  if (duplicates.length > 1) {
      // Keep the last one (most recent usually has higher ID or just pick one)
      // Actually, let's keep the one that looks most complete, or just the last one in the list.
      const toKeep = duplicates[duplicates.length - 1];
      const toDelete = duplicates.slice(0, duplicates.length - 1);

      console.log(`✅ Keeping ID: ${toKeep.id}`);
      
      for (const d of toDelete) {
          console.log(`❌ Deleting duplicate ID: ${d.id}`);
          await deleteDoc(doc(db, "hotels", d.id));
      }
      console.log("✨ Cleanup finished.");
  } else {
      console.log("✅ No duplicates found.");
  }
}

cleanupDuplicates();
