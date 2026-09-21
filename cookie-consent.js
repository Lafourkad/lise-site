/* cookie-consent.js — Conformité RGPD/LSSI (Espagne)
 * Principe OPT-IN strict : le tag Google (gtag.js / Google Ads AW-18320575240)
 * n'est PAS chargé tant que le visiteur n'a pas cliqué « Accepter ».
 * Refus = aucune requête vers Google, aucun cookie publicitaire.
 * Consentement stocké en localStorage (clé "lise-consent") :
 *   - "granted"  → gtag chargé + Consent Mode v2 accordé
 *   - "denied"   → rien ne se charge
 *   - absent     → bannière affichée
 */
(function () {
  'use strict';

  var KEY = 'lise-consent';
  var GTM_URL = 'https://www.googletagmanager.com/gtag/js?id=AW-18320575240';

  function readConsent() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function writeConsent(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  /* Charge gtag.js uniquement après consentement explicite.
     Consent Mode v2 : tout accordé AVANT le chargement du script. */
  function loadGtag() {
    if (window.__liseGtagLoaded) return;
    window.__liseGtagLoaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
    var s = document.createElement('script');
    s.async = true;
    s.src = GTM_URL;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', 'AW-18320575240');
  }

  /* Bannière — textes multilingues via le système data-lang existant du site
     (les spans suivent automatiquement html[lang=xx]). */
  var CSS = ''
    + '#cookie-banner{position:fixed;bottom:1.5rem;left:1.5rem;z-index:60;max-width:400px;'
    + 'background:#fff;border-radius:1rem;box-shadow:0 25px 50px -12px rgba(0,0,0,.25);'
    + 'padding:1.25rem 1.5rem;font-size:.9rem;line-height:1.5;color:#404850;font-family:Manrope,sans-serif}'
    + '#cookie-banner .cb-title{font-weight:800;font-size:1rem;color:#191c1d;margin-bottom:.4rem;font-family:"Plus Jakarta Sans",sans-serif}'
    + '#cookie-banner .cb-actions{display:flex;gap:.6rem;margin-top:1rem;flex-wrap:wrap}'
    + '#cookie-banner .cb-btn{cursor:pointer;border-radius:.75rem;padding:.6rem 1.2rem;font-weight:600;font-size:.875rem;border:1px solid transparent;font-family:inherit}'
    + '#cookie-banner .cb-accept{background:#2c694e;color:#fff}'
    + '#cookie-banner .cb-reject{background:transparent;border-color:#bfc7d1;color:#404850}'
    + '#cookie-banner .cb-link{color:#0077b6;text-decoration:underline;font-size:.8rem;display:inline-block;margin-top:.6rem}'
    + '@media(max-width:640px){#cookie-banner{left:1rem;right:1rem;bottom:1rem;max-width:none}}';

  function showBanner() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var b = document.createElement('div');
    b.id = 'cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-live', 'polite');
    b.innerHTML = ''
      + '<div class="cb-title">'
      +   '<span data-lang="es">Cookies de medición</span>'
      +   '<span data-lang="fr">Cookies de mesure</span>'
      +   '<span data-lang="en">Measurement cookies</span>'
      +   '<span data-lang="de">Mess-Cookies</span>'
      +   '<span data-lang="it">Cookie di misurazione</span>'
      + '</div>'
      + '<div>'
      +   '<span data-lang="es">Usamos cookies de Google Ads para medir la eficacia de nuestra publicidad. No se cargan hasta que las acepte.</span>'
      +   '<span data-lang="fr">Nous utilisons des cookies Google&nbsp;Ads pour mesurer l\'efficacité de notre publicité. Ils ne sont chargés qu\'après votre acceptation.</span>'
      +   '<span data-lang="en">We use Google Ads cookies to measure the effectiveness of our advertising. They are not loaded until you accept.</span>'
      +   '<span data-lang="de">Wir verwenden Google Ads Cookies, um die Wirksamkeit unserer Werbung zu messen. Sie werden erst geladen, wenn Sie zustimmen.</span>'
      +   '<span data-lang="it">Utilizziamo cookie Google Ads per misurare l\'efficacia della nostra pubblicità. Vengono caricati solo dopo il tuo consenso.</span>'
      + '</div>'
      + '<div class="cb-actions">'
      +   '<button type="button" class="cb-btn cb-accept" id="cb-accept-btn">'
      +     '<span data-lang="es">Aceptar</span>'
      +     '<span data-lang="fr">Accepter</span>'
      +     '<span data-lang="en">Accept</span>'
      +     '<span data-lang="de">Akzeptieren</span>'
      +     '<span data-lang="it">Accetta</span>'
      +   '</button>'
      +   '<button type="button" class="cb-btn cb-reject" id="cb-reject-btn">'
      +     '<span data-lang="es">Rechazar</span>'
      +     '<span data-lang="fr">Refuser</span>'
      +     '<span data-lang="en">Reject</span>'
      +     '<span data-lang="de">Ablehnen</span>'
      +     '<span data-lang="it">Rifiuta</span>'
      +   '</button>'
      + '</div>'
      + '<a class="cb-link" href="politica-privacidad.html#cookies">'
      +   '<span data-lang="es">Más información</span>'
      +   '<span data-lang="fr">En savoir plus</span>'
      +   '<span data-lang="en">More info</span>'
      +   '<span data-lang="de">Mehr erfahren</span>'
      +   '<span data-lang="it">Maggiori informazioni</span>'
      + '</a>';

    document.body.appendChild(b);

    b.querySelector('#cb-accept-btn').addEventListener('click', function () {
      writeConsent('granted');
      b.remove();
      loadGtag();
    });
    b.querySelector('#cb-reject-btn').addEventListener('click', function () {
      writeConsent('denied');
      b.remove();
    });
  }

  /* Bouton de retrait du consentement (page politique de confidentialité) */
  function bindReset() {
    var r = document.getElementById('reset-cookie-consent');
    if (!r) return;
    r.addEventListener('click', function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      /* Supprime aussi les cookies Google déjà posés, si le consentement avait été accordé */
      var past = new Date(0).toUTCString();
      ['_gcl_au', '_gcl_aw', '_gcl_dc'].forEach(function (name) {
        document.cookie = name + '=; expires=' + past + '; path=/';
      });
      location.reload();
    });
  }

  var consent = readConsent();
  if (consent === 'granted') {
    loadGtag();
  } else if (consent !== 'denied') {
    showBanner();
  }
  bindReset();
})();
