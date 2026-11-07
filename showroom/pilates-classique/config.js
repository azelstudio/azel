/* Contrat partagé entre la démo Pilates et le showroom Azel. */
(() => {
  const clean = (value, max) => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, max) : '';
  const palettes = ['olive', 'ink', 'terracotta', 'plum'];
  const bookingUrl = value => {
    const text = clean(value, 1800);
    if (!text) return '';
    try { const url = new URL(text); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : ''; } catch { return ''; }
  };
  const year = value => { const text = clean(value, 4); return /^(18|19|20)\d{2}$/.test(text) && Number(text) <= new Date().getFullYear() ? text : ''; };
  const fields = [
    { key: 'style', param: 'style', label: 'Ambiance du studio', type: 'select', options: [['olive', 'Olive et ivoire'], ['ink', 'Encre et craie'], ['terracotta', 'Terre et crème'], ['plum', 'Prune et rose']] },
    { key: 'year', param: 'annee', label: 'Année de création', max: 4, placeholder: 'Facultatif', inputmode: 'numeric' },
    { key: 'booking', param: 'booking', label: 'Lien de réservation existant', max: 1800, placeholder: 'https://…', type: 'url' }
  ];
  const normalize = (data = {}) => ({ style: palettes.includes(data.style) ? data.style : 'olive', year: year(data.year), booking: bookingUrl(data.booking) });
  const read = params => normalize(Object.fromEntries(fields.map(field => [field.key, params.get(field.param)])));
  const write = (params, data) => { const values = normalize(data); fields.forEach(field => { if (values[field.key]) params.set(field.param, values[field.key]); }); };
  window.AzelPilates = { clean, fields, normalize, read, write, bookingUrl, year, accents:{olive:'8B9273',ink:'8199A1',terracotta:'C68D6E',plum:'BA929A'} };
})();
