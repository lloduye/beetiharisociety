// Firebase diagnostics utility
// Use this to check Firebase connection status

import { firebaseInitialized, db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const checkFirebaseStatus = () => {
  const status = {
    initialized: firebaseInitialized,
    hasDb: !!db,
    envVars: {
      apiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: !!process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: !!process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: !!process.env.REACT_APP_FIREBASE_APP_ID
    }
  };

  console.group('🔍 Firebase Diagnostics');
  console.log('Initialized:', status.initialized ? '✅ Yes' : '❌ No');
  console.log('Database available:', status.hasDb ? '✅ Yes' : '❌ No');
  console.log('Environment Variables:');
  Object.entries(status.envVars).forEach(([key, value]) => {
    console.log(`  ${key}:`, value ? '✅ Set' : '❌ Missing');
  });
  console.groupEnd();

  return status;
};

export const testFirebaseConnection = async () => {
  if (!firebaseInitialized || !db) {
    console.error('❌ Firebase is not initialized. Cannot test connection.');
    return { success: false, error: 'Firebase not initialized' };
  }

  try {
    // Try to read from a test collection (or any collection)
    const testRef = collection(db, 'users');
    const snapshot = await getDocs(testRef);
    console.log('✅ Firebase connection test successful!');
    console.log(`Found ${snapshot.size} documents in 'users' collection`);
    return { success: true, documentCount: snapshot.size };
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Auto-run diagnostics in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    checkFirebaseStatus();
  }, 1000);
}

