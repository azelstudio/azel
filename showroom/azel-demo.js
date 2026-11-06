/*!
 * Azel Showroom : pont entre une création et le showroom.
 * À inclure en bas de chaque page de démonstration :
 *   <script src="../azel-demo.js" data-template="depart" defer></script>
 *
 * 1. Personnalisation : ?nom=…&ville=… remplace le texte des éléments
 *    marqués data-azel="name" et data-azel="city" (aucune donnée envoyée).
 * 2. Hors du showroom (visite directe, publicité) : petite barre discrète
 *    « Démonstration Azel Studio » avec « Je veux ce style ».
 *    Dans l'aperçu du showroom (?embed=1), rien ne s'affiche.
 * 3. Couleur : ?c=RRGGBB (ou message du showroom) remplace la couleur d'accent.
 *    La démo déclare sa variable : data-accent="--or" (et data-accent2 pour la teinte foncée),
 *    data-on="light" si le texte posé sur l'accent est blanc, "dark" s'il est foncé.
 *    La couleur est ajustée pour rester lisible.
 * 4. Logo : envoyé par le showroom (message), il remplace le nom dans les éléments data-azel-logo.
 *    L'image reste dans le navigateur du visiteur, rien n'est envoyé.
 * 5. Nom en direct : message { azel: "name", value } depuis la page parente (essai rapide sur l'accueil).
 * 6. Mise en scène : &slow=1 ajoute la classe azel-slow (la démo ralentit son ouverture),
 *    &hold=6500 règle la pause sur le hero pendant la visite automatique.
 */
