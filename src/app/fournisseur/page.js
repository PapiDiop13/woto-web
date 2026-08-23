'use client';
import { useState } from 'react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { callSubmitProviderApplication } from '@/lib/functions';
import { Button, Section, Card } from '@/components/ui';
import ProviderDashboard from './ProviderDashboard';

export default function FournisseurPage() {
  const { user, userProfile, isLoading } = useAuth();

  if (isLoading) return <Section className="py-24 text-center text-text-muted">Chargement…</Section>;

  if (!user) {
    return (
      <Section className="py-24 text-center max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">Devenez propriétaire WOTO</h1>
        <p className="text-text-muted mt-3">Créez un compte pour publier votre véhicule et recevoir des demandes de location.</p>
        <Button href="/inscription" className="mt-6" size="lg">Créer un compte</Button>
      </Section>
    );
  }

  if (userProfile?.role === 'provider') {
    return <ProviderDashboard providerId={userProfile.providerId} userProfile={userProfile} />;
  }

  return <ApplicationForm status={userProfile?.providerApplicationStatus} />;
}

function ApplicationForm({ status }) {
  const [companyName, setCompanyName] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(status === 'pending');

  if (status === 'pending' || sent) {
    return (
      <Section className="py-24 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-warning-soft flex items-center justify-center mx-auto text-3xl">⏳</div>
        <h1 className="text-2xl font-extrabold text-text tracking-tight mt-6">Candidature en cours d&apos;examen</h1>
        <p className="text-text-muted mt-3">Notre équipe vérifie votre pièce d&apos;identité. Vous recevrez un accès dès l&apos;approbation, en général sous 48 heures.</p>
      </Section>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!companyName.trim()) { setError('Indiquez votre nom ou celui de votre garage.'); return; }
    if (!file) { setError('Ajoutez une photo de votre pièce d\'identité.'); return; }
    setSubmitting(true);
    try {
      const { auth } = await import('@/lib/firebase');
      const uid = auth.currentUser.uid;
      const path = `providers/${uid}/id-${Date.now()}.jpg`;
      const r = storageRef(storage, path);
      await uploadBytes(r, file, { contentType: file.type || 'image/jpeg' });
      const idPhotoUrl = await getDownloadURL(r);
      await callSubmitProviderApplication({ companyName: companyName.trim(), idPhotoUrl });
      setSent(true);
    } catch (err) {
      setError(err?.message?.replace(/^\w+\/[\w-]+:\s*/, '') || 'Envoi impossible. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section className="py-16 sm:py-24">
      <Card className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-extrabold text-text tracking-tight">Publier un véhicule</h1>
        <p className="text-text-muted mt-1 text-sm">Une vérification rapide avant de pouvoir publier — pour la sécurité de tous.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-text">Nom ou nom du garage</label>
            <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)}
              className="w-full mt-1 h-12 rounded-xl border border-border-c px-4 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-semibold text-text">Pièce d&apos;identité (photo)</label>
            <input required type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full mt-1 text-sm file:mr-3 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-primary-soft file:text-primary-dark file:font-semibold" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full" size="lg">{submitting ? 'Envoi…' : 'Envoyer ma candidature'}</Button>
        </form>
      </Card>
    </Section>
  );
}
