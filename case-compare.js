/* Les captures originales restent entières. Sans JavaScript ou si le comparatif
 * ne peut pas être chargé, le visuel statique du projet reste disponible.
 */
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const load = src => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

  document.querySelectorAll('.case-shot[data-before][data-after]').forEach(figure => {
    const image = figure.querySelector('img');
    if (!image) return;
    const visual = figure.parentElement;
    const note = visual.querySelector('.case-compare-note');
    const calmNote = note?.textContent || 'Comparaison du premier écran';

    Promise.all([load(figure.dataset.before), load(figure.dataset.after)]).then(([before]) => {
      const layer = document.createElement('div');
      layer.className = 'case-compare-before';
      layer.setAttribute('aria-hidden', 'true');
      before.alt = '';
      layer.append(before);
      const divider = document.createElement('span');
      divider.className = 'case-compare-divider';
      divider.setAttribute('aria-hidden', 'true');
      const handle = document.createElement('span');
      handle.className = 'case-compare-handle';
      handle.setAttribute('aria-hidden', 'true');
      handle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m8 8-4 4 4 4m8-8 4 4-4 4"/></svg>';
      const input = document.createElement('input');
      input.type = 'range';
      input.min = '0'; input.max = '100'; input.step = '1'; input.value = '50';
      input.className = 'case-compare-range';
      input.setAttribute('aria-label', 'Comparer le site avant et après la refonte');
      if (note) {
        note.id ||= (figure.id || 'case-comparison') + '-note';
        note.textContent = calmNote + '. Faites glisser pour comparer.';
        input.setAttribute('aria-describedby', note.id);
      }
      const update = value => {
        const percent = Math.max(0, Math.min(100, Number(value)));
        figure.style.setProperty('--reveal', percent + '%');
        input.value = String(Math.round(percent));
        input.setAttribute('aria-valuetext', Math.round(percent) + ' % de l’ancien site visibles');
      };
      figure.append(layer, divider, input, handle);
      figure.classList.add('case-comparing');
      const toolbar = visual.querySelector('.case-visual-bar');
      if (toolbar) {
        const left = document.createElement('span'), right = document.createElement('span');
        left.className = right.className = 'case-visual-label';
        left.textContent = 'Avant'; right.textContent = 'Après';
        toolbar.replaceChildren(left, right);
      }
      update(50);

      // Un geste de découverte unique, interrompu dès que le visiteur agit.
      let frame = 0, used = false;
      const stop = () => { used = true; cancelAnimationFrame(frame); frame = 0; };
      ['pointerdown', 'keydown', 'focus'].forEach(event => input.addEventListener(event, stop));
      input.addEventListener('input', () => { stop(); update(input.value); });
      motion.addEventListener('change', () => { if (motion.matches) stop(); });
      document.addEventListener('visibilitychange', () => { if (document.hidden && frame) stop(); });
      if (!motion.matches && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
          if (!entries[0].isIntersecting) { if (frame) stop(); return; }
          if (used || motion.matches) return;
          used = true;
          const started = performance.now(), values = [50, 62, 38, 50];
          const tick = now => {
            const progress = Math.min(1, (now - started) / 1200);
            const segment = Math.min(2, Math.floor(progress * 3));
            const local = progress === 1 ? 1 : progress * 3 - segment;
            const ease = (1 - Math.cos(Math.PI * local)) / 2;
            update(values[segment] + (values[segment + 1] - values[segment]) * ease);
            frame = progress < 1 ? requestAnimationFrame(tick) : 0;
          };
          frame = requestAnimationFrame(tick);
        }, { threshold: .6 });
        observer.observe(figure);
      }
    }).catch(() => {
      if (note) note.textContent = calmNote + '. Le comparatif est indisponible.';
    });
  });
})();
