/* Démonstration de l'assistant Azel. Aucune IA, aucune API, aucun envoi : des scénarios écrits à l'avance
   et une reconnaissance simple d'intentions par mots-clés, avec des réponses de secours honnêtes. */
(() => {
  const dlg = document.getElementById('azaChat'), openBtn = document.getElementById('azaBtn');
  if (!dlg || !dlg.showModal) { if (openBtn) openBtn.hidden = true; return; }
  const log = document.getElementById('azcLog'), sugg = document.getElementById('azcSugg'), form = document.getElementById('azcForm'), input = document.getElementById('azcIn');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer: fine)').matches;
  let busy = false, flow = null, started = false;

  const scroll = () => { log.scrollTo({ top: log.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }); };
  const add = (cls, html) => { const m = document.createElement('div'); m.className = 'azc-m ' + cls; if (cls === 'me') m.textContent = html; else m.innerHTML = html; log.append(m); scroll(); return m; };
  const chips = (list) => { sugg.replaceChildren(); list.forEach((t, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'azc-chip'; b.textContent = t; b.style.animationDelay = i * 60 + 'ms'; b.addEventListener('click', () => send(t)); sugg.append(b); }); requestAnimationFrame(scroll); };
  const say = (msgs, next) => new Promise((res) => {
    busy = true; sugg.replaceChildren(); let k = 0;
    const step = () => {
      if (k >= msgs.length) { busy = false; if (next) chips(next); res(); return; }
      const t = reduce ? null : add('bot typing', '<span></span><span></span><span></span>');
      setTimeout(() => { if (t) t.remove(); const m = msgs[k++]; add(m.startsWith('§') ? 'note' : 'bot', m.replace(/^§/, '')); step(); }, reduce ? 0 : Math.min(1100, 420 + msgs[k].length * 6));
    };
    step();
  });

  /* Jours ouvrés à venir, pour le scénario rendez-vous */
  const nextDays = () => { const out = [], d = new Date(); while (out.length < 3) { d.setDate(d.getDate() + 1); if (d.getDay() > 0 && d.getDay() < 6) out.push(d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })); } return out; };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const START = ['Quels sont vos horaires ?', 'Je souhaite un devis', 'Je veux prendre rendez-vous'];
  const END = ['Je souhaite un devis', 'Je veux prendre rendez-vous', 'Comment ça marche ?'];

  /* Intentions : mots-clés simples, sans accents */
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const INTENTS = [
    ['perso', /@|\b0[1-9](?:[ .-]?\d{2}){4}\b|\+33/],
    ['horaires', /horaire|ouvert|ferme|heure|quand.*(ouvr|dispo)|week.?end|samedi|dimanche/],
    ['devis', /devis|prix|tarif|cout|combien|budget/],
    ['rdv', /rendez|rdv|reserv|creneau|rencontr|appel|visio/],
    ['ia', /\bia\b|intelligence|robot|chatgpt|vrai|humain|qui es.tu|t.es qui|comment ca marche|fonctionne/],
    ['bonjour', /^(bonjour|salut|hello|coucou|bonsoir|hey)\b/],
    ['merci', /merci|super|parfait|top|genial|ok\b|d.accord/],
  ];
  const intent = (t) => { const n = norm(t); const hit = INTENTS.find(([, r]) => r.test(n)); return hit ? hit[0] : null; };

  const R = {
    horaires: () => say(['Ici, c\'est un exemple : l’entreprise est ouverte du lundi au vendredi, de 9h à 18h, et le samedi de 10h à 13h.', 'Sur votre site, je répondrais avec vos vrais horaires, vos jours fériés et vos fermetures exceptionnelles.'], ['Et le dimanche ?', 'Je veux prendre rendez-vous', 'Je souhaite un devis']),
    dimanche: () => say(['Le dimanche, c\'est fermé dans cet exemple. Je peux quand même noter une demande, et un interlocuteur vous répond dès le lundi.'], END),
    devis: () => { flow = { k: 'devis', s: 1 }; return say(['Avec plaisir. Quel type de projet avez-vous en tête ?'], ['Un site vitrine', 'Un site avec réservation', 'Je ne sais pas encore']); },
    rdv: () => { flow = { k: 'rdv', s: 1 }; const d = nextDays(); return say(['Bien sûr. Quel jour vous arrangerait ?'], d.map(cap)); },
    ia: () => say(['Bonne question : ici, je suis une démonstration. Mes réponses sont écrites à l\'avance et je reconnais quelques mots-clés, sans intelligence artificielle derrière.', 'Sur votre site, l\'assistant serait configuré avec vos informations, et il passerait la main à un humain dès qu\'il ne sait pas.'], END),
    bonjour: () => say(['Bonjour ! Je peux vous donner les horaires, préparer une demande de devis ou proposer un rendez-vous.'], START),
    merci: () => say(['Avec plaisir. Autre chose ?'], END),
    perso: () => say(['Inutile de me donner vos coordonnées : c\'est une démonstration, rien n\'est enregistré ni transmis.'], END),
    fallback: () => say(['Je suis une démonstration avec des réponses prévues à l\'avance, je ne comprends pas encore tout.', 'Essayez une de ces questions :'], START),
  };

  const FLOWS = {
    devis: (t) => {
      if (flow.s === 1) { flow.type = t; flow.s = 2; return say(['Noté. Et pour quand l\'imaginez-vous ?'], ['Dès que possible', 'Dans 1 à 3 mois', 'Pas pressé']); }
      flow = null;
      return say(['Merci ! Voici le résumé que je transmettrais au responsable : <b>' + esc(this_type) + '</b>, délai <b>' + esc(t.toLowerCase()) + '</b>.', 'Sur un vrai site, je demanderais ensuite vos coordonnées pour vous recontacter.', '§Démonstration : aucune demande n\'a été envoyée.'], END);
    },
    rdv: (t) => {
      if (flow.s === 1) { flow.day = t; flow.s = 2; return say([t + ', parfait. Quel créneau ?'], ['10h00', '14h30', '17h00']); }
      const day = flow.day; flow = null;
      return say(['C\'est noté : <b>' + esc(day.toLowerCase()) + ' à ' + esc(t) + '</b>.', 'Sur votre site, le créneau serait bloqué dans votre agenda et le client recevrait une confirmation.', '§Démonstration : aucun rendez-vous n\'a été réservé.'], END);
    },
  };
  let this_type = '';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function send(text) {
    text = String(text || '').trim(); if (!text || busy) return;
    add('me', text); input.value = '';
    const n = norm(text);
    if (/dimanche/.test(n)) return R.dimanche();
    if (flow) {
      const other = intent(text);
      if (other && other !== flow.k && other !== 'merci' && other !== 'bonjour') { flow = null; return R[other](); }
      if (flow.k === 'devis' && flow.s === 1) this_type = text.toLowerCase();
      return FLOWS[flow.k](text);
    }
    const i = intent(text); return (R[i] || R.fallback)();
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); send(input.value); });

  /* Ouverture et fermeture : croix, Échap, clic sur le fond ; défilement de la page bloqué, focus rendu au bouton */
  const open = () => {
    document.documentElement.classList.add('azc-lock'); dlg.classList.remove('closing'); dlg.showModal();
    if (!started) { started = true; say(['Bonjour ! 👋 Je suis l\'assistant de démonstration Azel. Que puis-je faire pour vous ?'], START); }
    (fine ? input : document.getElementById('azcClose')).focus({ preventScroll: true });
  };
  const close = (after) => {
    if (!dlg.open) return;
    const done = () => { dlg.classList.remove('closing'); dlg.close(); document.documentElement.classList.remove('azc-lock'); if (after) after(); else openBtn.focus({ preventScroll: true }); };
    if (reduce) return done(); dlg.classList.add('closing'); setTimeout(done, 200);
  };
  openBtn.addEventListener('click', open);
  document.getElementById('azcClose').addEventListener('click', () => close());
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
})();
