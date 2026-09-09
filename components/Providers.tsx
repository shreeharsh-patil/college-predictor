"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";
import { firebaseConfigured } from "@/lib/firebase-config";

type Profile = { name: string; demo: boolean };
type AuthContextValue = { profile: Profile | null; setDemoProfile: () => void; logout: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    if (!firebaseConfigured) return;
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    void Promise.all([import("firebase/auth"), import("@/lib/firebase")]).then(([{ onAuthStateChanged }, { getFirebaseAuth }]) => {
      if (!cancelled) unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => setProfile(user ? { name: user.displayName?.split(" ")[0] || user.phoneNumber || "Student", demo: false } : null));
    }).catch(() => { /* The sign-in modal reports configuration errors on demand. */ });
    return () => { cancelled = true; unsubscribe?.(); };
  }, []);
  async function logout() {
    if (firebaseConfigured) {
      const [{ signOut }, { getFirebaseAuth }] = await Promise.all([import("firebase/auth"), import("@/lib/firebase")]);
      await signOut(getFirebaseAuth());
    }
    setProfile(null);
  }
  return <AuthContext.Provider value={{ profile, setDemoProfile: () => setProfile({ name: "Demo student", demo: true }), logout }}><LazyMotion features={domAnimation} strict><MotionConfig reducedMotion="user">{children}</MotionConfig></LazyMotion></AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth requires Providers");
  return context;
}
