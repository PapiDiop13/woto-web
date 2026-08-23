'use client';
import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '@/lib/firebase';
import { useProviderVehicles } from '@/hooks/useVehicles';
import { useProviderBookings } from '@/hooks/useBookings';
import {
  callCreateVehicle, callSetVehicleStatus, callDeleteVehicle,
  callApproveBooking, callRejectBooking, callMarkHandover, callMarkReturn,
} from '@/lib/functions';
import { formatFCFA, formatDateShort } from '@/lib/format';
import { Button, Section, Card, Badge } from '@/components/ui';
import StatusBadge from '@/components/StatusBadge';
import { CATEGORIES } from '@/lib/data';

const FLEET_PAGE_SIZE = 9; // 3 lignes de 3 sur desktop, 4-5 lignes de 2 sur mobile
const REQUESTS_PAGE_SIZE = 8;

export default function ProviderDashboard({ providerId, userProfile }) {
  const [tab, setTab] = useState('requests');
  const { vehicles, isLoading: vLoading } = useProviderVehicles(providerId);
  const { bookings, isLoading: bLoading } = useProviderBookings(providerId);
  const [showAdd, setShowAdd] = useState(false);
  const [reqPage, setReqPage] = useState(1);
  const [fleetPage, setFleetPage] = useState(1);

  const pending = bookings.filter((b) => b.status === 'pending_approval');

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)),
    [bookings]
  );
  const reqTotalPages = Math.max(1, Math.ceil(sortedBookings.length / REQUESTS_PAGE_SIZE));
  const reqPageItems = sortedBookings.slice((reqPage - 1) * REQUESTS_PAGE_SIZE, reqPage * REQUESTS_PAGE_SIZE);

  const fleetTotalPages = Math.max(1, Math.ceil(vehicles.length / FLEET_PAGE_SIZE));
  const fleetPageItems = vehicles.slice((fleetPage - 1) * FLEET_PAGE_SIZE, fleetPage * FLEET_PAGE_SIZE);

  const switchTab = (id) => {
    setTab(id);
  };

  return (
    <Section className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">Espace fournisseur</h1>
            <p className="text-text-muted text-sm mt-1">{vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''} · {pending.length} demande{pending.length !== 1 ? 's' : ''} en attente</p>
          </div>
          <Button onClick={() => setShowAdd(true)}>+ Ajouter un véhicule</Button>
        </div>

        <div className="flex gap-2 mt-8 border-b border-border-c">
          {[['requests', `Demandes (${bookings.length})`], ['fleet', `Ma flotte (${vehicles.length})`]].map(([id, label]) => (
            <button key={id} onClick={() => switchTab(id)} className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition ${tab === id ? 'border-primary text-primary-dark' : 'border-transparent text-text-muted hover:text-text'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'requests' && (
          <div className="mt-6">
            <div className="space-y-3">
              {bLoading ? <p className="text-text-muted text-sm">Chargement…</p> : bookings.length === 0 ? (
                <Card className="p-8 text-center text-text-muted">Aucune demande pour le moment.</Card>
              ) : (
                reqPageItems.map((b) => <BookingRow key={b.id} booking={b} />)
              )}
            </div>
            {reqTotalPages > 1 && (
              <Pagination page={reqPage} totalPages={reqTotalPages} onChange={setReqPage} />
            )}
          </div>
        )}

        {tab === 'fleet' && (
          <div className="mt-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {vLoading ? <p className="text-text-muted text-sm col-span-full">Chargement…</p> : vehicles.length === 0 ? (
                <Card className="p-8 text-center text-text-muted col-span-full">Aucun véhicule publié. Ajoutez-en un pour commencer à recevoir des demandes.</Card>
              ) : fleetPageItems.map((v) => <FleetCard key={v.id} vehicle={v} />)}
            </div>
            {fleetTotalPages > 1 && (
              <Pagination page={fleetPage} totalPages={fleetTotalPages} onChange={setFleetPage} />
            )}
          </div>
        )}
      </div>

      {showAdd && <AddVehicleModal providerId={providerId} userProfile={userProfile} onClose={() => setShowAdd(false)} />}
    </Section>
  );
}

// ─── Pagination ───
function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 rounded-full border border-border-c text-sm font-semibold text-text disabled:opacity-30 hover:bg-surface transition"
      >
        ‹
      </button>
      <span className="text-sm text-text-muted px-2">Page {page} / {totalPages}</span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-full border border-border-c text-sm font-semibold text-text disabled:opacity-30 hover:bg-surface transition"
      >
        ›
      </button>
    </div>
  );
}

