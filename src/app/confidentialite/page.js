import { Section } from '@/components/ui';

export const metadata = { title: 'Politique de confidentialité — WOTO' };

const DATA_ROWS = [
  ['Adresse e-mail, nom affiché', 'Créer et identifier votre compte ; vous contacter au sujet d\'une réservation.'],
  ['Numéro de téléphone (propriétaires, facultatif)', 'Permettre à un locataire de vous joindre. Affiché sur votre page publique uniquement si vous le renseignez.'],
  ["Pièce d'identité (propriétaires)", "Vérifier votre identité avant de vous autoriser à publier un véhicule. Consultée uniquement par notre équipe, jamais publique."],
  ['Position de votre commerce (propriétaires, facultatif)', "Afficher votre point de retrait sur la carte. Vous choisissez de l'enregistrer ou non."],
  ['Photos et vidéos de véhicules', 'Illustrer vos annonces. Elles sont publiques par nature.'],
  ['Réservations (dates, véhicule, montant convenu)', 'Faire fonctionner le service et conserver une trace en cas de litige entre les parties.'],
  ['Jeton de notification', "Vous prévenir d'une demande reçue ou d'une réservation confirmée. Désactivable dans les réglages."],
];

export default function ConfidentialitePage() {
  return (
    <Section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Politique de confidentialité</h1>
        <p className="text-text-muted mt-2 text-sm">Dernière mise à jour : 21 août 2026</p>

        <p className="mt-6 text-[15px] text-text-muted leading-relaxed">
          WOTO est une place de marché qui met en relation des propriétaires de véhicules et des personnes souhaitant en louer un. Cette page explique quelles données le site et l&apos;application collectent, pourquoi, et comment vous en gardez le contrôle.
        </p>

        <div className="mt-6 rounded-2xl bg-surface border border-border-c p-5">
          <p className="text-[15px]"><strong>WOTO ne traite aucun paiement.</strong> Ni numéro de carte bancaire, ni coordonnées bancaires, ni identifiant de portefeuille mobile. Le règlement d&apos;une location se fait directement entre le locataire et le propriétaire, hors application.</p>
        </div>

        <h2 className="text-xl font-bold text-text mt-10 mb-3">Données collectées</h2>
        <div className="overflow-x-auto rounded-2xl border border-border-c">
          <table className="w-full text-sm">
            <thead><tr className="bg-surface text-left"><th className="p-3 font-semibold text-text">Donnée</th><th className="p-3 font-semibold text-text">Pourquoi</th></tr></thead>
            <tbody>
              {DATA_ROWS.map(([d, why]) => (
                <tr key={d} className="border-t border-border-c align-top">
                  <td className="p-3 text-text font-medium w-2/5">{d}</td>
                  <td className="p-3 text-text-muted">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-text mt-10 mb-3">Ce que nous ne faisons pas</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-text-muted">
          <li>Nous ne vendons ni ne louons vos données à des tiers.</li>
          <li>Nous n&apos;affichons pas de publicité et ne pratiquons aucun profilage publicitaire.</li>
          <li>Nous ne suivons pas votre position en arrière-plan ni en dehors de l&apos;application.</li>
          <li>Nous n&apos;accédons pas à vos contacts, à votre agenda, ni à votre pellicule au-delà des photos que vous sélectionnez vous-même.</li>
        </ul>

        <h2 className="text-xl font-bold text-text mt-10 mb-3">Qui peut voir quoi</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-text-muted">
          <li><strong className="text-text">Public</strong> : les annonces de véhicules et la page d&apos;un propriétaire (nom, bannière, logo, adresse, note).</li>
          <li><strong className="text-text">Les deux parties d&apos;une réservation</strong> : le nom, les dates et le montant convenu.</li>
          <li><strong className="text-text">Vous seul</strong> : votre adresse e-mail, votre pièce d&apos;identité, vos réservations et vos notifications.</li>
        </ul>
        <p className="text-sm text-text-muted mt-2">Ces restrictions sont appliquées côté serveur par des règles de sécurité, pas seulement dans l&apos;application.</p>

        <h2 className="text-xl font-bold text-text mt-10 mb-2">Hébergement et sous-traitants</h2>
        <p className="text-[15px] text-text-muted leading-relaxed">WOTO s&apos;appuie sur <strong className="text-text">Google Firebase</strong> pour héberger et sécuriser les données, et sur <strong className="text-text">Vercel</strong> pour l&apos;hébergement du site. Les vidéos de véhicules sont traitées par <strong className="text-text">Mux</strong>. Ces prestataires agissent pour notre compte et ne sont pas autorisés à utiliser vos données à leurs propres fins.</p>

        <h2 className="text-xl font-bold text-text mt-10 mb-2">Conservation et suppression</h2>
        <p className="text-[15px] text-text-muted leading-relaxed">Vos données sont conservées tant que votre compte existe. Vous pouvez le supprimer à tout moment : <strong className="text-text">Mon compte → Supprimer mon compte</strong>. Cette action efface votre profil, vos annonces et vos données personnelles.</p>

        <h2 className="text-xl font-bold text-text mt-10 mb-2">Vos droits</h2>
        <p className="text-[15px] text-text-muted leading-relaxed">Vous pouvez demander l&apos;accès à vos données, leur correction, leur suppression, ou vous opposer à leur traitement, en écrivant à l&apos;adresse ci-dessous. Nous répondons sous 30 jours.</p>

        <h2 className="text-xl font-bold text-text mt-10 mb-2">Mineurs</h2>
        <p className="text-[15px] text-text-muted leading-relaxed">WOTO n&apos;est pas destiné aux personnes de moins de 18 ans et nous ne collectons pas sciemment leurs données.</p>

        <h2 className="text-xl font-bold text-text mt-10 mb-2">Contact</h2>
        <div className="rounded-2xl bg-surface border border-border-c p-5">
          <p className="text-[15px]">Pour toute question relative à vos données : <a href="mailto:support@woto.app" className="text-primary font-semibold">support@woto.app</a></p>
        </div>

        <h2 className="text-xl font-bold text-text mt-10 mb-2">Modifications</h2>
        <p className="text-[15px] text-text-muted leading-relaxed pb-4">Toute évolution de cette politique sera publiée sur cette page, avec une nouvelle date de mise à jour.</p>
      </div>
    </Section>
  );
}
