'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRenterBookings } from '@/hooks/useBookings';
import { callCancelBooking, callDeleteAccount } from '@/lib/functions';
import { formatFCFA, formatDateShort } from '@/lib/format';
import { Button, Section, Card } from '@/components/ui';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';

export default function ComptePage() {
  const { user, userProfile, isLoading, signOut } = useAuth();
  const router = useRouter();
  const { bookings, isLoading: bLoading } = useRenterBookings(user?.uid);
  const [busyId, setBusyId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) return <Section className="py-24 text-center text-text-muted">Chargement…</Section>;
  if (!user) {
    return (
      <Section className="py-24 text-center">
        <p className="text-text-muted">Connectez-vous pour voir votre compte.</p>
        <Button href="/connexion?next=/compte" className="mt-6">Se connecter</Button>
      </Section>
    );
  }

  const sorted = [...bookings].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  const cancel = async (id) => {
    setBusyId(id);
    try { await callCancelBooking(id, 'Annulé par le locataire'); }
    catch (e) { alert(e?.message || 'Impossible d\'annuler.'); }
    finally { setBusyId(null); }
  };

  const deleteAccount = async () => {
    try {
      await callDeleteAccount();
      router.push('/');
    } catch (e) {
      alert(e?.message?.replace(/^\w+\/[\w-]+:\s*/, '') || 'Suppression impossible pour le moment.');
    }
  };

  return (
    <Section className="py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">{userProfile?.displayName || 'Mon compte'}</h1>
            <p className="text-text-muted text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex gap-2">
            {userProfile?.role === 'provider' && <Button href="/fournisseur" variant="outline" size="sm">Espace fournisseur</Button>}
            <Button onClick={signOut} variant="ghost" size="sm">Déconnexion</Button>
          </div>
        </div>

        <h2 className="text-lg font-bold text-text mt-10 mb-4">Mes réservations</h2>
        {bLoading ? (
          <p className="text-text-muted text-sm">Chargement…</p>
        ) : sorted.length === 0 ? (
          <Card className="p-8 text-center text-text-muted">
            Aucune réservation pour le moment.
            <div className="mt-4"><Button href="/vehicules" variant="primary" size="sm">Parcourir les véhicules</Button></div>
          </Card>
        ) : (
          <div className="space-y-3">
            {sorted.map((b) => (
              <Card key={b.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-text">{b.reference}</p>
                  <p className="text-sm text-text-muted">{formatDateShort(b.startAt)} → {formatDateShort(b.endAt)} · {b.days} jour{b.days > 1 ? 's' : ''}</p>
                  <p className="text-sm text-text-muted">{formatFCFA(b.total)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={b.status} />
                  {b.status === 'pending_approval' && (
                    <Button onClick={() => cancel(b.id)} disabled={busyId === b.id} variant="outline" size="sm">
                      {busyId === b.id ? '…' : 'Annuler'}
                    </Button>
                  )}
                  <Link href={`/vehicules/${b.vehicleId}`} className="text-sm font-medium text-primary hover:underline">Voir le véhicule</Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-14 pt-8 border-t border-border-c">
          <h2 className="text-sm font-bold text-danger mb-2">Zone dangereuse</h2>
          {!confirmDelete ? (
            <Button onClick={() => setConfirmDelete(true)} variant="outline" size="sm" className="!border-danger !text-danger hover:!bg-danger-soft">
              Supprimer mon compte
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm text-text-muted">Confirmer la suppression définitive ?</p>
              <Button onClick={deleteAccount} size="sm" className="!bg-danger hover:!bg-danger">Oui, supprimer</Button>
              <Button onClick={() => setConfirmDelete(false)} variant="ghost" size="sm">Annuler</Button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
