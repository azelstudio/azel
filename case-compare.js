/* Comparaison de captures originales. Inactive tant que les deux fichiers
 * ne sont pas renseignés sur la figure ; aucune image de remplacement créée.
 */
(() => {
  document.querySelectorAll('.case-shot[data-before][data-after]').forEach((figure) => {
    const image = figure.querySelector('img');
    if (!image) return;
    const group = document.createElement('div');
    group.className = 'case-compare';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Comparer le site avant et après la refonte');
    const status = document.createElement('span');
    status.className = 'compare-status';
    status.setAttribute('role', 'status');
    let request = 0;
    const buttons = ['before', 'after'].map((mode) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = mode === 'before' ? 'Avant' : 'Après';
      button.setAttribute('aria-pressed', String(mode === 'after'));
      button.addEventListener('click', () => {
        const current = ++request;
        const next = new Image();
        group.setAttribute('aria-busy', 'true');
        next.onload = () => {
          if (current !== request) return;
          image.src = next.src;
          image.alt = figure.dataset[mode + 'Alt'] || (mode === 'before' ? 'Site avant la refonte' : 'Site après la refonte');
          buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
          group.removeAttribute('aria-busy');
          status.textContent = mode === 'before' ? 'Ancien site affiché.' : 'Site refondu affiché.';
        };
        next.onerror = () => {
          if (current !== request) return;
          group.removeAttribute('aria-busy');
          status.textContent = 'Ce visuel est indisponible. La capture précédente reste affichée.';
        };
        next.src = figure.dataset[mode];
      });
      return button;
    });
    group.append(...buttons, status);
    figure.after(group);
  });
})();
