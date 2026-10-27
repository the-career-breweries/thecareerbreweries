import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length && process.env.FIREBASE_PROJECT_ID) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin initialized.');
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const adminAuth = getApps().length ? getAuth() : ({} as any);
const adminDb = getApps().length ? getFirestore() : ({} as any);

export { adminAuth, adminDb };
