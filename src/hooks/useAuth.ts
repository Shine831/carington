"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

interface AuthState {
  user: User | null;
  role: "CLIENT" | "ADMIN" | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          // Fetch custom role from Firestore
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const role = userDoc.exists() ? userDoc.data()?.role : "CLIENT";
          
          setAuthState({
            user: firebaseUser,
            role: role as "CLIENT" | "ADMIN",
            loading: false,
          });
        } catch (error) {
          console.error("Error fetching user role:", error);
          setAuthState({
            user: firebaseUser,
            role: "CLIENT", // Fallback
            loading: false,
          });
        }
      } else {
        setAuthState({ user: null, role: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
}
