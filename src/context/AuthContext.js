'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut as fbSignOut, sendPasswordResetEmail, updateProfile,
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// ─── Contexte d'authentification — meme comportement que useAuthStore.js
// cote mobile (un seul abonnement Firestore users/{uid} par session). ───
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubProfile = null;
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (unsubProfile) { unsubProfile(); unsubProfile = null; }
      setUser(u);
      if (!u) { setUserProfile(null); setIsLoading(false); return; }
      unsubProfile = onSnapshot(doc(db, 'users', u.uid), (snap) => {
        setUserProfile(snap.exists() ? { id: u.uid, ...snap.data() } : null);
        setIsLoading(false);
      }, () => setIsLoading(false));
    });
    return () => { unsubAuth(); if (unsubProfile) unsubProfile(); };
  }, []);

  const signUp = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    await setDoc(doc(db, 'users', cred.user.uid), {
      email: cred.user.email || null,
      displayName: displayName || '',
      photoURL: null,
      role: 'renter',
      providerId: null,
      kycStatus: 'none',
      locale: 'fr',
      completedRentals: 0,
      createdAt: serverTimestamp(),
    });
    return cred.user;
  };

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signOut = () => fbSignOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading, isAuthenticated: !!user, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit etre utilise dans <AuthProvider>');
  return ctx;
}
