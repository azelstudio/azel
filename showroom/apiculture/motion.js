/* Aube: printed packaging, changing harvests and restrained photographic depth. */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)');
  const field = $('.poster-field'), wordmark = $('.poster-brand');
  const jar = $('.poster-jar'), livePot = $('.hero-pot');
  const story = $('.story-landscape');
  const ease = getComputedStyle(root).getPropertyValue('--motion-ease').trim() || 'cubic-bezier(.16,1,.3,1)';
  const running = new Set(), byElement = new WeakMap();
  let ghost = null, frame = 0, entered = false, fontsReady = false;
  let heroVisible = false, storyVisible = false;
  let pointerX = 0, pointerY = 0, pointerRoll = 0, addedTimer = 0;
  const canMove = () => !reduced.matches && !document.hidden;
  const visible = element => {
    if (!element || !element.getClientRects().length) return false;
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight;
  };

  function animate(element, keyframes, options = {}) {
    if (!canMove() || !visible(element) || !element.animate) return null;
    byElement.get(element)?.cancel();
    const animation = element.animate(keyframes, {duration:240,easing:ease,fill:'backwards',...options});
    running.add(animation); byElement.set(element,animation);
    const done = () => {
      running.delete(animation);
      if (byElement.get(element) === animation) byElement.delete(element);
    };
    animation.finished.then(done,done);
    return animation;
  }

  function printLabel(label, delay = 0) {
    animate(label, [
      {clipPath:'inset(0 0 100% 0)',opacity:.4},
      {clipPath:'inset(0 0 0% 0)',opacity:1}
    ], {duration:420,delay});
  }

  function enter() {
    if (entered || !fontsReady || !heroVisible || !canMove()) return;
    entered = true;
    animate(wordmark,[
      {clipPath:'inset(100% 0 0 0)'},
      {clipPath:'inset(0% 0 0 0)'}
    ],{duration:720});
    animate(livePot,[
      {transform:'translate3d(0,20px,0) rotate(-1deg)',opacity:.55},
      {transform:'translate3d(0,0,0) rotate(-6deg)',opacity:1}
    ],{duration:700,delay:70});
    printLabel($('.hero-pot .pot-label'),210);
    animate($('.poster-caption'),[
      {transform:'translate3d(0,8px,0)',opacity:.6},
      {transform:'translate3d(0,0,0)',opacity:1}
    ],{duration:420,delay:170});
  }

  function clearGhost() {
    if (!ghost) return;
    byElement.get(ghost)?.cancel();
    ghost.remove(); ghost = null;
  }

  function swapHoney(update) {
    entered = true;
    clearGhost();
    byElement.get(livePot)?.cancel();
    if (!canMove() || !visible(livePot) || !livePot.animate) { update(); return; }
    const previous = livePot.cloneNode(true);
    previous.dataset.motionGhost = '';
    previous.style.cssText = `position:absolute;left:${livePot.offsetLeft}px;top:${livePot.offsetTop}px;width:${livePot.offsetWidth}px;pointer-events:none;`;
    jar.append(previous); ghost = previous;
    update();
    const exit = animate(previous,[
      {transform:'translate3d(0,0,0) rotate(-6deg)',opacity:1},
      {transform:'translate3d(-30px,6px,0) rotate(-11deg)',opacity:0}
    ],{duration:230});
    const discard = () => { previous.remove(); if (ghost === previous) ghost = null; };
    if (exit) exit.finished.then(discard,discard); else discard();
    animate(livePot,[
      {transform:'translate3d(28px,-4px,0) rotate(-1deg)',opacity:0},
      {transform:'translate3d(0,0,0) rotate(-6deg)',opacity:1}
    ],{duration:460});
    printLabel($('.hero-pot .pot-label'),100);
    animate($('.counter-taste'),[
      {opacity:.45,transform:'translate3d(0,7px,0)'},
      {opacity:1,transform:'translate3d(0,0,0)'}
    ],{duration:300});
    animate($('.poster-detail'),[{opacity:.3},{opacity:1}],{duration:250});
  }

  // Only a genuinely changed name reprints. Other showroom messages stay quiet.
  const rememberedNames = new WeakMap();
  const nameNodes = [...document.querySelectorAll('.pot-name'),wordmark];
  nameNodes.forEach(node => rememberedNames.set(node,node.textContent));
  const names = new MutationObserver(() => {
    let index = 0;
    for (const node of nameNodes) {
      if (rememberedNames.get(node) === node.textContent) continue;
      rememberedNames.set(node,node.textContent);
      if (node === wordmark) printLabel(node);
      else printLabel(node.closest('.pot-label'),Math.min(index++ * 35,105));
    }
  });
  nameNodes.forEach(node => names.observe(node,{childList:true,characterData:true,subtree:true}));

  function resetAdded() {
    clearTimeout(addedTimer);
    $('#add').removeAttribute('data-added');
    $('.add-words').textContent='Ajouter à ma sélection';
  }

  function added() {
    resetAdded();
    $('#add').dataset.added='true';
    $('.add-words').textContent='C’est ajouté';
    animate($('#add'),[{transform:'scale(.985)'},{transform:'scale(1)'}],{duration:220});
    animate($('#basket-count'),[{transform:'scale(.8)'},{transform:'scale(1.12)',offset:.55},{transform:'scale(1)'}],{duration:260});
    addedTimer=setTimeout(resetAdded,1250);
  }

  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  function paint() {
    frame=0;
    if (!canMove()) return;
    if (heroVisible) {
      const rect=field.getBoundingClientRect();
      const progress=clamp(-rect.top / Math.max(rect.height,1),0,1);
      field.style.setProperty('--word-drift',`${-24 * progress}px`);
      field.style.setProperty('--jar-drift',`${12 * progress}px`);
      field.style.setProperty('--pointer-x',`${pointerX}px`);
      field.style.setProperty('--pointer-y',`${pointerY}px`);
      field.style.setProperty('--pointer-roll',`${pointerRoll}deg`);
    }
    if (storyVisible) {
      const rect=story.getBoundingClientRect();
      const progress=clamp((innerHeight-rect.top)/(innerHeight+rect.height),0,1);
      story.style.setProperty('--story-shift',`${(progress-.5)*36}px`);
    }
  }
  function schedule() { if (canMove() && (heroVisible || storyVisible) && !frame) frame=requestAnimationFrame(paint); }
  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target===field) heroVisible=entry.isIntersecting;
      if (entry.target===story) storyVisible=entry.isIntersecting;
    }
    enter(); schedule();
  });
  visibility.observe(field); visibility.observe(story);
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  field.addEventListener('pointermove',event => {
    if (!canMove() || !finePointer.matches) return;
    const rect=field.getBoundingClientRect();
    const x=clamp((event.clientX-rect.left)/rect.width-.5,-.5,.5);
    const y=clamp((event.clientY-rect.top)/rect.height-.5,-.5,.5);
    pointerX=x*12; pointerY=y*8; pointerRoll=x*2;
    schedule();
  },{passive:true});
  field.addEventListener('pointerleave',() => { pointerX=pointerY=pointerRoll=0; schedule(); });

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame=0;
    for (const animation of running) animation.cancel();
    running.clear(); clearGhost();
    pointerX=pointerY=pointerRoll=0;
    ['--word-drift','--jar-drift','--pointer-x','--pointer-y','--pointer-roll'].forEach(key=>field.style.removeProperty(key));
    story.style.removeProperty('--story-shift');
  }
  function preference() {
    root.dataset.beeMotion=canMove()?'on':'off';
    if (!canMove()) stop(); else { enter(); schedule(); }
  }
  reduced.addEventListener('change',preference);
  finePointer.addEventListener('change',() => { pointerX=pointerY=pointerRoll=0; schedule(); });
  document.addEventListener('visibilitychange',preference);
  document.querySelectorAll('.faq-list details').forEach(detail=>detail.addEventListener('toggle',()=>{
    if (detail.open) animate(detail.querySelector('p'),[{opacity:.4,transform:'translate3d(0,4px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:220});
  }));
  document.fonts.ready.then(()=>{fontsReady=true;enter();schedule();});
  preference();

  window.AzelBeeMotion={
    swapHoney,resetAdded,added,
    priceChanged:()=>animate($('#add-price'),[{opacity:.4,transform:'translate3d(0,3px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:180}),
    adviceChanged:()=>animate($('#taste-result'),[{opacity:.4},{opacity:1}],{duration:220}),
    labelStyleChanged:()=>document.querySelectorAll('.pot-label').forEach(label=>printLabel(label))
  };
})();
