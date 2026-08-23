'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, Section, Card } from '@/components/ui';

export default function InscriptionPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    setLoading(true);
    try {
      await signUp(email, password, name);
      router.push('/compte');
    } catch (err) {
      const code = err?.code || '';
      if (code.includes('email-already-in-use')) setError('Un compte existe déjà avec cet email.');
      else setError('Impossible de créer le compte. Vérifiez vos informations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="py-16 sm:py-24">
      <Card className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-extrabold text-text tracking-tight">Créer un compte</h1>
        <p className="text-text-muted mt-1 text-sm">Nécessaire pour réserver ou publier un véhicule.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-text">Nom complet</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 h-12 rounded-xl border border-border-c px-4 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-semibold text-text">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 h-12 rounded-xl border border-border-c px-4 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-sm font-semibold text-text">Mot de passe</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 h-12 rounded-xl border border-border-c px-4 text-sm focus:outline-none focus:border-primary" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full" size="lg">{loading ? 'Création…' : 'Créer mon compte'}</Button>
        </form>
        <p className="text-center text-sm text-text-muted mt-6">
          Déjà un compte ? <Link href="/connexion" className="text-primary font-semibold">Se connecter</Link>
        </p>
      </Card>
    </Section>
  );
}
