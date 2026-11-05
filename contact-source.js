/* Provenance déclarative d’une demande, sans cookie ni identifiant visiteur.
 * Seul le code public page-artisan est accepté. Aucune URL complète, texte
 * personnalisé ou information de navigation n’est collecté.
 */
(() => {
  const form = document.getElementById('ctForm');
  if (!form) return;
  const source = new URLSearchParams(location.search).get('origine');
  if (source !== 'page-artisan') return;
  form.addEventListener('formdata', (event) => {
    event.formData.set('Origine de la demande', 'Page site internet artisan');
  });
})();
