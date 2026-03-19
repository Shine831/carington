import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

// Types
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Register a new user with Email/Password and create a Firestore document with default 'CLIENT' role.
 */
export const registerUser = async (data: RegisterData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // Update display name in Firebase Auth
    await updateProfile(user, { displayName: data.name });

    // Create custom user document in Firestore to hold the RBAC role
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: data.email,
      displayName: data.name,
      role: "CLIENT", // Default Role
      createdAt: serverTimestamp(),
    });

    return user;
  } catch (error: any) {
    console.error("Error registering user:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Log in an existing user with Email/Password.
 */
export const loginUser = async (data: LoginData) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error logging in:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Log in or Register a user via Google Auth Provider.
 */
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user already exists in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    // If it's a new Google user, create their profile document
    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Google User",
        role: "CLIENT", // Default Role
        createdAt: serverTimestamp(),
      });
    }

    return user;
  } catch (error: any) {
    console.error("Error with Google login:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Log out the current user.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error logging out:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Send a password reset email to the given address.
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error sending password reset:", error.message);
    throw new Error(error.message);
  }
};
