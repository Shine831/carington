import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification
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
 * Register a new user with Email/Password.
 * - Sends a verification email before allowing access.
 * - Firestore document is NOT created here; it will be created by useAuth
 *   only after the user verifies their email.
 */
export const registerUser = async (data: RegisterData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // Update display name in Firebase Auth
    await updateProfile(user, { displayName: data.name });

    // Send verification email — user must confirm before accessing the app
    await sendEmailVerification(user);

    // Sign out immediately so they can't access the app until verified
    await signOut(auth);

    return { requiresVerification: true, email: data.email };
  } catch (error: any) {
    console.error("Error registering user:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Create Firestore user document after email verification is confirmed.
 * Called once per user after they verify their email (from useAuth).
 */
export const createUserDocument = async (uid: string, email: string, displayName: string, role: "CLIENT" | "ADMIN" = "CLIENT") => {
  const userDocRef = doc(db, "users", uid);
  const existing = await getDoc(userDocRef);
  if (!existing.exists()) {
    await setDoc(userDocRef, {
      uid,
      email,
      displayName,
      role,
      createdAt: serverTimestamp(),
    });
  }
};

/**
 * Log in an existing user with Email/Password.
 * - ADMINs bypass email verification (created manually in Firebase console).
 * - CLIENTs with unverified emails: auto-send verification email, then block access.
 */
export const loginUser = async (data: LoginData) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // Email already verified — allow everyone through immediately
    if (user.emailVerified) {
      return user;
    }

    // Email not verified — check Firestore role (ADMINs bypass verification)
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data()?.role : "CLIENT";
      if (role === "ADMIN") {
        return user; // ADMIN — no email verification required
      }
    } catch {
      // Firestore lookup failed — treat as CLIENT (safest fallback)
    }

    // CLIENT with unverified email:
    // Automatically send/resend the verification email before blocking
    try {
      await sendEmailVerification(user);
    } catch {
      // If send fails (rate limit etc.), we still block access gracefully
    }

    await signOut(auth);
    throw new Error("EMAIL_NOT_VERIFIED");
  } catch (error: any) {
    console.error("Error logging in:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Log in or Register a user via Google Auth Provider.
 * Google accounts are pre-verified — no email step needed.
 */
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Google users are always verified — create their profile if new
    await createUserDocument(user.uid, user.email!, user.displayName || "Google User");

    return user;
  } catch (error: any) {
    console.error("Error with Google login:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Resend the verification email to the currently signed-in user.
 */
export const resendVerificationEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await signOut(auth);
  } catch (error: any) {
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
