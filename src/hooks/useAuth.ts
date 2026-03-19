"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { createUserDocument } from "@/lib/firebase/auth";

interface AuthState {
  user: User | null;
  role: "CLIENT" | "ADMIN" | null;
  loading: boolean;
  emailVerified: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
    emailVerified: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          const role = userDoc.exists() ? (userDoc.data()?.role as "CLIENT" | "ADMIN") : "CLIENT";

          // ADMINs bypass email verification (accounts created manually in Firebase console)
          // CLIENTs must have verified their email before accessing the app
          if (!firebaseUser.emailVerified && role !== "ADMIN") {
            setAuthState({ user: null, role: null, loading: false, emailVerified: false });
            return;
          }

          // If Firestore doc doesn't exist yet, create it (first login after email verification)
          if (!userDoc.exists()) {
            await createUserDocument(
              firebaseUser.uid,
              firebaseUser.email!,
              firebaseUser.displayName || "Client",
              "CLIENT"
            );
          }

          setAuthState({
            user: firebaseUser,
            role,
            loading: false,
            emailVerified: firebaseUser.emailVerified,
          });
        } catch (error) {
          console.error("Error fetching user role:", error);
          // Safety net: if Firestore fails, still enforce email verification for non-admins
          // Since we can't read the role, treat as CLIENT → block if not verified
          if (!firebaseUser.emailVerified) {
            setAuthState({ user: null, role: null, loading: false, emailVerified: false });
            return;
          }
          setAuthState({
            user: firebaseUser,
            role: "CLIENT",
            loading: false,
            emailVerified: firebaseUser.emailVerified,
          });
        }
      } else {
        setAuthState({ user: null, role: null, loading: false, emailVerified: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
}
