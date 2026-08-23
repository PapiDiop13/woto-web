import Link from 'next/link';

// ─── Composants UI de base — mêmes principes que src/components/ui.js
// côté mobile (COLORS/SPACING via tokens Tailwind @theme, jamais en dur). ───

export function Button({ href, onClick, children, variant = 'primary', size = 'md', className = '', type = 'button', disabled }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const sizes = { sm: 'h-9 px-4 text-sm', md: 'h-12 px-6 text-[15px]', lg: 'h-14 px-8 text-base' };
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm shadow-primary/20',
    outline: 'border border-border-c text-text hover:border-primary hover:text-primary bg-white',
    ghost: 'text-text hover:bg-surface',
    white: 'bg-white text-primary-dark hover:bg-white/90 shadow-sm',
    dark: 'bg-text text-white hover:bg-black',
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function Badge({ children, tone = 'primary', className = '' }) {
  const tones = {
    primary: 'bg-primary-soft text-primary-dark',
    warning: 'bg-warning-soft text-warning',
    danger: 'bg-danger-soft text-danger',
    info: 'bg-info-soft text-info',
    neutral: 'bg-surface-alt text-text-muted',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ${tones[tone]} ${className}`}>{children}</span>;
}

export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-2xl border border-border-c ${className}`}>{children}</div>;
}

export function Section({ children, className = '' }) {
  return <section className={`px-5 sm:px-8 lg:px-16 ${className}`}>{children}</section>;
}
