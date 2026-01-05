import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// These values MUST be set in environment variables
// Never commit API keys to the repository!
const firebaseConfig = {
  apiKey: "AIzaSyALbeACu2PoaXcdEXB_6VQgSmUA5c-We_8",
  authDomain: "betiharisociety-427f1.firebaseapp.com",
  projectId: "betiharisociety-427f1",
  storageBucket: "betiharisociety-427f1.firebasestorage.app",
  messagingSenderId: "18570375410",
  appId: "1:18570375410:web:e86b12bfa9197c7090206b",
  measurementId: "G-8LERJGJSCD"
};

// Initialize Firebase
let app;
let db;
let auth;
let firebaseInitialized = false;
let firebaseError = null;

// Validate all required environment variables are present
const requiredVars = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
};

const missingVars = Object.entries(requiredVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `REACT_APP_FIREBASE_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  firebaseError = `Missing environment variables: ${missingVars.join(', ')}`;
  console.error('❌ Firebase configuration is missing!');
  console.error('Missing variables:', missingVars);
  console.error('Please set these in Netlify Dashboard → Site Settings → Environment Variables');
  console.error('Then trigger a new deploy.');
} else {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    firebaseInitialized = true;
    console.log('✅ Firebase initialized successfully');
    console.log('Firebase Project:', firebaseConfig.projectId);
  } catch (error) {
    firebaseError = error.message;
    console.error('❌ Error initializing Firebase:', error);
    console.error('Error details:', error.message);
  }
}

// Export error state so UI can show it
export { db, auth, firebaseInitialized, firebaseError };
export default app;

