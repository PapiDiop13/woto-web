import { Section } from '@/components/ui';

export const metadata = { title: 'Assistance — WOTO' };

export default function SupportPage() {
  return (
    <Section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl prose-w">
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Assistance</h1>
        <p className="text-text-muted mt-2">Une question, un problème, un litige ? Écrivez-nous.</p>

        <div className="mt-6 rounded-2xl bg-surface border border-border-c p-5">
          <p><strong>Nous écrire :</strong> <a href="mailto:support@woto.app" className="text-primary font-semibold">support@woto.app</a></p>
          <p className="mt-2 text-sm text-text-muted">Nous répondons sous 48 heures ouvrées. Pour aller plus vite, indiquez la référence de la réservation concernée (format <strong>WT-A1234</strong>, visible en haut de l&apos;écran de réservation).</p>
        </div>

        <h2 className="text-xl font-bold text-text mt-10 mb-3">Comment ça marche</h2>
        <ul className="space-y-3 text-[15px] text-text-muted leading-relaxed">
          <li><strong className="text-text">Louer un véhicule</strong> — Choisissez un véhicule, sélectionnez vos dates, envoyez une demande. Le propriétaire la confirme, puis vous convenez ensemble du lieu de retrait et du règlement.</li>
          <li><strong className="text-text">Le paiement</strong> — WOTO ne prend aucun paiement pour le moment. Vous réglez directement le propriétaire, à la remise du véhicule. Celui-ci confirme dans l&apos;application avoir reçu le règlement, ce qui laisse une trace pour vous deux.</li>
          <li><strong className="text-text">Publier un véhicule</strong> — Il faut un compte propriétaire vérifié. Depuis votre profil, envoyez une pièce d&apos;identité ; notre équipe la vérifie avant de vous ouvrir la publication.</li>
          <li><strong className="text-text">Annuler</strong> — Tant que la location n&apos;a pas commencé, le locataire peut annuler depuis l&apos;écran de la réservation. Les dates redeviennent aussitôt disponibles.</li>
        </ul>

        <h2 className="text-xl font-bold text-text mt-10 mb-3">Questions fréquentes</h2>
        <div className="space-y-5">
          <FAQ q="Mon véhicule n'apparaît pas dans les recherches">
            Vérifiez qu&apos;il est bien en statut <strong>Actif</strong> dans « Ma flotte » — un véhicule en pause reste invisible. Vérifiez aussi qu&apos;aucun filtre n&apos;est actif sur l&apos;écran d&apos;accueil.
          </FAQ>
          <FAQ q="Je n'arrive pas à publier une annonce">
            La publication demande un compte propriétaire approuvé. Si votre pièce d&apos;identité est encore en cours d&apos;examen, le bouton reste indisponible.
          </FAQ>
          <FAQ q="Les dates que je veux sont grisées">
            Elles sont déjà réservées sur ce véhicule. Choisissez d&apos;autres dates, ou activez la cloche sur la fiche du véhicule pour être prévenu dès qu&apos;il se libère.
          </FAQ>
          <FAQ q="Un problème avec le véhicule ou le propriétaire">
            Ouvrez la réservation concernée et utilisez <strong>Signaler un problème</strong>. WOTO n&apos;arbitre pas les différends mais conserve la trace complète de la réservation et peut la fournir sur demande légitime.
          </FAQ>
          <FAQ q="Supprimer mon compte">
            Paramètres → Supprimer mon compte (ou depuis <a href="/compte" className="text-primary">votre compte</a> sur le site). La suppression est définitive et efface votre profil, vos annonces et vos données personnelles. Elle est bloquée s&apos;il vous reste une location en cours.
          </FAQ>
        </div>

        <h2 className="text-xl font-bold text-text mt-10 mb-2">Confidentialité</h2>
        <p className="text-text-muted">Le détail des données collectées et de leur usage se trouve sur la <a href="/confidentialite" className="text-primary font-semibold">politique de confidentialité</a>.</p>
      </div>
    </Section>
  );
}

function FAQ({ q, children }) {
  return (
    <div>
      <h3 className="font-semibold text-text">{q}</h3>
      <p className="text-sm text-text-muted mt-1 leading-relaxed">{children}</p>
    </div>
  );
}
