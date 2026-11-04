/* Cloudflare Web Analytics — identifiant public fourni par le tableau de bord.
 * Renseigner uniquement le token du beacon, jamais une clé API Cloudflare.
 * Laisser vide si l'injection automatique Cloudflare est déjà activée.
 */
(() => {
  const TOKEN = 'a5462cb69b5441fe83e09e22f0754752';
  // Les aperçus intégrés au showroom ne sont pas des visites supplémentaires.
  if (!/^[a-f0-9]{32}$/i.test(TOKEN) || window.self !== window.top ||
      document.querySelector('script[data-cf-beacon]')) return;
  const script = document.createElement('script');
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.defer = true;
  script.setAttribute('data-cf-beacon', JSON.stringify({ token: TOKEN }));
  document.head.appendChild(script);
})();
