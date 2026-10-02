import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDeWpr2CUVjgOgNaC8SOJ3C3y9gXRDWZ5s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "maria-padilha-rainha-das-7.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://maria-padilha-rainha-das-7-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "maria-padilha-rainha-das-7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "maria-padilha-rainha-das-7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "620503330978",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:620503330978:web:1dc56ddd317b0efc9be7fb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FWKPHYN0FB"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics init failure
  });
}

export { analytics };
export default app;