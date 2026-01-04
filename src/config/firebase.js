import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// These values should be set in environment variables or .env file
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyALbeACu2PoaXcdEXB_6VQgSmUA5c-We_8",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "betiharisociety-427f1.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "betiharisociety-427f1",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "betiharisociety-427f1.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "18570375410",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:18570375410:web:e86b12bfa9197c7090206b"
};

// Initialize Firebase
let app;
let db;
let auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { db, auth };
export default app;

