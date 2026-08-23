'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { callRequestBooking } from '@/lib/functions';
import { formatFCFA } from '@/lib/format';
import { Badge, Button, Section, Card } from '@/components/ui';

export default function VehicleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'vehicles', id), (snap) => {
      if (!snap.exists()) { setNotFound(true); return; }
      setVehicle({ id: snap.id, ...snap.data() });
    }, () => setNotFound(true));
    return unsub;
  }, [id]);

  if (notFound) {
    return (
      <Section className="py-24 text-center">
        <p className="text-text-muted">Ce véhicule n&apos;existe plus ou a été retiré.</p>
        <Button href="/vehicules" variant="outline" className="mt-6">Retour aux véhicules</Button>
      </Section>
    );
  }
  if (!vehicle) {
    return <Section className="py-24 text-center text-text-muted">Chargement…</Section>;
  }

  const photos = (vehicle.media?.filter((m) => m.type === 'image').map((m) => m.url)) || (vehicle.photo ? [vehicle.photo] : []);
  const pricing = vehicle.pricing || {};
  const rating = vehicle.rating || { avg: 0, count: 0 };

  const days = startAt && endAt ? Math.max(1, Math.round((new Date(endAt) - new Date(startAt)) / 86400000) + 1) : 0;
  const estimatedTotal = days > 0 ? days * (pricing.daily || 0) : 0;

  const submitRequest = async () => {
    setError('');
    if (!user) { router.push(`/connexion?next=/vehicules/${id}`); return; }
    if (!startAt || !endAt) { setError('Choisissez vos dates de location.'); return; }
    setSubmitting(true);
    try {
      await callRequestBooking({ vehicleId: id, startAt, endAt });
      setSuccess(true);
    } catch (e) {
      setError(e?.message?.replace(/^\w+\/[\w-]+:\s*/, '') || 'Impossible d\'envoyer la demande. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Section className="py-24 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mx-auto text-3xl">✓</div>
        <h1 className="text-2xl font-extrabold text-text mt-6">Demande envoyée</h1>
        <p className="text-text-muted mt-2">Le propriétaire de {vehicle.make} {vehicle.model} va confirmer votre demande. Suivez son statut depuis votre compte.</p>
        <div className="flex gap-3 justify-center mt-8">
          <Button href="/compte" variant="primary">Mes réservations</Button>
          <Button href="/vehicules" variant="outline">Continuer à parcourir</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        {/* ─── Galerie ─── */}
        <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-surface-alt">
          {photos.length > 0 && (
            <Image src={photos[activePhoto]} alt={`${vehicle.make} ${vehicle.model}`} fill className="object-cover" priority sizes="100vw" />
          )}
          {vehicle.verified && <Badge tone="primary" className="absolute top-4 left-4 bg-white/95">✓ Vérifié</Badge>}
        </div>
        {photos.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {photos.map((p, i) => (
              <button key={p + i} onClick={() => setActivePhoto(i)} className={`relative shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 ${i === activePhoto ? 'border-primary' : 'border-transparent'}`}>
                <Image src={p} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10 mt-8">
          {/* ─── Infos ─── */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">{vehicle.make} {vehicle.model} {vehicle.year ? `· ${vehicle.year}` : ''}</h1>
                <p className="text-text-muted mt-1">{vehicle.city}{vehicle.quartier ? `, ${vehicle.quartier}` : ''}</p>
              </div>
              {rating.count > 0 && (
                <div className="text-right shrink-0">
                  <p className="font-bold text-text">★ {rating.avg}</p>
                  <p className="text-xs text-text-muted">{rating.count} avis</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                ['Transmission', vehicle.transmission || '—'],
                ['Places', vehicle.seats || '—'],
                ['Climatisation', vehicle.ac ? 'Oui' : 'Non'],
                ['Catégorie', vehicle.category || '—'],
              ].map(([label, val]) => (
                <Card key={label} className="p-4">
                  <p className="text-xs text-text-faint uppercase font-semibold tracking-wide">{label}</p>
                  <p className="font-semibold text-text mt-1 capitalize">{val}</p>
                </Card>
              ))}
            </div>

            {vehicle.description && (
              <div className="mt-8">
                <h2 className="font-bold text-text mb-2">Description</h2>
                <p className="text-text-muted leading-relaxed whitespace-pre-line">{vehicle.description}</p>
              </div>
            )}

            <div className="mt-8">
              <h2 className="font-bold text-text mb-2">Propriétaire</h2>
              <p className="text-text-muted">{vehicle.providerName || 'Propriétaire WOTO'}</p>
            </div>
          </div>

          {/* ─── Reservation ─── */}
          <div>
            <Card className="p-5 sticky top-24">
              <p className="text-2xl font-extrabold text-text">{formatFCFA(pricing.daily || 0)} <span className="text-sm font-medium text-text-muted">/ jour</span></p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted">Début</label>
                  <input type="date" value={startAt} onChange={(e) => setStartAt(e.target.value)} min={new Date().toISOString().slice(0, 10)}
                    className="w-full mt-1 h-11 rounded-xl border border-border-c px-3 text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted">Fin</label>
                  <input type="date" value={endAt} onChange={(e) => setEndAt(e.target.value)} min={startAt || new Date().toISOString().slice(0, 10)}
                    className="w-full mt-1 h-11 rounded-xl border border-border-c px-3 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>

              {days > 0 && (
                <div className="mt-4 pt-4 border-t border-border-c text-sm space-y-1">
                  <div className="flex justify-between text-text-muted"><span>{days} jour{days > 1 ? 's' : ''} × {formatFCFA(pricing.daily || 0)}</span><span>{formatFCFA(estimatedTotal)}</span></div>
                  <div className="flex justify-between font-bold text-text pt-1"><span>Estimation totale</span><span>{formatFCFA(estimatedTotal)}</span></div>
                  <p className="text-xs text-text-faint pt-1">Réglé directement au propriétaire à la remise du véhicule.</p>
                </div>
              )}

              {error && <p className="text-sm text-danger mt-3">{error}</p>}

              <Button onClick={submitRequest} disabled={submitting} className="w-full mt-5" size="lg">
                {submitting ? 'Envoi…' : 'Demander à réserver'}
              </Button>
              <p className="text-xs text-text-faint text-center mt-3">Aucun paiement n&apos;est demandé maintenant.</p>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}
