import React from 'react';
import { AlertCircle } from 'lucide-react';

const FirebaseError = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 z-50 shadow-lg">
      <div className="container mx-auto flex items-center gap-3">
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Firebase Configuration Error</h3>
          <p className="text-sm">
            Firebase environment variables are not configured. Please set the following variables in Netlify:
          </p>
          <ul className="text-xs mt-2 list-disc list-inside">
            <li>REACT_APP_FIREBASE_API_KEY</li>
            <li>REACT_APP_FIREBASE_AUTH_DOMAIN</li>
            <li>REACT_APP_FIREBASE_PROJECT_ID</li>
            <li>REACT_APP_FIREBASE_STORAGE_BUCKET</li>
            <li>REACT_APP_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>REACT_APP_FIREBASE_APP_ID</li>
          </ul>
          <p className="text-xs mt-2">
            After adding variables, trigger a new deploy in Netlify.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseError;

