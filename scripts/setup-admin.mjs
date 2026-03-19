// ============================================================
// ADMIN SETUP SCRIPT — E-JARNALUD SOFT
// Run ONCE: node scripts/setup-admin.mjs
// ============================================================
// This script creates the unique Super Admin account in
// Firebase (Auth + Firestore) for:
//   - Email:    admin@gmail.com
//   - Password: admin
//   - Role:     ADMIN
// 
// IMPORTANT: After first run, this credential allows login via
// the /account page. The single-admin lock is enforced by
// Firestore Security Rules (only one ADMIN document can exist).
// Delete or rename this file after running once.
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp, getDocs, collection, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJa8HUjCJYmg9VLeD2f30Ot_JtGR8pNV8",
  authDomain: "carington-2f96d.firebaseapp.com",
  projectId: "carington-2f96d",
  storageBucket: "carington-2f96d.firebasestorage.app",
  messagingSenderId: "937898980180",
  appId: "1:937898980180:web:7c588a9f78d399e4780ec1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  console.log("🔐 Checking for existing ADMIN accounts...");

  // Guard: ensure no other admin already exists
  const q = query(collection(db, "users"), where("role", "==", "ADMIN"));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    console.log("⚠️  An ADMIN account already exists. Setup aborted to prevent duplicates.");
    process.exit(0);
  }

  console.log("✅ No existing admin found. Creating Super Admin...");

  const credential = await createUserWithEmailAndPassword(auth, "admin@gmail.com", "admin");
  const user = credential.user;

  await updateProfile(user, { displayName: "Super Admin" });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: "admin@gmail.com",
    displayName: "Super Admin",
    role: "ADMIN",
    createdAt: serverTimestamp(),
  });

  console.log("🎉 Super Admin created successfully!");
  console.log("   Email:   admin@gmail.com");
  console.log("   Password: admin");
  console.log("   Role:    ADMIN");
  console.log("\n⚠️  Remember to delete this script after use.");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ Error creating admin:", err.message);
  process.exit(1);
});
