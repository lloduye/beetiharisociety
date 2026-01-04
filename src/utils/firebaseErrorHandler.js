// Firebase error handler utility
// Provides user-friendly error messages for common Firebase errors

export const getFirebaseErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';
  
  const errorCode = error.code || error.message;
  
  // Firestore errors
  if (errorCode.includes('permission-denied')) {
    return 'Permission denied. Please check Firestore security rules.';
  }
  
  if (errorCode.includes('unavailable')) {
    return 'Firebase service is temporarily unavailable. Please try again later.';
  }
  
  if (errorCode.includes('unauthenticated')) {
    return 'Authentication required. Please log in.';
  }
  
  if (errorCode.includes('not-found')) {
    return 'The requested data was not found.';
  }
  
  if (errorCode.includes('already-exists')) {
    return 'This item already exists.';
  }
  
  if (errorCode.includes('failed-precondition')) {
    return 'Operation failed due to a precondition.';
  }
  
  if (errorCode.includes('aborted')) {
    return 'Operation was aborted. Please try again.';
  }
  
  if (errorCode.includes('out-of-range')) {
    return 'The operation is out of range.';
  }
  
  if (errorCode.includes('unimplemented')) {
    return 'This operation is not implemented.';
  }
  
  if (errorCode.includes('internal')) {
    return 'An internal error occurred. Please try again.';
  }
  
  if (errorCode.includes('deadline-exceeded')) {
    return 'The operation timed out. Please try again.';
  }
  
  if (errorCode.includes('resource-exhausted')) {
    return 'Resource limit exceeded. Please try again later.';
  }
  
  // Auth errors
  if (errorCode.includes('auth/')) {
    if (errorCode.includes('user-not-found')) {
      return 'User not found.';
    }
    if (errorCode.includes('wrong-password')) {
      return 'Incorrect password.';
    }
    if (errorCode.includes('email-already-in-use')) {
      return 'This email is already in use.';
    }
    if (errorCode.includes('weak-password')) {
      return 'Password is too weak.';
    }
    if (errorCode.includes('invalid-email')) {
      return 'Invalid email address.';
    }
  }
  
  // Network errors
  if (errorCode.includes('network') || errorCode.includes('fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  
  // Return original error message if no match
  return error.message || errorCode || 'An error occurred';
};

export const logFirebaseError = (error, context = '') => {
  console.error(`Firebase Error${context ? ` in ${context}` : ''}:`, {
    code: error.code,
    message: error.message,
    stack: error.stack
  });
  
  return getFirebaseErrorMessage(error);
};

