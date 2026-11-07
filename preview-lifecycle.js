/* Les miniatures restent des images sur les appareils tactiles. Sur ordinateur,
 * une seule démo décorative est montée, après l'arrêt du défilement. Retirer le
 * cadre libère aussi les scripts, minuteries et surfaces graphiques de la démo. */
(() => {
  'use strict';
  const compact = matchMedia('(max-width: 760px), (pointer: coarse)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const enabled = () => !compact.matches && !reduced.matches && !navigator.connection?.saveData && 'IntersectionObserver' in window;

  const mount = root => {
    const hosts = [...root.querySelectorAll('[data-preview-src]')];
    let current = null, timer = 0, destroyed = false;
    const release = () => {
      if (!current) return;
      const old = current; current = null;
      old.resize?.disconnect();
      old.frame.remove();
    };
    const area = host => {
      if (!host.isConnected || !host.getClientRects().length) return 0;
      const r = host.getBoundingClientRect();
      return Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
    };
    const visible = () => !document.hidden && root.isConnected && enabled();
    const choose = () => {
      timer = 0;
      if (destroyed || !visible()) { release(); return; }
      let target = null, best = 0;
      hosts.forEach(host => { const score = area(host); if (score > best) { best = score; target = host; } });
      if (!target) { release(); return; }
      if (current?.host === target) return;
      release();
      let url;
      try { url = new URL(target.dataset.previewSrc, location.href); } catch { return; }
      if (url.origin !== location.origin || !url.pathname.startsWith('/showroom/')) return;
      const frame = document.createElement('iframe');
      frame.className = 'frame-in'; frame.tabIndex = -1;
      frame.title = target.dataset.previewTitle || 'Aperçu de la création';
      frame.setAttribute('aria-hidden', 'true');
      const record = {host: target, frame, resize: null}; current = record;
      const fit = () => {
        if (current !== record) return;
        const transform = `scale(${target.clientWidth / 1440})`;
        if (frame.style.transform !== transform) frame.style.transform = transform;
      };
      frame.addEventListener('load', () => {
        if (current !== record || destroyed || !visible() || !area(target)) return;
        fit(); frame.classList.add('on');
      });
      frame.src = url.href; target.append(frame); fit();
      if ('ResizeObserver' in window) { record.resize = new ResizeObserver(fit); record.resize.observe(target); }
    };
    const schedule = () => {
      clearTimeout(timer);
      if (destroyed || !visible()) { release(); return; }
      if (current && !area(current.host)) release();
      timer = setTimeout(choose, 450);
    };
    const sleep = () => { clearTimeout(timer); timer = 0; release(); };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(schedule, {threshold: [0, .25, .75]}) : null;
    hosts.forEach(host => observer?.observe(host));
    document.addEventListener('scroll', schedule, {capture: true, passive: true});
    document.addEventListener('visibilitychange', schedule);
    addEventListener('resize', schedule, {passive: true});
    addEventListener('pagehide', sleep); addEventListener('pageshow', schedule);
    compact.addEventListener('change', schedule); reduced.addEventListener('change', schedule);
    schedule();
    return {
      refresh: schedule,
      destroy() {
        if (destroyed) return;
        destroyed = true; sleep(); observer?.disconnect();
        document.removeEventListener('scroll', schedule, true);
        document.removeEventListener('visibilitychange', schedule);
        removeEventListener('resize', schedule); removeEventListener('pagehide', sleep); removeEventListener('pageshow', schedule);
        compact.removeEventListener('change', schedule); reduced.removeEventListener('change', schedule);
      }
    };
  };
  window.AzelPreviews = {mount};
})();
