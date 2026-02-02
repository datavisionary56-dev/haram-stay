import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBsnroFUGP7aiwk6KJzIbwzHLCPI_CbMd4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "sacreddeals.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "sacreddeals",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "sacreddeals.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "424963989016",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:424963989016:web:2c67b806b6c8ffb6fd6d6d",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-BLRJ9SESM0",
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

if (typeof window !== "undefined") {
  console.log("Firebase initialized with project ID:", firebaseConfig.projectId);
}

export { app, db, storage };
export const auth = getAuth(app);
