import { storage, firebaseInitialized } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const storageService = {
  async uploadProfileImage(userId, file) {
    if (!firebaseInitialized || !storage) {
      throw new Error('File storage is not configured. Please check Firebase environment variables.');
    }
    if (!userId || !file) {
      throw new Error('Missing user or file for upload.');
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `profileImages/${userId}/${Date.now()}_${safeName}`;
    const fileRef = ref(storage, path);

    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  },
};

