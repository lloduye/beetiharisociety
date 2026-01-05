import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// These values MUST be set in environment variables
// Never commit API keys to the repository!
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
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
    
    // Enable offline persistence (helps with connection issues)
    // Note: This is enabled by default in newer Firebase versions
  } catch (error) {
    firebaseError = error.message;
    console.error('❌ Error initializing Firebase:', error);
    console.error('Error details:', error.message);
  }
}

// Export error state so UI can show it
export { db, auth, firebaseInitialized, firebaseError };
export default app;

