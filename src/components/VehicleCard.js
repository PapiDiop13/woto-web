import Link from 'next/link';
import Image from 'next/image';
import { formatFCFA } from '@/lib/format';
import { Badge } from './ui';

export default function VehicleCard({ vehicle }) {
  const v = vehicle;
  const pricing = v.pricing || {};
  const rating = v.rating || { avg: 0, count: 0 };
  const photo = v.photo || v.media?.[0]?.url || '/brand/logo.png';
  return (
    <Link href={`/vehicules/${v.id}`} className="group block">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-alt">
        <Image
          src={photo}
          alt={`${v.make} ${v.model}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        {v.verified && (
          <Badge tone="primary" className="absolute top-3 left-3 bg-white/95 backdrop-blur">✓ Vérifié</Badge>
        )}
        {v.listingType === 'sale' && (
          <Badge tone="warning" className="absolute top-3 right-3 bg-white/95 backdrop-blur">Vente</Badge>
        )}
      </div>
      <div className="pt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-text truncate">{v.make} {v.model}</h3>
          <p className="text-sm text-text-muted truncate">{v.city}{v.quartier ? ` · ${v.quartier}` : ''}</p>
        </div>
        {rating.count > 0 && (
          <div className="flex items-center gap-1 shrink-0 text-sm font-medium text-text pt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#0F1417"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {rating.avg}
          </div>
        )}
      </div>
      <p className="pt-1 font-bold text-text">
        {v.listingType === 'sale' ? formatFCFA(pricing.salePrice || 0) : `${formatFCFA(pricing.daily || 0)} / jour`}
      </p>
    </Link>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] rounded-2xl bg-surface-alt" />
      <div className="h-4 w-2/3 bg-surface-alt rounded mt-3" />
      <div className="h-3 w-1/3 bg-surface-alt rounded mt-2" />
      <div className="h-4 w-1/2 bg-surface-alt rounded mt-2" />
    </div>
  );
}
