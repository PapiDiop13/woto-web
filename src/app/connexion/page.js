'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, Section, Card } from '@/components/ui';

function ConnexionInner() {
  const { signIn } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.push(params.get('next') || '/compte');
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="py-16 sm:py-24">
      <Card className="max-w-md mx-auto p-8">
        <h1 className="text-2xl font-extrabold text-text tracking-tight">Connexion</h1>
        <p className="text-text-muted mt-1 text-sm">Accédez à vos réservations et à votre compte.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
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
          <Button type="submit" disabled={loading} className="w-full" size="lg">{loading ? 'Connexion…' : 'Se connecter'}</Button>
        </form>
        <p className="text-center text-sm text-text-muted mt-6">
          Pas encore de compte ? <Link href="/inscription" className="text-primary font-semibold">Créer un compte</Link>
        </p>
        <p className="text-center text-sm mt-2">
          <Link href="/vehicules" className="text-text-muted hover:text-text">Continuer sans compte →</Link>
        </p>
      </Card>
    </Section>
  );
}

export default function ConnexionPage() {
  return <Suspense fallback={null}><ConnexionInner /></Suspense>;
}
