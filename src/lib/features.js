// ─── Interrupteur paiement — DOIT rester synchrone avec woto-app/src/config/features.js
// et functions/index.js (PAYMENTS_ENABLED). V1 : aucun paiement dans le produit,
// ni sur l'app ni sur le site. Voir ce fichier cote mobile pour le contexte complet.
export const PAYMENTS_ENABLED = false;
export default { PAYMENTS_ENABLED };
