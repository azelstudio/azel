/* Le menu reste natif, les sorties clavier et le clic extérieur le complètent. */
(() => {
  const menus = [...document.querySelectorAll('[data-mobile-menu]')];
  if (!menus.length) return;
  const close = (menu, restoreFocus = false) => {
    if (!menu.open) return;
    menu.open = false;
    if (restoreFocus) menu.querySelector('summary').focus({ preventScroll: true });
  };
  document.addEventListener('click', (event) => menus.forEach((menu) => {
    if (!menu.contains(event.target) || event.target.closest('a[href]')) close(menu);
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    menus.forEach((menu) => {
      if (menu.open) { event.preventDefault(); close(menu, true); }
    });
  });
  document.addEventListener('focusin', (event) => menus.forEach((menu) => {
    if (!menu.contains(event.target)) close(menu);
  }));
  addEventListener('resize', () => menus.forEach((menu) => {
    if (getComputedStyle(menu).display === 'none') close(menu);
  }));
})();
