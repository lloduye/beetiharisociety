/* eslint-disable no-unused-vars -- firestore imports may trigger false positives */
// Community Members service - stores signup data in Firestore, synced with Stripe customers
import { db, firebaseInitialized } from '../config/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit as limitQuery,
  serverTimestamp,
} from 'firebase/firestore';

const COMMUNITY_MEMBERS_COLLECTION = 'communityMembers';

export const communityMembersService = {
  /**
   * Get all community members (optionally filtered by email)
   */
  async getAll(opts = {}) {
    if (!firebaseInitialized || !db) return [];

    try {
      const ref = collection(db, COMMUNITY_MEMBERS_COLLECTION);
      const q = opts.email
        ? query(ref, where('email', '==', opts.email.toLowerCase()), limitQuery(100))
        : query(ref, orderBy('createdAt', 'desc'), limitQuery(200));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error getting community members:', error);
      return [];
    }
  },

  /**
   * Get a member by email
   */
  async getByEmail(email) {
    if (!firebaseInitialized || !db) return null;

    try {
      const ref = collection(db, COMMUNITY_MEMBERS_COLLECTION);
      const q = query(ref, where('email', '==', email.toLowerCase()), limitQuery(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
      console.error('Error getting community member by email:', error);
      return null;
    }
  },

  /**
   * Get a member by Stripe customer ID
   */
  async getByStripeCustomerId(stripeCustomerId) {
    if (!firebaseInitialized || !db) return null;

    try {
      const ref = collection(db, COMMUNITY_MEMBERS_COLLECTION);
      const q = query(ref, where('stripeCustomerId', '==', stripeCustomerId), limitQuery(1));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    } catch (error) {
      console.error('Error getting community member by Stripe ID:', error);
      return null;
    }
  },

  /**
   * Create a community member (called after Stripe customer is created)
   */
  async create(memberData) {
    if (!firebaseInitialized || !db) {
      throw new Error('Firebase is not initialized.');
    }

    const existing = await this.getByEmail(memberData.email);
    if (existing) {
      throw new Error('A community member with this email already exists.');
    }

    const docRef = doc(collection(db, COMMUNITY_MEMBERS_COLLECTION));
    const record = {
      firstName: (memberData.firstName || '').trim(),
      lastName: (memberData.lastName || '').trim(),
      email: (memberData.email || '').trim().toLowerCase(),
      phone: (memberData.phone || '').trim(),
      country: (memberData.country || '').trim(),
      addressLine1: (memberData.addressLine1 || '').trim(),
      addressLine2: (memberData.addressLine2 || '').trim(),
      city: (memberData.city || '').trim(),
      state: (memberData.state || '').trim(),
      postalCode: (memberData.postalCode || '').trim(),
      stripeCustomerId: memberData.stripeCustomerId || null,
      consentGiven: memberData.consentGiven === true,
      createdAt: serverTimestamp(),
    };

    await setDoc(docRef, record);
    return { id: docRef.id, ...record };
  },

  /**
   * Update a community member by Firestore doc ID or by stripeCustomerId
   */
  async update(memberIdOrStripeId, updates) {
    if (!firebaseInitialized || !db) {
      throw new Error('Firebase is not initialized.');
    }

    let docRef;
    if (memberIdOrStripeId.startsWith('cus_')) {
      const member = await this.getByStripeCustomerId(memberIdOrStripeId);
      if (!member) throw new Error('Community member not found in Firestore.');
      docRef = doc(db, COMMUNITY_MEMBERS_COLLECTION, member.id);
    } else {
      docRef = doc(db, COMMUNITY_MEMBERS_COLLECTION, memberIdOrStripeId);
    }

    const safeFields = ['firstName', 'lastName', 'email', 'phone', 'country', 'addressLine1', 'addressLine2', 'city', 'state', 'postalCode'];
    const updateData = { updatedAt: serverTimestamp() };
    for (const key of safeFields) {
      if (updates[key] != null) {
        const v = String(updates[key]).trim();
        updateData[key] = key === 'email' ? v.toLowerCase() : v;
      }
    }

    if (Object.keys(updateData).length <= 1) return;
    await setDoc(docRef, updateData, { merge: true });
  },
};
