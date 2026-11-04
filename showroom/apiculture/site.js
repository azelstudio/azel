(() => {
  'use strict';
  const $ = (s, scope = document) => scope.querySelector(s);
  const money = cents => new Intl.NumberFormat('fr-FR', {style:'currency',currency:'EUR'}).format(cents/100);
  const HONEY = {
    printemps: {name:'Fleurs de printemps',prices:{250:650,500:1150},advice:'Le miel de fleurs de printemps : une saveur florale et généreuse, parfaite sur une tartine.'},
    acacia: {name:'Acacia',prices:{250:750,500:1350},advice:'L’acacia : une saveur douce et délicate pour commencer votre découverte.'},
    foret: {name:'Forêt',prices:{250:700,500:1250},advice:'Le miel de forêt : une saveur plus soutenue pour les amateurs de caractère.'}
  };
  // Fit the entire label stack, so live long names never collide with the variety.
  const potNames = [...document.querySelectorAll('.pot-name')];
  let labelFrame = 0;
  function fitPotLabels() {
    labelFrame = 0;
    for (const name of potNames) {
      const label = name.closest('.pot-label');
      if (!label.clientHeight) continue;
      name.style.fontSize = '';
      let size = parseFloat(getComputedStyle(name).fontSize);
      const caption = label.querySelector('.pot-caption'), variety = label.querySelector('.pot-variety');
      const style = getComputedStyle(label), gap = parseFloat(style.gap) || 0;
      const hasCaption = getComputedStyle(caption).display !== 'none';
      const available = label.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - variety.offsetHeight - (hasCaption ? caption.offsetHeight + gap * 2 : gap);
      while (name.offsetHeight > available && size > 5) {
        size -= .5;
        name.style.fontSize = size + 'px';
      }
    }
  }
  const scheduleLabels = () => { if (!labelFrame) labelFrame = requestAnimationFrame(fitPotLabels); };
  const potResize = new ResizeObserver(scheduleLabels);
  document.querySelectorAll('.pot').forEach(pot => potResize.observe(pot));
  const nameChanges = new MutationObserver(scheduleLabels);
  potNames.forEach(name => nameChanges.observe(name,{childList:true,characterData:true,subtree:true}));
  document.fonts.ready.then(scheduleLabels);
  scheduleLabels();
  const posterBrand=$('.poster-brand');
  function fitPosterBrand(){
    if(!posterBrand.clientWidth)return;
    posterBrand.style.fontSize='';
    let size=parseFloat(getComputedStyle(posterBrand).fontSize);
    while(posterBrand.scrollWidth>posterBrand.clientWidth+1&&size>1){size=Math.max(1,size-2);posterBrand.style.fontSize=size+'px';}
  }
  const posterNames=new MutationObserver(fitPosterBrand);posterNames.observe(posterBrand,{childList:true,characterData:true,subtree:true});
  new ResizeObserver(fitPosterBrand).observe($('.poster-field'));
  document.fonts.ready.then(fitPosterBrand);fitPosterBrand();
  const cart = new Map();
  const bounded = (value, max = 12) => Math.max(1, Math.min(max, Math.floor(Number(value) || 1)));
  const choice = name => $(`input[name="${name}"]:checked`).value;
  const quantity = $('#quantity');
  const setQuantity = value => { quantity.value = bounded(value); $('#less').disabled = Number(quantity.value) <= 1; $('#more').disabled = Number(quantity.value) >= 12; refreshPrice(); };
  const CHARACTERS = {
    printemps: {headline:'Floral.\nGénéreux.\nTout simplement.',description:'Le miel de fleurs de printemps, pour les tartines du matin et les petits plaisirs de tous les jours.',profile:'Une note florale',pairing:'Sur une tartine'},
    acacia: {headline:'La douceur,\ntout en\ndélicatesse.',description:'Le miel d’acacia, une saveur douce et discrète à apprécier à la cuillère ou pour accompagner un fromage blanc.',profile:'Une note délicate',pairing:'Avec un fromage blanc'},
    foret: {headline:'Un miel ambré.\nDu caractère.\nDe la profondeur.',description:'Le miel de forêt, une saveur plus soutenue pour les palais curieux et les associations gourmandes.',profile:'Une note plus intense',pairing:'Avec un fromage affiné'}
  };
  let presentedHoney = null;
  function refreshPrice() {
    const id=choice('honey'),honey=HONEY[id],character=CHARACTERS[id];
    $('#add-price').textContent = money(honey.prices[choice('weight')] * bounded(quantity.value));
    $('#chosen-honey').textContent=honey.name;$('#honey-character').textContent=character.headline;$('#honey-description').textContent=character.description;$('#honey-profile').textContent=character.profile;$('#honey-pairing').textContent=character.pairing;
    $('.hero-pot').dataset.honey=id;$('.hero-pot .pot-variety').textContent=honey.name;
    document.querySelectorAll('[data-hero-honey]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.heroHoney===id)));
    document.querySelectorAll('.collection-item').forEach(item=>{item.querySelector('.collection-action').firstChild.textContent=item.dataset.collection===id?'Choisi ':'Choisir ';});
    if (presentedHoney !== id) {
      const collection=$('.collection-rail'),item=$(`[data-collection="${id}"]`);
      collection.scrollTo({left:item.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      presentedHoney=id;
    }
    scheduleLabels();
  }
  const honeyIds=['printemps','acacia','foret'];
  function stepHoney(step){const index=honeyIds.indexOf(choice('honey')),next=honeyIds[(index+step+honeyIds.length)%honeyIds.length];$(`input[name="honey"][value="${next}"]`).checked=true;refreshPrice();}
  $('#collection-prev').addEventListener('click',()=>stepHoney(-1));$('#collection-next').addEventListener('click',()=>stepHoney(1));
  document.querySelectorAll('[data-hero-honey]').forEach(button=>button.addEventListener('click',()=>{$(`input[name="honey"][value="${button.dataset.heroHoney}"]`).checked=true;refreshPrice();$('#add-status').textContent='';}));
  const selection = () => [...cart.values()];
  const count = () => selection().reduce((a,x) => a+x.quantity,0);
  const total = () => selection().reduce((a,x) => a+HONEY[x.honey].prices[x.weight]*x.quantity,0);
  function resetPrepared() { $('#request-output').hidden = true; $('#request-status').textContent = ''; $('#copy-status').textContent = ''; }
  function renderCart() {
    const list=$('#order-lines'); list.replaceChildren();
    if (!cart.size) { const p=document.createElement('p');p.className='empty';p.textContent='Votre sélection attend ses premiers pots.';list.append(p); }
    for (const [key,item] of cart) {
      const row=document.createElement('div');row.className='order-line';
      const description=document.createElement('div');const title=document.createElement('strong');title.textContent=HONEY[item.honey].name;
      const detail=document.createElement('p');detail.textContent=`${item.quantity} pot${item.quantity>1?'s':''} de ${item.weight} g`;
      const remove=document.createElement('button');remove.type='button';remove.className='remove-line';remove.textContent='Retirer';remove.setAttribute('aria-label',`Retirer ${HONEY[item.honey].name}, ${item.weight} g`);
      remove.addEventListener('click',()=>{cart.delete(key);renderCart();});description.append(title,detail,remove);
      const price=document.createElement('span');price.className='line-price';price.textContent=money(HONEY[item.honey].prices[item.weight]*item.quantity);row.append(description,price);list.append(row);
    }
    $('#basket-count').textContent=count();$('.basket-link').setAttribute('aria-label',`Votre sélection, ${count()} pot${count()>1?'s':''}`);
    $('#total').textContent=money(total());$('#clear').disabled=!cart.size;$('#request-fields').disabled=!cart.size;$('#request-fields').hidden=!cart.size;$('#request-empty').hidden=!!cart.size;$('#review-selection').hidden=!cart.size;$('#review-selection').textContent=`Voir ma sélection (${count()})`;resetPrepared();
  }
  $('#add').disabled=false;
  $('#add').addEventListener('click',()=>{
    const honey=choice('honey'),weight=choice('weight'),key=honey+'-'+weight,n=bounded(quantity.value),old=cart.get(key)?.quantity||0;
    cart.set(key,{honey,weight,quantity:Math.min(24,old+n)});renderCart();
    $('#add-status').textContent=`${HONEY[honey].name}, ${weight} g : ${cart.get(key).quantity} pot${cart.get(key).quantity>1?'s':''} dans votre sélection.`;
  });
  $('#less').addEventListener('click',()=>setQuantity(Number(quantity.value)-1));$('#more').addEventListener('click',()=>setQuantity(Number(quantity.value)+1));quantity.addEventListener('input',refreshPrice);quantity.addEventListener('change',()=>setQuantity(quantity.value));
  document.querySelectorAll('input[name="honey"],input[name="weight"]').forEach(i=>i.addEventListener('change',()=>{refreshPrice();$('#add-status').textContent='';}));
  $('#clear').addEventListener('click',()=>{cart.clear();renderCart();$('#add-status').textContent='Votre sélection a été vidée.';});
  document.querySelectorAll('[data-taste]').forEach(button=>button.addEventListener('click',()=>{
    const id=button.dataset.taste;document.querySelectorAll('[data-taste]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    $(`input[name="honey"][value="${id}"]`).checked=true;refreshPrice();$('#taste-result').textContent=HONEY[id].advice;$('#taste-link').firstChild.textContent=`Découvrir ${HONEY[id].name.toLowerCase()} `;
  }));
  const fieldError = (input, message) => { input.setAttribute('aria-invalid',String(!!message));$('#'+input.id+'-error').textContent=message; };
  for(const id of ['buyer-name','buyer-email']) $('#'+id).addEventListener('input',()=>fieldError($('#'+id),''));
  $('#pickup-form').addEventListener('input',resetPrepared);
  $('#pickup-form').addEventListener('submit',event=>{
    event.preventDefault();if(!cart.size)return;
    const name=$('#buyer-name'),email=$('#buyer-email');
    fieldError(name,name.value.trim()?'':'Indiquez votre nom.');fieldError(email,email.validity.valid&&email.value.trim()?'':'Indiquez une adresse e-mail valide.');
    if(name.getAttribute('aria-invalid')==='true'||email.getAttribute('aria-invalid')==='true'){(name.getAttribute('aria-invalid')==='true'?name:email).focus();return;}
    const lines=selection().map(item=>`${item.quantity} × ${HONEY[item.honey].name} ${item.weight} g : ${money(HONEY[item.honey].prices[item.weight]*item.quantity)}`);
    $('#request-summary').value=[`Demande de retrait — ${$('.pot-name').textContent.trim()}`,...lines,`Total indicatif : ${money(total())}`,`Nom : ${name.value.trim()}`,`E-mail : ${email.value.trim()}`,`Période : ${$('#period').value}`,...($('#buyer-note').value.trim()?[`Message : ${$('#buyer-note').value.trim()}`]:[])].join('\n');
    $('#request-output').hidden=false;$('#request-status').textContent='Votre demande est prête à copier. Démonstration : aucun message n’a été envoyé et aucun retrait n’est confirmé.';
  });
  $('#copy-summary').addEventListener('click',async()=>{
    try { await navigator.clipboard.writeText($('#request-summary').value);$('#copy-status').textContent='Récapitulatif copié.'; }
    catch { $('#request-summary').focus();$('#request-summary').select();$('#copy-status').textContent='Sélectionnez puis copiez le récapitulatif ci-dessus.'; }
  });
  // Additional showroom settings are shared by the iframe, full-screen link and request.
  const defaultHeadline=$('#hero-title').innerHTML,defaultPickup=$('[data-bee="pickup"]').textContent;
  let lastConfig=null;
  function applyConfig(raw) {
    const config=AzelApiculture.normalize(raw);
    if(config.headline){$('#hero-title').textContent=config.headline;$('#hero-title').dataset.custom='';}
    else{$('#hero-title').innerHTML=defaultHeadline;$('#hero-title').removeAttribute('data-custom');}
    $('[data-bee="pickup"]').textContent=config.pickup||defaultPickup;
    document.body.dataset.labelStyle=config.label||'maison';
    scheduleLabels();
    if(!lastConfig||config.featured!==lastConfig.featured)$(`input[name="honey"][value="${config.featured||'printemps'}"]`).checked=true;
    if(!lastConfig||config.format!==lastConfig.format)$(`input[name="weight"][value="${config.format||'250'}"]`).checked=true;
    lastConfig=config;
    refreshPrice();
  }
  addEventListener('message',event=>{if(event.source===parent&&event.origin===location.origin&&event.data?.azel==='apiculture')applyConfig(event.data.value);});
  applyConfig(AzelApiculture.read(new URLSearchParams(location.search)));setQuantity(1);renderCart();
})();
