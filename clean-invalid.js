
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, deleteDoc } = require("firebase/firestore");

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

async function cleanData() {
  console.log("🧹 Cleaning invalid data...");
  const invalidId = "CZnB66KkuzL7Hyg6DUdm"; // Found from previous step
  try {
    await deleteDoc(doc(db, "hotels", invalidId));
    console.log(`✅ Deleted invalid document: ${invalidId}`);
  } catch (error) {
    console.error("❌ Failed to delete:", error.message);
  }
}

cleanData();
