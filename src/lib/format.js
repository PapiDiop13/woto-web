export function formatFCFA(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '— FCFA';
  return `${n.toLocaleString('fr-FR').replace(/,/g, ' ')} FCFA`;
}

export function formatDateShort(d) {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}
