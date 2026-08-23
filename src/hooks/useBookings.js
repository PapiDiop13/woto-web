'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useRenterBookings(uid) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!uid) { setBookings([]); setIsLoading(false); return; }
    const unsub = onSnapshot(
      query(collection(db, 'bookings'), where('renterId', '==', uid)),
      (snap) => { setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setIsLoading(false); },
      () => setIsLoading(false)
    );
    return unsub;
  }, [uid]);
  return { bookings, isLoading };
}

export function useProviderBookings(providerId) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!providerId) { setBookings([]); setIsLoading(false); return; }
    const unsub = onSnapshot(
      query(collection(db, 'bookings'), where('providerId', '==', providerId)),
      (snap) => { setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setIsLoading(false); },
      () => setIsLoading(false)
    );
    return unsub;
  }, [providerId]);
  return { bookings, isLoading };
}
