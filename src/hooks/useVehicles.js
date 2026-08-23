'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ─── Vehicules actifs — meme requete que useFleetStore.js cote mobile ───
// (collection('vehicles') where status == 'active'), pour que le site et
// l'app affichent strictement le meme catalogue en temps reel.
export function useActiveVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'vehicles'), where('status', '==', 'active')),
      (snap) => {
        setVehicles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setIsLoading(false);
      },
      (err) => { console.error('useActiveVehicles', err); setError(err); setIsLoading(false); }
    );
    return unsub;
  }, []);

  return { vehicles, isLoading, error };
}

export function useProviderVehicles(providerId) {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!providerId) { setVehicles([]); setIsLoading(false); return; }
    const unsub = onSnapshot(
      query(collection(db, 'vehicles'), where('providerId', '==', providerId)),
      (snap) => { setVehicles(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setIsLoading(false); },
      () => setIsLoading(false)
    );
    return unsub;
  }, [providerId]);

  return { vehicles, isLoading };
}
