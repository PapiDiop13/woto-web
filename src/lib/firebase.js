// ─── Configuration Firebase (SDK web JS) — meme projet que l'app mobile ───
// Memes valeurs que woto-app/src/config/firebase.js : les donnees (vehicules,
// reservations, comptes) sont strictement partagees entre le site et l'app.
'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyBNiB5Y0hhhGImzg2MeogPk3SGG6IrmrP8',
  authDomain: 'woto-77142.firebaseapp.com',
  projectId: 'woto-77142',
  storageBucket: 'woto-77142.firebasestorage.app',
  messagingSenderId: '1046274926957',
  appId: '1:1046274926957:web:62ede414e39a0ea6e89264',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Long polling : meme choix que le mobile, evite les blocages silencieux sur
// certains reseaux/proxies avec le canal de streaming Firestore par defaut.
// try/catch : initializeFirestore ne peut etre appele qu'une fois par app (le
// Fast Refresh de Next.js peut re-executer ce module sans recreer `app`).
let _db;
try {
  _db = initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });
} catch (e) {
  _db = getFirestore(app);
}
export const db = _db;
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
