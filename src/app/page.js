'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useActiveVehicles } from '@/hooks/useVehicles';
import VehicleCard, { VehicleCardSkeleton } from '@/components/VehicleCard';
import { Button, Section } from '@/components/ui';
import { CATEGORIES } from '@/lib/data';

const CATEGORY_ICONS = {
  berline: '🚗', suv: '🚙', pickup: '🛻', '4x4': '🚜', citadine: '🚕', minibus: '🚐',
};

const STEPS = [
  { n: '01', title: 'Parcourez', text: 'Filtrez par ville, quartier, prix et type de véhicule. Photos réelles, disponibilité en direct.' },
  { n: '02', title: 'Réservez', text: 'Choisissez vos dates et envoyez une demande. Le propriétaire confirme en quelques heures.' },
  { n: '03', title: 'Récupérez', text: 'Rencontrez le propriétaire au lieu convenu, réglez directement et prenez la route.' },
];

const TRUST = [
  { title: 'Propriétaires vérifiés', text: 'Chaque compte propriétaire passe par une vérification avant de pouvoir publier une annonce.', icon: '🛡️' },
  { title: 'Sans intermédiaire', text: 'Vous échangez directement avec le propriétaire — pas de commission cachée, pas de compte séquestre.', icon: '🤝' },
  { title: 'Disponible en direct', text: 'Le calendrier de chaque véhicule se met à jour en temps réel dès qu\'une réservation est confirmée.', icon: '📍' },
];

export default function Home() {
  const { vehicles, isLoading } = useActiveVehicles();
  const featured = vehicles.slice(0, 8);

  return (
    <div>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-text">
        <div className="absolute inset-0">
          <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-primary/30 blur-3xl animate-float" />
          <div className="absolute top-1/2 -left-32 w-[420px] h-[420px] rounded-full bg-primary/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <Section className="relative py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white/90 text-xs font-semibold px-3 py-1.5 mb-6 backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Disponible partout au Sénégal
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05] tracking-tight">
                Louez une voiture,<br />près de <span className="text-primary">vous</span>.
              </h1>
              <p className="mt-6 text-lg text-white/70 max-w-lg leading-relaxed">
                WOTO met en relation les propriétaires de véhicules et les personnes qui souhaitent en louer un. Sans intermédiaire, sans complication.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button href="/vehicules" size="lg">Trouver un véhicule</Button>
                <Button href="/fournisseur" size="lg" variant="white">Publier mon véhicule</Button>
              </div>
              <div className="mt-10 flex items-center gap-8 text-white/70">
                <div>
                  <p className="text-2xl font-extrabold text-white">{vehicles.length > 0 ? `${vehicles.length}+` : '—'}</p>
                  <p className="text-xs uppercase tracking-wide">Véhicules actifs</p>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div>
                  <p className="text-2xl font-extrabold text-white">0 FCFA</p>
                  <p className="text-xs uppercase tracking-wide">Commission locataire</p>
                </div>
                <div className="w-px h-10 bg-white/15" />
                <div>
                  <p className="text-2xl font-extrabold text-white">24 h</p>
                  <p className="text-xs uppercase tracking-wide">Modération annonces</p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: '.15s' }}>
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1200"
                  alt="Véhicule WOTO"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
                  <p className="text-xs font-semibold text-text-muted">Toyota RAV4 · Dakar</p>
                  <div className="flex items-baseline justify-between mt-1">
                    <p className="text-lg font-extrabold text-text">25 000 FCFA<span className="text-xs font-medium text-text-muted"> /jour</span></p>
                    <span className="text-xs font-semibold text-primary-dark bg-primary-soft rounded-full px-2 py-1">✓ Vérifié</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* ─── Categories ─── */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/vehicules?category=${c.id}`}
                className="shrink-0 flex items-center gap-2 rounded-2xl border border-border-c bg-white px-4 py-3 hover:border-primary hover:bg-primary-soft transition"
              >
                <span className="text-xl">{CATEGORY_ICONS[c.id]}</span>
                <span className="text-sm font-semibold text-text">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Vehicules en vedette ─── */}
      <Section className="py-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">Disponibles près de vous</h2>
              <p className="text-text-muted mt-1">Mis à jour en temps réel</p>
            </div>
            <Button href="/vehicules" variant="ghost" className="hidden sm:inline-flex">Tout voir →</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <VehicleCardSkeleton key={i} />)
              : featured.length > 0
                ? featured.map((v) => <VehicleCard key={v.id} vehicle={v} />)
                : (
                  <div className="col-span-full text-center py-16 text-text-muted">
                    Aucun véhicule publié pour le moment. Revenez bientôt.
                  </div>
                )}
          </div>
          <Button href="/vehicules" variant="outline" className="w-full mt-8 sm:hidden">Voir tous les véhicules</Button>
        </div>
      </Section>

      {/* ─── Comment ça marche ─── */}
      <Section className="py-20 sm:py-28 bg-surface mt-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight text-center">Comment ça marche</h2>
          <p className="text-text-muted text-center mt-2 max-w-xl mx-auto">Trois étapes, sans paiement en ligne : vous réglez directement le propriétaire à la remise du véhicule.</p>
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-white rounded-2xl border border-border-c p-6">
                <span className="text-3xl font-extrabold text-primary/25">{s.n}</span>
                <h3 className="text-lg font-bold text-text mt-2">{s.title}</h3>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Confiance ─── */}
      <Section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-3 gap-8">
          {TRUST.map((t) => (
            <div key={t.title} className="text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center text-2xl mx-auto sm:mx-0">{t.icon}</div>
              <h3 className="text-lg font-bold text-text mt-4">{t.title}</h3>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── CTA proprietaire ─── */}
      <Section className="py-4 sm:py-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-br from-primary to-primary-dark px-6 sm:px-14 py-14 sm:py-20 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight relative">Un véhicule qui dort au garage ?</h2>
          <p className="text-white/80 mt-3 max-w-lg mx-auto relative">Publiez-le sur WOTO et commencez à recevoir des demandes de location près de chez vous.</p>
          <div className="mt-8 relative">
            <Button href="/fournisseur" size="lg" variant="white">Publier mon véhicule</Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