function BookingRow({ booking: b }) {
  const [busy, setBusy] = useState(false);
  const act = async (fn) => {
    setBusy(true);
    try { await fn(); } catch (e) { alert(e?.message?.replace(/^\w+\/[\w-]+:\s*/, '') || 'Action impossible.'); }
    finally { setBusy(false); }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-text">{b.reference} · {b.renterName}</p>
          <p className="text-sm text-text-muted">{formatDateShort(b.startAt)} → {formatDateShort(b.endAt)} · {formatFCFA(b.total)}</p>
        </div>
        <StatusBadge status={b.status} />
      </div>

      {b.status === 'pending_approval' && (
        <div className="flex gap-2 mt-3">
          <Button size="sm" disabled={busy} onClick={() => act(() => callApproveBooking(b.id))}>Confirmer</Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => act(() => callRejectBooking(b.id, 'Refusé par le fournisseur'))}>Refuser</Button>
        </div>
      )}

      {b.status === 'confirmed' && !b.handover?.providerConfirmedAt && (
        <div className="flex gap-2 mt-3 flex-wrap">
          <Button size="sm" disabled={busy} onClick={() => act(() => callMarkHandover(b.id, 'provider', false))}>Remis, pas encore payé</Button>
          <Button size="sm" disabled={busy} onClick={() => act(() => callMarkHandover(b.id, 'provider', true))}>Remis et payé</Button>
        </div>
      )}

      {b.status === 'checked_out' && !b.return?.providerConfirmedAt && (
        <div className="flex gap-2 mt-3">
          <Button size="sm" disabled={busy} onClick={() => act(() => callMarkReturn(b.id, 'provider'))}>Confirmer la restitution</Button>
        </div>
      )}

      {b.payment?.method === 'offline' && (
        <p className="text-xs text-primary-dark mt-2">✓ Paiement confirmé reçu — traçabilité enregistrée</p>
      )}
    </Card>
  );
}

