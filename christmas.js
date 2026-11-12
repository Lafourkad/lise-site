/* Thème Noël 2026 — Limpiezas y Soluciones
 * Flocons qui tombent (canvas léger) + popup promo -20% fêtes à la première visite de session.
 * Pattern identique à cookie-consent.js : injection JS, textes via le système data-lang du site.
 * Branche noel-2026 — NE PAS DÉPLOYER sans validation de Lise (périmètre/dates de la promo à confirmer).
 */
(function () {
  var REDUCED = false;
  try { REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ---------- Style ---------- */
  var CSS = ''
    + '#ff-canvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9990;}'
    + '#xmas-overlay{position:fixed;inset:0;background:rgba(15,23,32,.58);backdrop-filter:blur(2px);z-index:10000;'
    + 'display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .35s ease;}'
    + '#xmas-overlay.ff-on{opacity:1;}'
    + '#xmas-modal{background:linear-gradient(160deg,#8f1420 0%,#b3202e 55%,#8f1420 100%);color:#fff;'
    + 'max-width:430px;width:100%;border-radius:18px;border:2px solid #f0c33c;padding:34px 28px 26px;text-align:center;'
    + 'position:relative;box-shadow:0 24px 60px rgba(0,0,0,.45);transform:scale(.92);transition:transform .35s cubic-bezier(.34,1.56,.64,1);}'
    + '#xmas-overlay.ff-on #xmas-modal{transform:scale(1);}'
    + '#xmas-close{position:absolute;top:10px;right:12px;background:none;border:0;color:#f0c33c;font-size:26px;'
    + 'line-height:1;cursor:pointer;padding:4px 8px;border-radius:8px;}'
    + '#xmas-close:hover{background:rgba(255,255,255,.15);}'
    + '.xm-emoji{font-size:44px;line-height:1;display:block;margin-bottom:8px;}'
    + '.xm-title{font-weight:800;font-size:22px;margin:0 0 6px;color:#fff;}'
    + '.xm-pct{font-weight:800;font-size:52px;line-height:1.05;color:#f0c33c;margin:6px 0 4px;text-shadow:0 2px 0 rgba(0,0,0,.25);}'
    + '.xm-txt{font-size:15px;line-height:1.55;color:#ffe9e9;margin:10px 0 20px;}'
    + '.xm-cta{display:inline-block;background:#f0c33c;color:#5a0d15;font-weight:700;font-size:16px;'
    + 'padding:12px 26px;border-radius:999px;text-decoration:none;transition:transform .15s ease,box-shadow .15s ease;}'
    + '.xm-cta:hover{transform:translateY(-1px);box-shadow:0 8px 18px rgba(0,0,0,.3);}'
    + '.xm-note{display:block;margin-top:14px;font-size:12px;color:#ffd9d9;}'
    + '@media (max-width:420px){#xmas-modal{padding:26px 18px 20px;}.xm-pct{font-size:42px;}}'
    + '@media print{#ff-canvas,#xmas-overlay{display:none !important;}}';
  var st = document.createElement('style');
  st.textContent = CSS;
  document.head.appendChild(st);

  /* ---------- Flocons ---------- */
  if (!REDUCED) {
    var cv = document.createElement('canvas');
    cv.id = 'ff-canvas';
    cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    var cx = cv.getContext('2d');
    var W, H, flakes = [], running = true;

    function resize() {
      W = cv.width = window.innerWidth;
      H = cv.height = window.innerHeight;
      var n = Math.min(70, Math.round(W / 22));
      while (flakes.length < n) {
        flakes.push({
          x: Math.random() * W, y: Math.random() * H,
          r: 1.2 + Math.random() * 2.6,
          v: 0.35 + Math.random() * 0.85,
          a: 12 + Math.random() * 30,
          p: Math.random() * Math.PI * 2,
          o: 0.45 + Math.random() * 0.5
        });
      }
      flakes.length = n;
    }
    function tick() {
      if (!running) return;
      cx.clearRect(0, 0, W, H);
      cx.fillStyle = '#fff';
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.p += 0.008;
        f.y += f.v;
        if (f.y > H + 6) { f.y = -6; f.x = Math.random() * W; }
        cx.globalAlpha = f.o;
        cx.beginPath();
        cx.arc(f.x + Math.sin(f.p) * (f.a / 6), f.y, f.r, 0, Math.PI * 2);
        cx.fill();
      }
      cx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running) requestAnimationFrame(tick);
    });
    requestAnimationFrame(tick);
  }

  /* ---------- Popup promo -20% ---------- */
  var SEEN = 'xmas-promo-2026';
  var seen = false;
  try { seen = sessionStorage.getItem(SEEN) === '1'; } catch (e) {}
  if (seen) return;

  var ov = document.createElement('div');
  ov.id = 'xmas-overlay';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', 'Promo Navidad -20%');
  ov.innerHTML = ''
    + '<div id="xmas-modal">'
    +   '<button type="button" id="xmas-close" aria-label="Cerrar">&#215;</button>'
    +   '<span class="xm-emoji">&#127876;</span>'
    +   '<h2 class="xm-title">'
    +     '<span data-lang="es">Promo Navidad</span>'
    +     '<span data-lang="fr">Promo de Noël</span>'
    +     '<span data-lang="en">Christmas Offer</span>'
    +     '<span data-lang="de">Weihnachtsangebot</span>'
    +     '<span data-lang="it">Promo Natale</span>'
    +   '</h2>'
    +   '<div class="xm-pct">'
    +     '<span data-lang="es">-20% para las fiestas</span>'
    +     '<span data-lang="fr">-20% pour les fêtes</span>'
    +     '<span data-lang="en">-20% for the holidays</span>'
    +     '<span data-lang="de">-20% zu den Feiertagen</span>'
    +     '<span data-lang="it">-20% per le feste</span>'
    +   '</div>'
    +   '<p class="xm-txt">'
    +     '<span data-lang="es">Descuento especial de Navidad en nuestros servicios de limpieza. Presupuesto gratis en 24h.</span>'
    +     '<span data-lang="fr">Remise spéciale de Noël sur nos services de nettoyage. Devis gratuit sous 24h.</span>'
    +     '<span data-lang="en">Special Christmas discount on our cleaning services. Free quote within 24h.</span>'
    +     '<span data-lang="de">Spezieller Weihnachtsrabatt auf unsere Reinigungsleistungen. Kostenloses Angebot innerhalb von 24 Std.</span>'
    +     '<span data-lang="it">Sconto speciale di Natale sui nostri servizi di pulizia. Preventivo gratuito in 24h.</span>'
    +   '</p>'
    +   '<a class="xm-cta" href="contacto.html">'
    +     '<span data-lang="es">Pedir presupuesto gratis</span>'
    +     '<span data-lang="fr">Demander un devis gratuit</span>'
    +     '<span data-lang="en">Get a free quote</span>'
    +     '<span data-lang="de">Kostenloses Angebot anfordern</span>'
    +     '<span data-lang="it">Richiedi un preventivo gratuito</span>'
    +   '</a>'
    +   '<span class="xm-note">'
    +     '<span data-lang="es">Oferta limitada — durante las fiestas</span>'
    +     '<span data-lang="fr">Offre limitée — pendant les fêtes</span>'
    +     '<span data-lang="en">Limited offer — during the holidays</span>'
    +     '<span data-lang="de">Begrenztes Angebot — während der Feiertage</span>'
    +     '<span data-lang="it">Offerta limitata — durante le feste</span>'
    +   '</span>'
    + '</div>';
  document.body.appendChild(ov);

  function close() {
    ov.classList.remove('ff-on');
    setTimeout(function () { ov.remove(); }, 380);
    try { sessionStorage.setItem(SEEN, '1'); } catch (e) {}
  }
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.getElementById('xmas-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.getElementById('xmas-overlay')) close();
  });

  setTimeout(function () {
    ov.classList.add('ff-on');
    try { document.getElementById('xmas-close').focus(); } catch (e) {}
  }, 900);
})();
