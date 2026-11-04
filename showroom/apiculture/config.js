(() => {
  const fields = [
    { key: 'headline', param: 'b_titre', label: 'Accroche', max: 70, placeholder: 'Le goût du vivant.' },
    { key: 'pickup', param: 'b_retrait', label: 'Message de retrait', max: 100, placeholder: 'Retrait au rucher, sur rendez-vous.' },
    { key: 'featured', param: 'b_miel', label: 'Miel à découvrir', type: 'select', options: [['printemps', 'Fleurs de printemps'], ['acacia', 'Acacia'], ['foret', 'Forêt']] },
    { key: 'label', param: 'b_etiquette', label: 'Style d’étiquette', type: 'select', options: [['maison', 'Signature maison'], ['epuree', 'Signature épurée']] },
    { key: 'format', param: 'b_format', label: 'Format proposé', type: 'select', options: [['250', '250 g'], ['500', '500 g']] }
  ];
  const clean = (v, max) => typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, max) : '';
  const normalize = (data = {}) => Object.fromEntries(fields.map(f => [f.key, f.type === 'select' ? (f.options.some(o => o[0] === data?.[f.key]) ? data[f.key] : '') : clean(data?.[f.key], f.max)]));
  const read = params => normalize(Object.fromEntries(fields.map(f => [f.key, params.get(f.param)])));
  const write = (params, data) => { const values = normalize(data); fields.forEach(f => { if (values[f.key]) params.set(f.param, values[f.key]); }); };
  window.AzelApiculture = { fields, normalize, read, write, clean };
})();