function FleetCard({ vehicle: v }) {
  const [busy, setBusy] = useState(false);
  const photoCount = (v.photos && v.photos.length) || (v.photo ? 1 : 0);
  const toggle = async () => {
    setBusy(true);
    try { await callSetVehicleStatus(v.id, v.status === 'active' ? 'paused' : 'active'); }
    catch (e) { alert(e?.message || 'Action impossible.'); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (!confirm(`Supprimer ${v.make} ${v.model} ?`)) return;
    setBusy(true);
    try { await callDeleteVehicle(v.id); }
    catch (e) { alert(e?.message || 'Suppression impossible.'); }
    finally { setBusy(false); }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-surface-alt">
        {v.photo && <Image src={v.photo} alt="" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />}
        <Badge tone={v.status === 'active' ? 'primary' : 'neutral'} className="absolute top-3 left-3 bg-white/95">
          {v.status === 'active' ? 'Actif' : 'En pause'}
        </Badge>
        {photoCount > 1 && (
          <Badge tone="neutral" className="absolute top-3 right-3 bg-black/60 !text-white">
            📷 {photoCount}
          </Badge>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <p className="font-semibold text-text text-sm sm:text-base truncate">{v.make} {v.model}</p>
        <p className="text-xs sm:text-sm text-text-muted">{formatFCFA(v.pricing?.daily || 0)} / jour</p>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" disabled={busy} onClick={toggle} className="flex-1 !text-xs sm:!text-sm">{v.status === 'active' ? 'Pause' : 'Réactiver'}</Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={remove} className="!border-danger !text-danger !text-xs sm:!text-sm">Suppr.</Button>
        </div>
      </div>
    </Card>
  );
}

// ─── Modale d'ajout de véhicule : upload d'images amélioré ───
function AddVehicleModal({ providerId, userProfile, onClose }) {
  const [form, setForm] = useState({ make: '', model: '', year: '', category: 'berline', transmission: 'Auto', seats: '5', quartier: '', city: '', daily: '' });
  const [photos, setPhotos] = useState([]); // [{ id, file, previewUrl }]
  const [coverIndex, setCoverIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (!incoming.length) return;
    setPhotos((prev) => {
      const room = Math.max(0, 6 - prev.length);
      const next = incoming.slice(0, room).map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...prev, ...next];
    });
  };

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      const next = prev.filter((p) => p.id !== id);
      if (idx !== -1 && idx <= coverIndex && coverIndex > 0) setCoverIndex((c) => Math.max(0, c - 1));
      return next;
    });
  };

  const movePhoto = (id, dir) => {
    setPhotos((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      const swapWith = idx + dir;
      if (idx === -1 || swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      if (coverIndex === idx) setCoverIndex(swapWith);
      else if (coverIndex === swapWith) setCoverIndex(idx);
      return next;
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    addFiles(e.dataTransfer.files);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.make || !form.model || !form.quartier || !form.daily) { setError('Marque, modèle, quartier et prix par jour sont requis.'); return; }
    setSubmitting(true);
    setUploadProgress({ done: 0, total: photos.length });
    try {
      const uid = auth.currentUser.uid;
      const orderedPhotos = coverIndex > 0
        ? [photos[coverIndex], ...photos.filter((_, i) => i !== coverIndex)]
        : photos;
      const urls = [];
      for (const p of orderedPhotos) {
        const path = `vehicles/${uid}/${Date.now()}-${p.file.name}`;
        const r = storageRef(storage, path);
        await uploadBytes(r, p.file, { contentType: p.file.type || 'image/jpeg' });
        urls.push(await getDownloadURL(r));
        setUploadProgress((prog) => ({ ...prog, done: prog.done + 1 }));
      }
      await callCreateVehicle({
        ...form,
        providerName: userProfile?.displayName || null,
        photos: urls,
      });
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      onClose();
    } catch (err) {
      setError(err?.message?.replace(/^\w+\/[\w-]+:\s*/, '') || 'Publication impossible. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-text">Ajouter un véhicule</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-surface flex items-center justify-center text-xl">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Marque"><input required value={form.make} onChange={set('make')} className="input" /></Field>
            <Field label="Modèle"><input required value={form.model} onChange={set('model')} className="input" /></Field>
            <Field label="Année"><input type="number" value={form.year} onChange={set('year')} className="input" /></Field>
            <Field label="Places"><input type="number" value={form.seats} onChange={set('seats')} className="input" /></Field>
            <Field label="Catégorie">
              <select value={form.category} onChange={set('category')} className="input">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Transmission">
              <select value={form.transmission} onChange={set('transmission')} className="input">
                <option value="Auto">Automatique</option>
                <option value="Manuelle">Manuelle</option>
              </select>
            </Field>
            <Field label="Quartier"><input required value={form.quartier} onChange={set('quartier')} className="input" /></Field>
            <Field label="Ville"><input value={form.city} onChange={set('city')} className="input" /></Field>
          </div>
          <Field label="Prix par jour (FCFA)"><input required type="number" value={form.daily} onChange={set('daily')} className="input" /></Field>

          <Field label={`Photos (${photos.length}/6) — la première est la photo de couverture`}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition ${dragActive ? 'border-primary bg-primary-soft' : 'border-border-c hover:border-primary/60 hover:bg-surface'}`}
            >
              <p className="text-sm font-semibold text-text">Glissez vos photos ici, ou cliquez pour choisir</p>
              <p className="text-xs text-text-muted mt-1">JPG ou PNG · jusqu'à 6 photos</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
              />
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {photos.map((p, i) => (
                  <div key={p.id} className={`relative aspect-square rounded-xl overflow-hidden border-2 ${i === coverIndex ? 'border-primary' : 'border-transparent'}`}>
                    <Image src={p.previewUrl} alt="" fill className="object-cover" unoptimized sizes="120px" />
                    {i === coverIndex && (
                      <span className="absolute top-1 left-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Couverture</span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-0.5 p-1 bg-gradient-to-t from-black/70 to-transparent">
                      <button type="button" onClick={() => movePhoto(p.id, -1)} className="text-white text-xs w-5 h-5 flex items-center justify-center">‹</button>
                      {i !== coverIndex && (
                        <button type="button" onClick={() => setCoverIndex(i)} className="text-white text-[10px] underline">Couverture</button>
                      )}
                      <button type="button" onClick={() => movePhoto(p.id, 1)} className="text-white text-xs w-5 h-5 flex items-center justify-center">›</button>
                      <button type="button" onClick={() => removePhoto(p.id)} className="text-white text-xs w-5 h-5 flex items-center justify-center">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full" size="lg">
            {submitting
              ? (uploadProgress.total > 0 ? `Envoi des photos… ${uploadProgress.done}/${uploadProgress.total}` : 'Publication…')
              : 'Publier le véhicule'}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-text-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
