/* Adresse de prospection : affiche la démo existante, sans changer son moteur.
 * Les liens vers le showroom et le contact sortent du cadre pour conserver
 * leur fonctionnement habituel. Les liens internes de la démo restent natifs.
 */
(() => {
  const frame = document.getElementById('preview-frame');
  if (!frame) return;
  const seen = new WeakSet();
  const isStudioPage = (url) => url.origin === location.origin &&
    (url.pathname === '/' || url.pathname === '/index.html' ||
     url.pathname === '/showroom/' || url.pathname === '/showroom/index.html');

  const connect = () => {
    let doc, url;
    try {
      doc = frame.contentDocument;
      url = new URL(frame.contentWindow.location.href);
    } catch { return; }
    if (!doc || url.protocol === 'about:') return;
    if (isStudioPage(url)) {
      location.assign(url.href);
      return;
    }
    if (url.origin !== location.origin || seen.has(doc)) return;
    seen.add(doc);
    doc.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.('a[href]');
      if (!link || link.hasAttribute('download') ||
          (link.target && link.target !== '_self' && link.target !== '_top')) return;
      let next;
      try { next = new URL(link.href); } catch { return; }
      if (!isStudioPage(next)) return;
      event.preventDefault();
      location.assign(next.href);
    });
  };
  frame.addEventListener('load', connect);
  connect();
})();
