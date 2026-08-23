import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-text text-white mt-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Image src="/brand/logo-white.png" alt="WOTO" width={28} height={28} className="rounded-lg" />
            <span className="text-lg font-extrabold">WOTO</span>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">La location de véhicules entre particuliers et professionnels, sans intermédiaire, partout au Sénégal.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white/90 mb-3">Louer</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/vehicules" className="hover:text-white">Tous les véhicules</Link></li>
            <li><Link href="/vehicules?category=suv" className="hover:text-white">SUV</Link></li>
            <li><Link href="/vehicules?category=citadine" className="hover:text-white">Citadines</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white/90 mb-3">Propriétaires</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/fournisseur" className="hover:text-white">Publier un véhicule</Link></li>
            <li><Link href="/inscription" className="hover:text-white">Créer un compte</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white/90 mb-3">Assistance</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/support" className="hover:text-white">Aide &amp; contact</Link></li>
            <li><Link href="/confidentialite" className="hover:text-white">Confidentialité</Link></li>
            <li><a href="mailto:support@woto.app" className="hover:text-white">support@woto.app</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 px-5 sm:px-8 lg:px-16 text-xs text-white/40 flex flex-col sm:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} WOTO — Papa Assane Diop</span>
        <span>Fait avec soin au Sénégal</span>
      </div>
    </footer>
  );
}
