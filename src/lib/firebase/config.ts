import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAJa8HUjCJYmg9VLeD2f30Ot_JtGR8pNV8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "carington-2f96d.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "carington-2f96d",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "carington-2f96d.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "937898980180",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:937898980180:web:7c588a9f78d399e4780ec1",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XGTEZ3V6XJ"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics (only supported in browser)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported: boolean) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export { app, auth, db, analytics };
