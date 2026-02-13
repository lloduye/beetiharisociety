// Projects service - manages projects using Firebase Firestore
import { db, firebaseInitialized } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

const PROJECTS_COLLECTION = 'projects';

const slugify = (text) =>
  text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-') || '';

export const projectsService = {
  async getAll() {
    if (!firebaseInitialized || !db) {
      throw new Error('Firebase is not initialized.');
    }
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const snapshot = await getDocs(projectsRef);
    const projects = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    return projects.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  },

  async getById(id) {
    if (!firebaseInitialized || !db) {
      throw new Error('Firebase is not initialized.');
    }
    const projectRef = doc(db, PROJECTS_COLLECTION, id.toString());
    const snap = await getDoc(projectRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  async getBySlug(slug) {
    if (!firebaseInitialized || !db) {
      throw new Error('Firebase is not initialized.');
    }
    const projects = await this.getAll();
    return projects.find((p) => (p.slug || '').toLowerCase() === (slug || '').toLowerCase()) || null;
  },

  async create(projectData) {
    if (!firebaseInitialized || !db) {
      throw new Error('Firebase is not initialized.');
    }
    const slug = projectData.slug?.trim() || slugify(projectData.title || '');
    const projectRef = doc(collection(db, PROJECTS_COLLECTION));
    const project = {
      ...projectData,
      id: projectRef.id,
      slug,
      order: projectData.order ?? 999,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(projectRef, project);
    return { id: projectRef.id, ...project };
  },

  async update(id, updates) {
    if (!firebaseInitialized || !db) {
      throw new Error('Firebase is not initialized.');
    }
    const projectRef = doc(db, PROJECTS_COLLECTION, id.toString());
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    if (updates.title && !updates.slug) {
      updateData.slug = slugify(updates.title);
    }
    await setDoc(projectRef, updateData, { merge: true });
    const updated = await getDoc(projectRef);
    return { id: updated.id, ...updated.data() };
  },

  async delete(id) {
    if (!firebaseInitialized || !db) {
      throw new Error('Firebase is not initialized.');
    }
    await deleteDoc(doc(db, PROJECTS_COLLECTION, id.toString()));
    return true;
  },
};
