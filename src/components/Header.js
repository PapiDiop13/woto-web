'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui';

const NAV = [
  { href: '/vehicules', label: 'Louer un véhicule' },
  { href: '/fournisseur', label: 'Publier mon véhicule' },
  { href: '/support', label: 'Assistance' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border-c">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <Image src="/brand/logo.png" alt="WOTO" width={32} height={32} className="rounded-lg" />
          <span className="text-lg font-extrabold tracking-tight text-text">WOTO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                pathname === item.href ? 'bg-primary-soft text-primary-dark' : 'text-text-muted hover:text-text hover:bg-surface'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <Button href="/compte" variant="ghost" size="sm">{userProfile?.displayName || 'Mon compte'}</Button>
              <Button onClick={signOut} variant="outline" size="sm">Déconnexion</Button>
            </>
          ) : (
            <>
              <Button href="/connexion" variant="ghost" size="sm">Connexion</Button>
              <Button href="/inscription" variant="primary" size="sm">Créer un compte</Button>
            </>
          )}
        </div>

        <button
          aria-label="Ouvrir le menu"
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border-c bg-white px-5 py-4 flex flex-col gap-1 animate-fade-up">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="px-3 py-3 rounded-xl text-[15px] font-medium text-text hover:bg-surface">
              {item.label}
            </Link>
          ))}
          <div className="h-px bg-border-c my-2" />
          {user ? (
            <>
              <Link href="/compte" onClick={() => setOpen(false)} className="px-3 py-3 rounded-xl text-[15px] font-medium text-text hover:bg-surface">
                {userProfile?.displayName || 'Mon compte'}
              </Link>
              <button onClick={() => { signOut(); setOpen(false); }} className="text-left px-3 py-3 rounded-xl text-[15px] font-medium text-danger hover:bg-danger-soft">
                Déconnexion
              </button>
            </>
          ) : (
            <div className="flex gap-2 px-1 pt-1">
              <Button href="/connexion" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Connexion</Button>
              <Button href="/inscription" variant="primary" className="flex-1" onClick={() => setOpen(false)}>Créer un compte</Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
