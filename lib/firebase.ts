import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { firebaseConfig, firebaseConfigured } from "./firebase-config";
export { firebaseConfigured } from "./firebase-config";
export function getFirebaseAuth() {
  if (!firebaseConfigured) throw new Error("Firebase is not configured. Add your web app settings to .env.local.");
  return getAuth(getApps().length ? getApp() : initializeApp(firebaseConfig));
}
