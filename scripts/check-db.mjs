import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJa8HUjCJYmg9VLeD2f30Ot_JtGR8pNV8",
  authDomain: "carington-2f96d.firebaseapp.com",
  projectId: "carington-2f96d",
  storageBucket: "carington-2f96d.firebasestorage.app",
  messagingSenderId: "937898980180",
  appId: "1:937898980180:web:7c588a9f78d399e4780ec1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  try {
    console.log("Checking Firestore for project:", firebaseConfig.projectId);
    const collections = ["services", "users", "bookings", "messages"];
    
    for (const colName of collections) {
      const snap = await getDocs(collection(db, colName));
      console.log(`Collection '${colName}': ${snap.size} documents found.`);
    }
  } catch (err) {
    console.error("Connectivity/Permission Error:", err.message);
  } finally {
    process.exit(0);
  }
}

check();
