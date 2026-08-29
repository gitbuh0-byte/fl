import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyCwZdAVUD6zkyTme0PMhmrS285NyZpHqnI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'omnibiz-5b586.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'omnibiz-5b586',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'omnibiz-5b586.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '703395554490',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:703395554490:web:da1f918d57ea4a9f074e83',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-H86BCRMYJ5',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
