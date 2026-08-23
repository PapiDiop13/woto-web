'use client';
import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useActiveVehicles } from '@/hooks/useVehicles';
import VehicleCard, { VehicleCardSkeleton } from '@/components/VehicleCard';
import { CATEGORIES, BRANDS, CITIES } from '@/lib/data';
import { Section } from '@/components/ui';

function VehiculesInner() {
  const params = useSearchParams();
  const { vehicles, isLoading } = useActiveVehicles();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(params.get('category') || '');
  const [city, setCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('recent');

  const filtered = useMemo(() => {
    let list = [...vehicles];
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((v) => `${v.make} ${v.model} ${v.city} ${v.quartier || ''}`.toLowerCase().includes(q));
    if (category) list = list.filter((v) => v.category === category);
    if (city) list = list.filter((v) => v.city === city);
    if (maxPrice) list = list.filter((v) => (v.pricing?.daily || 0) <= Number(maxPrice));
    if (sort === 'price_asc') list.sort((a, b) => (a.pricing?.daily || 0) - (b.pricing?.daily || 0));
    if (sort === 'price_desc') list.sort((a, b) => (b.pricing?.daily || 0) - (a.pricing?.daily || 0));
    if (sort === 'rating') list.sort((a, b) => (b.rating?.avg || 0) - (a.rating?.avg || 0));
    return list;
  }, [vehicles, search, category, city, maxPrice, sort]);

  return (
    <Section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">Tous les véhicules</h1>
        <p className="text-text-muted mt-1">{isLoading ? 'Chargement…' : `${filtered.length} véhicule${filtered.length > 1 ? 's' : ''} disponible${filtered.length > 1 ? 's' : ''}`}</p>

        {/* ─── Barre de recherche ─── */}
        <div className="mt-6 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Marque, modèle, ville, quartier…"
            className="w-full h-13 pl-11 pr-4 py-3.5 rounded-2xl border border-border-c bg-surface focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 text-[15px]"
          />
        </div>

        {/* ─── Filtres ─── */}
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="shrink-0 h-10 rounded-full border border-border-c bg-white px-4 text-sm font-medium text-text focus:outline-none focus:border-primary">
            <option value="">Tous types</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="shrink-0 h-10 rounded-full border border-border-c bg-white px-4 text-sm font-medium text-text focus:outline-none focus:border-primary">
            <option value="">Toutes les villes</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="shrink-0 h-10 rounded-full border border-border-c bg-white px-4 text-sm font-medium text-text focus:outline-none focus:border-primary">
            <option value="">Prix max</option>
            <option value="10000">≤ 10 000 FCFA</option>
            <option value="20000">≤ 20 000 FCFA</option>
            <option value="35000">≤ 35 000 FCFA</option>
            <option value="60000">≤ 60 000 FCFA</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="shrink-0 h-10 rounded-full border border-border-c bg-white px-4 text-sm font-medium text-text focus:outline-none focus:border-primary">
            <option value="recent">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="rating">Mieux notés</option>
          </select>
        </div>

        {/* ─── Resultats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 mt-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <VehicleCardSkeleton key={i} />)
            : filtered.length > 0
              ? filtered.map((v) => <VehicleCard key={v.id} vehicle={v} />)
              : (
                <div className="col-span-full text-center py-20">
                  <p className="text-text-muted">Aucun véhicule ne correspond à votre recherche.</p>
                </div>
              )}
        </div>
      </div>
    </Section>
  );
}

export default function VehiculesPage() {
  return (
    <Suspense fallback={<Section className="py-12"><div className="mx-auto max-w-7xl text-text-muted">Chargement…</div></Section>}>
      <VehiculesInner />
    </Suspense>
  );
}
