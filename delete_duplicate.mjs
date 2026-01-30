import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

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

async function deleteDuplicate() {
  const idToDelete = "gjdqK7Mh5Z06lf3OyEUk";
  console.log(`🗑️ Deleting duplicate hotel ID: ${idToDelete}...`);
  try {
    await deleteDoc(doc(db, "hotels", idToDelete));
    console.log("✅ Successfully deleted.");
  } catch (error) {
    console.error("❌ Failed to delete:", error);
  }
}

deleteDuplicate();
