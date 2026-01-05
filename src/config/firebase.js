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

try {
  // Validate that all required environment variables are set
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('❌ Firebase configuration is missing!');
    console.error('Missing values:', {
      apiKey: !firebaseConfig.apiKey ? 'MISSING' : 'OK',
      projectId: !firebaseConfig.projectId ? 'MISSING' : 'OK',
      authDomain: !firebaseConfig.authDomain ? 'MISSING' : 'OK',
      storageBucket: !firebaseConfig.storageBucket ? 'MISSING' : 'OK',
      messagingSenderId: !firebaseConfig.messagingSenderId ? 'MISSING' : 'OK',
      appId: !firebaseConfig.appId ? 'MISSING' : 'OK'
    });
    console.error('Please set environment variables in Netlify:');
    console.error('- REACT_APP_FIREBASE_API_KEY');
    console.error('- REACT_APP_FIREBASE_AUTH_DOMAIN');
    console.error('- REACT_APP_FIREBASE_PROJECT_ID');
    console.error('- REACT_APP_FIREBASE_STORAGE_BUCKET');
    console.error('- REACT_APP_FIREBASE_MESSAGING_SENDER_ID');
    console.error('- REACT_APP_FIREBASE_APP_ID');
  } else {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    firebaseInitialized = true;
    console.log('✅ Firebase initialized successfully');
    console.log('Firebase Project:', firebaseConfig.projectId);
  }
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  console.error('Error details:', error.message);
  // Don't throw - allow app to continue even if Firebase fails
  // This prevents white screen of death
}

// Export with null checks to prevent errors if Firebase isn't initialized
export { db, auth, firebaseInitialized };
export default app;

