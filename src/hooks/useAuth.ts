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
        // Block unverified email/password accounts
        if (!firebaseUser.emailVerified) {
          setAuthState({
            user: null,
            role: null,
            loading: false,
            emailVerified: false,
          });
          return;
        }

        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          // If verified but no Firestore doc yet, create it (happens on first login after verification)
          if (!userDoc.exists()) {
            await createUserDocument(
              firebaseUser.uid,
              firebaseUser.email!,
              firebaseUser.displayName || "Client",
              "CLIENT"
            );
          }

          // Refetch after potential creation
          const freshDoc = await getDoc(userDocRef);
          const role = freshDoc.exists() ? freshDoc.data()?.role : "CLIENT";

          setAuthState({
            user: firebaseUser,
            role: role as "CLIENT" | "ADMIN",
            loading: false,
            emailVerified: true,
          });
        } catch (error) {
          console.error("Error fetching user role:", error);
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
