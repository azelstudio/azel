(() => {
  'use strict';
  const content = window.AZEL_CONTENT, api = window.AzelPilates;
  const params = new URLSearchParams(location.search), $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const PALETTES = {
    olive: { ink:'#273126',deep:'#171F18',paper:'#F0ECE3',bright:'#FBF8F2',muted:'#626459',accent:'#8B9273',line:'#C9C8BE',soft:'#E2E3D9' },
    ink: { ink:'#20272C',deep:'#11191E',paper:'#EBE9E6',bright:'#F7F5F1',muted:'#606668',accent:'#8199A1',line:'#C7C8C8',soft:'#DBE1E1' },
    terracotta: { ink:'#623D32',deep:'#39231E',paper:'#F4E9DD',bright:'#FBF7EF',muted:'#735D51',accent:'#C68D6E',line:'#D7C6B8',soft:'#F1DED0' },
    plum: { ink:'#453140',deep:'#281E27',paper:'#F2E9E6',bright:'#FCF7F3',muted:'#75606D',accent:'#BA929A',line:'#D5C7CA',soft:'#EADDE2' }
  };
  const hex = value => { const s = String(value || '').replace(/^#/, ''); return /^[a-f0-9]{6}$/i.test(s) ? '#' + s.toUpperCase() : ''; };
  const state = {
    name: api.clean(params.get('nom') || content.business.name, 62), city: api.clean(params.get('ville') || content.business.city, 48),
    ...api.normalize({style:params.get('style') || content.appearance.theme,year:params.get('annee') || content.business.year,booking:params.get('booking') || content.business.bookingUrl}), accent: hex(params.get('c')), heroUrl: '', logo: ''
  };
  let uploadVersion = 0, toastTimer;
  const setText = (selector, text) => $$(selector).forEach(el => { el.textContent = text; });
  const setInput = (selector, value) => { const el = $(selector); if (document.activeElement !== el) el.value = value; };
  const textAt = path => path.split('.').reduce((value, key) => value?.[key], content);
  const imagePath = value => typeof value === 'string' && /^assets\/[a-z0-9_.-]+\.webp$/i.test(value);
  function hydrateContent() {
    $$('[data-azel-text]').forEach(el => {
      const value = textAt(el.dataset.azelText), emphasis = textAt(el.dataset.azelText + 'Emphasis');
      if (typeof value !== 'string') return;
      if (typeof emphasis === 'string' && value.includes(emphasis)) {
        const index = value.indexOf(emphasis), em = document.createElement('em'); em.textContent = emphasis;
        el.replaceChildren(document.createTextNode(value.slice(0,index)), em, document.createTextNode(value.slice(index+emphasis.length)));
      } else el.textContent = value;
    });
    const title = content.hero.title, emphasis = content.hero.titleEmphasis;
    const h1 = $('[data-azel-id="hero.title"]');
    if (typeof title === 'string' && emphasis && title.includes(emphasis)) {
      const index = title.indexOf(emphasis), lead = document.createElement('span'), em = document.createElement('em');
      lead.textContent = title.slice(0, index); em.textContent = emphasis;
      const last = document.createElement('span'); last.className = 'hero-title-last'; last.textContent = title.slice(index + emphasis.length);
      h1.replaceChildren(lead, em, last);
    } else h1.textContent = title;
    (content.services || []).forEach(item => {
      const card = document.querySelector('[data-azel-id="services.' + item.id + '"]'); if (!card) return;
      card.querySelector('h3').textContent = item.title;
      card.querySelector('.course-content p').textContent = item.description;
      const image = card.querySelector('img'); if (imagePath(item.image)) image.src = item.image;
      image.alt = item.imageAlt || item.title;
    });
    Object.entries(content.gallery || {}).forEach(([key, src]) => { const image = $('[data-azel-id="gallery.' + key + '"]'); if (image && imagePath(src)) image.src = src; });
    const description = $('meta[name="description"]'); description.content = content.seo.description;
  }
  const rgb = value => value.slice(1).match(/../g).map(v=>parseInt(v,16));
  const luminance = value => rgb(value).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  const contrast = (a,b) => {const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
  const readable = (color,target,backgrounds) => {
    const start=rgb(color),end=rgb(target);
    for(let step=0;step<=20;step++){
      const mixed='#'+start.map((value,i)=>Math.round(value+(end[i]-value)*step/20).toString(16).padStart(2,'0')).join('');
      if(backgrounds.every(bg=>contrast(mixed,bg)>=4.5))return mixed;
    }
    return target;
  };
  function applyTheme() {
    const theme = PALETTES[state.style], accent=state.accent || theme.accent;
    document.documentElement.style.setProperty('--accent-on-paper',readable(accent,theme.ink,[theme.paper,theme.bright]));
    document.documentElement.style.setProperty('--accent-on-ink',readable(accent,theme.bright,[theme.ink,theme.deep]));
    document.documentElement.style.setProperty('--on-accent',contrast(accent,'#080808')>contrast(accent,'#FFFFFF')?'#080808':'#FFFFFF');
    Object.entries({ '--ink':theme.ink,'--ink-deep':theme.deep,'--paper':theme.paper,'--paper-bright':theme.bright,'--muted':theme.muted,'--accent':state.accent || theme.accent,'--line':theme.line,'--soft':theme.soft }).forEach(([key, value]) => document.documentElement.style.setProperty(key, value));
    $$('.palette-swatch').forEach(button => { const selected = button.dataset.palette === state.style; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
    $('#inputColor').value = state.accent || theme.accent;
    $('meta[name="theme-color"]').content = theme.ink;
  }
  function applyIdentity() {
    setText('[data-field="name"]', state.name || content.business.name);
    setText('[data-field="city"]', state.city || content.business.city);
    setText('[data-field="discipline"]', state.year ? 'Depuis ' + state.year + ' · Pilates classique' : 'Pilates classique');
    document.title = (state.name || content.business.name) + ' · Pilates classique à ' + (state.city || content.business.city) + ' | Concept Azel';
    const stamp = $('.hero-photo-label span:last-child'); if (stamp) stamp.textContent = state.city || content.business.city;
    setInput('#inputName', state.name); setInput('#inputCity', state.city); setInput('#inputYear', state.year); setInput('#inputBooking', state.booking);
    const og = $('meta[property="og:title"]'); if (og) og.content = document.title;
    const src = state.heroUrl || content.hero.image;
    if (state.heroUrl || imagePath(src)) $('#heroPicture').src = src;
    $('#heroPicture').alt = state.heroUrl ? 'Photo choisie pour votre aperçu local' : content.hero.imageAlt;
    $$('.brand-logo').forEach(image => { image.hidden = !state.logo; if (state.logo) image.src = state.logo; else image.removeAttribute('src'); });
    $('.brand-symbol').hidden = !!state.logo;
    $$('[data-booking]').forEach(link => {
      link.href = state.booking || '#contact';
      if (state.booking) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      else { link.removeAttribute('target'); link.removeAttribute('rel'); }
    });
    const look = new URLSearchParams();
    look.set('nom', state.name || content.business.name); look.set('ville', state.city || content.business.city);
    if (state.accent) look.set('c', state.accent.slice(1)); api.write(look, state);
    $$('.azel-request').forEach(link => { link.href = '../?' + look + '#pilates-classique'; });
  }
  function apply() { applyTheme(); applyIdentity(); }
  function syncQuery() {
    const query = new URLSearchParams(location.search);
    ['nom','ville','c','style','annee','booking'].forEach(key => query.delete(key));
    if (state.name) query.set('nom', state.name); if (state.city) query.set('ville', state.city);
    if (state.accent) query.set('c', state.accent.slice(1)); api.write(query, state);
    try { history.replaceState(null, '', location.pathname + '?' + query + location.hash); } catch { /* file:// peut refuser replaceState. */ }
  }
  function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4200); }
  const dialog = $('#customizer'), toggle = $('#customizerToggle');
  const closeCustomize = () => { if (dialog.open) dialog.close(); };
  toggle.addEventListener('click', () => { dialog.showModal(); document.body.classList.add('customizing'); toggle.setAttribute('aria-expanded', 'true'); });
  $('#closeCustomizer').addEventListener('click', closeCustomize);
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled)')].filter(el => el.getClientRects().length && !el.hidden);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) closeCustomize();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('customizing'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus({ preventScroll: true }); });
  ['Name','City'].forEach((key, index) => $('#input' + key).addEventListener('input', event => { state[index ? 'city' : 'name'] = api.clean(event.target.value, index ? 48 : 62); applyIdentity(); syncQuery(); }));
  $('#inputYear').addEventListener('input', event => { state.year = api.year(event.target.value); applyIdentity(); syncQuery(); });
  $$('.palette-swatch').forEach(button => button.addEventListener('click', () => { state.style = button.dataset.palette; state.accent = ''; apply(); syncQuery(); }));
  $('#inputColor').addEventListener('input', event => { state.accent = hex(event.target.value); apply(); syncQuery(); });
  $('#inputBooking').addEventListener('input', event => {
    const value = event.target.value.trim(), normalized = api.bookingUrl(value), invalid = !!value && !normalized;
    event.target.setCustomValidity(invalid ? 'Saisissez une adresse HTTP ou HTTPS sans identifiants.' : '');
    event.target.setAttribute('aria-invalid', String(invalid));
    $('#bookingError').textContent = invalid ? 'Adresse de réservation invalide.' : '';
    if (invalid) return;
    state.booking = normalized; applyIdentity(); syncQuery();
  });
  $('#inputHeroPhoto').addEventListener('change', async event => {
    const file = event.target.files?.[0], version = ++uploadVersion; if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 12 * 1024 * 1024) { toast('Choisissez une image JPEG, PNG ou WebP de moins de 12 Mo.'); event.target.value = ''; return; }
    const url = URL.createObjectURL(file), image = new Image(); image.src = url;
    try { await image.decode(); } catch { URL.revokeObjectURL(url); toast('Cette image ne peut pas être ouverte.'); event.target.value = ''; return; }
    if (version !== uploadVersion) { URL.revokeObjectURL(url); return; }
    if (state.heroUrl) URL.revokeObjectURL(state.heroUrl); state.heroUrl = url; applyIdentity();
    toast('Photo visible sur cet appareil uniquement. Le lien partagé conserve l’image du modèle.');
  });
  $('#resetDemo').addEventListener('click', () => {
    ++uploadVersion; if (state.heroUrl) URL.revokeObjectURL(state.heroUrl);
    Object.assign(state, {name:content.business.name,city:content.business.city,...api.normalize({style:content.appearance.theme,year:content.business.year,booking:content.business.bookingUrl}),accent:'',heroUrl:'',logo:''});
    $('#inputHeroPhoto').value = ''; $('#inputBooking').setCustomValidity(''); $('#inputBooking').setAttribute('aria-invalid','false'); $('#bookingError').textContent = '';
    apply(); syncQuery(); toast('Modèle initial restauré.');
  });
  $('#copyLink').addEventListener('click', async () => {
    if (!$('#inputBooking').reportValidity()) return;
    if (location.protocol === 'file:') { toast('Hébergez cet aperçu pour partager un lien.'); return; }
    syncQuery();
    try { await navigator.clipboard.writeText(location.href); toast(state.heroUrl || state.logo ? 'Lien copié. La photo et le logo locaux ne sont pas inclus.' : 'Lien personnalisé copié.'); }
    catch { $('#shareFallback').hidden = false; $('#shareFallback').value = location.href; $('#shareFallback').focus(); $('#shareFallback').select(); }
  });
  $$('[data-booking]').forEach(link => link.addEventListener('click', event => {
    if (state.booking) return;
    event.preventDefault(); $('#bookingNote').hidden = false;
    $('#contact').scrollIntoView({ behavior: motion.matches ? 'auto' : 'smooth', block:'start' });
  }));
  const burger = $('#mobileMenu'), nav = $('#mainNav');
  const closeMenu = () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded','false'); burger.setAttribute('aria-label','Ouvrir le menu'); };
  burger.addEventListener('click', () => { const open = !nav.classList.contains('open'); nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu'); });
  $$('.nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); burger.focus(); } });
  document.addEventListener('click', event => { if (!nav.contains(event.target) && !burger.contains(event.target)) closeMenu(); });
  matchMedia('(min-width:1101px)').addEventListener('change', event => { if(event.matches)closeMenu(); });
  if (params.has('capture')) document.documentElement.classList.add('capture');
  if (params.get('embed') === '1') document.documentElement.classList.add('embedded');
  document.documentElement.classList.add('has-pilates-js');
  if ('IntersectionObserver' in window && !motion.matches) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), {threshold:.07});
    $$('.reveal').forEach(el => observer.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('in-view'));
  addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== parent || !event.data || typeof event.data !== 'object') return;
    const data = event.data;
    if (data.azel === 'name') state.name = api.clean(data.value,62) || content.business.name;
    else if (data.azel === 'city') state.city = api.clean(data.value,48) || content.business.city;
    else if (data.azel === 'color') state.accent = hex(data.hex);
    else if (data.azel === 'logo') state.logo = typeof data.src === 'string' && data.src.length < 1600000 && /^data:image\/(png|jpeg|svg\+xml|webp);base64,/i.test(data.src) ? data.src : '';
    else if (data.azel === 'pilates') Object.assign(state, api.normalize(data.value));
    else return;
    apply();
  });
  hydrateContent(); apply();
})();
