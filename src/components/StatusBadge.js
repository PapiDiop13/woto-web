const LABELS = {
  pending_approval: 'En attente d’accord',
  approved_unpaid: 'Acceptée',
  confirmed: 'Confirmé',
  checked_out: 'En cours',
  returned: 'Rendu',
  completed: 'Terminé',
  rejected: 'Refusé',
  cancelled: 'Annulé',
  disputed: 'Litige ouvert',
  expired: 'Accord expiré',
};

const TONES = {
  pending_approval: 'warning', approved_unpaid: 'warning', confirmed: 'primary',
  checked_out: 'info', returned: 'neutral', completed: 'neutral',
  rejected: 'danger', cancelled: 'danger', disputed: 'danger', expired: 'warning',
};

const TONE_CLASSES = {
  primary: 'bg-primary-soft text-primary-dark',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-surface-alt text-text-muted',
};

export default function StatusBadge({ status }) {
  const tone = TONES[status] || 'neutral';
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold ${TONE_CLASSES[tone]}`}>
      {LABELS[status] || status}
    </span>
  );
}
