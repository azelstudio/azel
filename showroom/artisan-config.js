/* Champs partagés entre le configurateur, l’aperçu artisan et la demande. */
(() => {
  const fields = [
    { key: 'tagline', param: 'a_accroche', label: 'Accroche', max: 80, placeholder: 'Des travaux soignés, du début à la fin' },
    ...[1, 2, 3, 4].map((n) => ({ key: 'service' + n, param: 'a_service' + n, label: 'Prestation ' + n, max: 40, placeholder: ['Rénovation intérieure', 'Gros œuvre', 'Aménagement', 'Finitions'][n - 1] })),
    { key: 'phone', param: 'a_tel', label: 'Téléphone', max: 30, type: 'tel', placeholder: 'Votre numéro professionnel' },
    { key: 'email', param: 'a_email', label: 'E-mail', max: 120, type: 'email', placeholder: 'contact@votre-entreprise.fr' }
  ];
  const clean = (value, max) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, max) : '';
  const normalize = (data = {}) => Object.fromEntries(fields.map((f) => [f.key, clean(data?.[f.key], f.max)]));
  const read = (params) => normalize(Object.fromEntries(fields.map((f) => [f.key, params.get(f.param)])));
  const write = (params, data) => fields.forEach((f) => { const v = normalize(data)[f.key]; if (v) params.set(f.param, v); });
  window.AzelArtisan = { fields, clean, normalize, read, write };
})();