(() => {
  const me = document.currentScript;
  const id = (me && me.dataset.template) || "";
  const q = new URLSearchParams(location.search);
  const clean = (v, n) => (v || "").replace(/\s+/g, " ").trim().slice(0, n);
  const name = clean(q.get("nom"), 32);
  const city = clean(q.get("ville"), 28);
  const embedded = q.get("embed") === "1";

  /* ---------- couleur d'accent ---------- */
  const accent = me && me.dataset.accent, accent2 = me && me.dataset.accent2, on = (me && me.dataset.on) || "light";
  const hex2rgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lum = (rgb) => { const f = (c) => (c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4)); const [r, g, b] = rgb.map(f); return .2126 * r + .7152 * g + .0722 * b; };
  const rgb2hsl = ([r, g, b]) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; } return [h, s, l]; };
  const hsl2rgb = ([h, s, l]) => { if (!s) return [l, l, l]; const q2 = l < .5 ? l * (1 + s) : l + s - l * s, p2 = 2 * l - q2; const t = (x) => { x = (x + 1) % 1; return x < 1 / 6 ? p2 + (q2 - p2) * 6 * x : x < .5 ? q2 : x < 2 / 3 ? p2 + (q2 - p2) * (2 / 3 - x) * 6 : p2; }; return [t(h + 1 / 3), t(h), t(h - 1 / 3)]; };
  const css = (rgb) => "#" + rgb.map((c) => Math.round(Math.max(0, Math.min(1, c)) * 255).toString(16).padStart(2, "0")).join("");
  const contrast = (a2, b2) => { const x = lum(a2), y = lum(b2); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const toneKeys = id === "depart" ? ["--night", "--night-2", "--hero-glow", "--on-night-muted", "--on-night-body", "--sign-glow", "--road", "--road-edge", "--road-stop", "--road-label"] : [];
  const toneValues = new Map(toneKeys.map((key) => [key, getComputedStyle(document.documentElement).getPropertyValue(key).trim()]));
  const extraToneKeys = id === "depart" ? ["--night-rgb", "--sign-glow-rgb"] : [];
  const originalAccent = new Map([accent, accent2, ...toneKeys, ...extraToneKeys].filter(Boolean).map((key) => [key, {
    value: document.documentElement.style.getPropertyValue(key),
    priority: document.documentElement.style.getPropertyPriority(key)
  }]));
  const resetColor = () => originalAccent.forEach(({ value, priority }, key) => {
    if (value) document.documentElement.style.setProperty(key, value, priority);
    else document.documentElement.style.removeProperty(key);
  });
  const applyColor = (hex) => {
    if (!accent || !/^[0-9a-f]{6}$/i.test(hex || "")) return;
    let hsl = rgb2hsl(hex2rgb(hex));
    const ref = on === "dark" ? [.09, .09, .09] : [1, 1, 1], need = on === "dark" ? 4.2 : 3.2;
    for (let i = 0; i < 40 && contrast(hsl2rgb(hsl), ref) < need; i++) hsl = [hsl[0], hsl[1], Math.max(0, Math.min(1, hsl[2] + (on === "dark" ? .02 : -.02)))];
    const root = document.documentElement.style;
    root.setProperty(accent, css(hsl2rgb(hsl)));
    if (accent2) root.setProperty(accent2, css(hsl2rgb([hsl[0], hsl[1], Math.max(0, hsl[2] - .08)])));
    if (id === "depart") {
      const delta = hsl[0] - rgb2hsl(hex2rgb("1F5BFF"))[0];
      toneValues.forEach((value, key) => {
        if (!/^#[0-9a-f]{6}$/i.test(value)) return;
        const [h, s, l] = rgb2hsl(hex2rgb(value.slice(1)));
        const rgb = hsl2rgb([(h + delta + 1) % 1, s * Math.min(1, hsl[1] / .08), l]);
        root.setProperty(key, css(rgb));
        if (key === "--night" || key === "--sign-glow") root.setProperty(key + "-rgb", rgb.map((c) => Math.round(c * 255)).join(","));
      });
    }
  };

  /* ---------- logo ---------- */
  const applyLogo = (src) => {
    if (!document.getElementById("azel-logo-css")) { const st = document.createElement("style"); st.id = "azel-logo-css"; st.textContent = ".azel-has-logo::after,.azel-has-logo::before{display:none!important}"; document.head.appendChild(st); }
    document.querySelectorAll("[data-azel-logo]").forEach((el) => {
      if (!("orig" in el.dataset)) el.dataset.orig = el.dataset.origName || el.textContent.trim();
      if (!src) { el.textContent = el.dataset.orig; el.classList.remove("azel-has-logo"); return; }
      if (el.classList.contains("azel-has-logo") && el.querySelector("img")?.getAttribute("src") === src) return;
      const im = new Image(); im.src = src; im.alt = el.dataset.orig; im.decoding = "async";
      im.style.cssText = "display:block;height:1.25em;width:auto;max-width:min(240px,46vw);object-fit:contain;object-position:left center";
      el.replaceChildren(im); el.classList.add("azel-has-logo");
    });
  };
  addEventListener("message", (e) => {
    if (e.source !== parent || !e.data || typeof e.data !== "object") return;
    if (e.data.azel === "color") { const hex = String(e.data.hex || "").replace("#", ""); if (hex) applyColor(hex); else resetColor(); }
    if (e.data.azel === "name") applyName(clean(String(e.data.value || ""), 32));
    if (e.data.azel === "city") applyCity(clean(String(e.data.value || ""), 28));
    if (e.data.azel === "artisan" && id === "artisan") applyArtisan(e.data.value);
    if (e.data.azel === "logo") { const s = e.data.src; applyLogo(typeof s === "string" && s.startsWith("data:image/") && s.length < 1.6e6 ? s : null); }
  });

  /* nom tapé en direct : remplace le texte, sans toucher un logo déjà posé ; vide = nom d'origine */
  const applyName = (v) => {
    document.querySelectorAll('[data-azel="name"]').forEach((el) => {
      if (el.classList.contains("azel-has-logo")) return;
      if (!("origName" in el.dataset)) el.dataset.origName = el.textContent;
      el.textContent = v || el.dataset.origName;
    });
  };

  const applyCity = (v) => {
    document.querySelectorAll('[data-azel="city"]').forEach((el) => {
      if (!("origCity" in el.dataset)) el.dataset.origCity = el.textContent;
      el.textContent = v || el.dataset.origCity;
    });
  };

  const artisanOriginals = new Map();
  const applyArtisan = (data) => {
    if (!window.AzelArtisan || id !== "artisan") return;
    const values = AzelArtisan.normalize(data);
    document.querySelectorAll("[data-azel-artisan]").forEach((el) => {
      if (!artisanOriginals.has(el)) artisanOriginals.set(el, el.innerHTML);
      const key = el.dataset.azelArtisan, value = values[key] || "";
      if (key === "phone" || key === "email") {
        const valid = key === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : /^[+()\d. -]{6,30}$/.test(value) && value.replace(/\D/g, "").length >= 6;
        el.hidden = !value; el.textContent = value;
        if (valid) el.setAttribute("href", key === "email" ? "mailto:" + encodeURIComponent(value) : "tel:" + value.replace(/[^+\d]/g, ""));
        else el.removeAttribute("href");
      } else {
        if (value) el.textContent = value; else el.innerHTML = artisanOriginals.get(el);
        if (key === "tagline") el.toggleAttribute("data-custom-tagline", !!value);
        if (key.startsWith("service")) { const detail = el.nextElementSibling; if (detail) detail.hidden = !!value && value !== artisanOriginals.get(el); }
      }
    });
  };

  const apply = () => {
    if (q.get("slow") === "1") document.documentElement.classList.add("azel-slow");
    applyColor(q.get("c") || "");
    applyName(name);
    applyCity(city);
    if (id === "artisan" && window.AzelArtisan) applyArtisan(AzelArtisan.read(q));
    if (embedded) { document.documentElement.classList.add("azel-embed"); if (q.get("tour") === "1") tour(); }
    else bar();
  };

  /* 3. Visite automatique dans l'aperçu (?embed=1&tour=1) : la page défile seule,
     comme si quelqu'un la parcourait. Elle s'arrête dès qu'on la touche, reprend après 6 s. */
  const tour = () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const se = document.scrollingElement || document.documentElement;
    se.style.scrollBehavior = "auto";
    let pausedUntil = 0, phase = "wait", t0 = performance.now(), from = 0, last = performance.now();
    const hold = () => { pausedUntil = performance.now() + 6000; };
    ["wheel", "pointerdown", "touchstart", "keydown"].forEach((e) => addEventListener(e, hold, { passive: true }));
    const SPEED = 120; // px par seconde : lent, comme quelqu'un qui lit vraiment
    // Temps d'arrêt sur le hero, réglable par démo : data-hold="5500" sur la balise script (défaut 1,8 s)
    const HOLD = Math.min(15000, Math.max(800, +q.get("hold") || +(me && me.dataset.hold) || 1800));
    const step = (now) => {
      const dt = Math.min(64, now - last); last = now;
      const max = se.scrollHeight - innerHeight;
      if (now < pausedUntil || max < 40) { t0 = now; requestAnimationFrame(step); return; }
      if (phase === "wait" && now - t0 > HOLD) { phase = "down"; }
      else if (phase === "down") {
        const y = Math.min(max, se.scrollTop + SPEED * dt / 1000);
        se.scrollTop = y;
        if (y >= max - 1) { phase = "end"; t0 = now; }
      } else if (phase === "end" && now - t0 > 2200) { phase = "up"; t0 = now; from = se.scrollTop; }
      else if (phase === "up") {
        const k = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - k, 3);
        se.scrollTop = from * (1 - e);
        if (k >= 1) { phase = "wait"; t0 = now; }
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* La personnalisation de la démo suit le visiteur jusqu'au showroom, puis jusqu'à sa demande */
  const styleQuery = () => {
    const s = new URLSearchParams();
    if (name) s.set("nom", name);
    if (city) s.set("ville", city);
    const c = (q.get("c") || "").replace("#", "");
    if (/^[0-9a-f]{6}$/i.test(c)) s.set("c", c);
    if (id === "artisan" && window.AzelArtisan) AzelArtisan.write(s, AzelArtisan.read(q));
    if(id === "apiculture" && window.AzelApiculture) AzelApiculture.write(s,AzelApiculture.read(q));
    return s.toString() ? "?" + s : "";
  };

  const bar = () => {
    const base = me ? new URL("./", me.src).href : "/showroom/";
    const style = document.createElement("style");
    style.textContent = `
      .azel-bar{position:fixed;z-index:2147483000;left:50%;bottom:max(16px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);display:flex;align-items:center;gap:12px;padding:8px 8px 8px 16px;border-radius:999px;background:rgba(8,8,8,.86);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 0 0 1px rgba(243,241,235,.16),0 18px 40px rgba(0,0,0,.35);font:500 13px/1.2 "Instrument Sans","Helvetica Neue",Arial,sans-serif;color:#F3F1EB;max-width:calc(100vw - 24px)}
      .azel-bar svg{width:16px;height:16px;flex:none}
      .azel-bar span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#CFCDC6}
      .azel-bar a{display:inline-flex;align-items:center;height:36px;padding:0 16px;border-radius:999px;background:#F3F1EB;color:#080808;font-weight:600;text-decoration:none;white-space:nowrap}
      .azel-bar a:focus-visible{outline:2px solid #F3F1EB;outline-offset:3px}
      .azel-bar button{border:0;background:none;color:#8A8C91;font:inherit;cursor:pointer;padding:0 6px;height:36px}
      @media (max-width:520px){.azel-bar span{display:none}}`;
    const el = document.createElement("div");
    el.className = "azel-bar";
    el.setAttribute("role", "region");
    el.setAttribute("aria-label", "Démonstration Azel Studio");
    el.innerHTML = `<svg viewBox="0 0 30 30" aria-hidden="true"><rect x="0" y="10.5" width="19.5" height="19.5" rx="1.6" fill="#F3F1EB"/><rect x="19.5" y="0" width="10.5" height="10.5" rx="1.1" fill="#F3F1EB"/></svg>
      <span class="azel-who">Démonstration Azel Studio · entreprise fictive</span>
      <a href="${base}${styleQuery()}#${id}-style">Je veux ce style</a>
      <button type="button" aria-label="Masquer">✕</button>`;
    if (name) el.querySelector(".azel-who").textContent = `Aperçu préparé pour ${name} · démonstration Azel Studio`;
    el.querySelector("button").addEventListener("click", () => el.remove());
    document.head.appendChild(style);
    document.body.appendChild(el);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
