// ============================================================
// ADMIN SETUP SCRIPT — E-JARNALUD SOFT
// Run ONCE: node scripts/setup-admin.mjs
// ============================================================
// Crée le Super Admin : admin@gmail.com / admin123
// Stratégie : създава le compte Auth, se connecte immédiatement
// avec les credentials, puis écrit le document Firestore (authentifié).
// ============================================================

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

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

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

async function createAdmin() {
  console.log("🔐 Checking for existing ADMIN accounts...\n");

  // Step 1 — Create the Firebase Auth user
  let uid;
  try {
    const credential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    uid = credential.user.uid;
    await updateProfile(credential.user, { displayName: "Super Admin" });
    console.log("✅ Firebase Auth account created.");
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      console.log("⚠️  Firebase Auth account already exists. Signing in to sync Firestore...");
      const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      uid = cred.user.uid;
    } else {
      throw err;
    }
  }

  // Step 2 — Sign in to get valid auth session (required for Firestore rules)
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  const currentUser = auth.currentUser;
  console.log(`✅ Signed in as: ${currentUser.email} (uid: ${currentUser.uid})`);

  // Step 3 — Check if Firestore doc already exists
  const q = query(collection(db, "users"), where("role", "==", "ADMIN"));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    console.log("\n⚠️  An ADMIN document already exists in Firestore. Setup aborted to prevent duplicates.");
    process.exit(0);
  }

  // Step 4 — Write Firestore document (authenticated, so rules allow it)
  await setDoc(doc(db, "users", currentUser.uid), {
    uid: currentUser.uid,
    email: ADMIN_EMAIL,
    displayName: "Super Admin",
    role: "ADMIN",
    createdAt: serverTimestamp(),
  });

  console.log("\n🎉 Super Admin created successfully!");
  console.log("   Email:    admin@gmail.com");
  console.log("   Password: admin123");
  console.log("   Role:     ADMIN");
  console.log("\n⚠️  Suppress this script or delete it after use for security.");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("\n❌ Error creating admin:", err.message);
  console.error("   Code:", err.code);
  process.exit(1);
});
