/**
 * Cookie banner (modal bloccante) + Google Consent Mode v2
 * Default: tutto denied. Aggiorna gtag/dataLayer su Accetta / Rifiuta.
 */
(function () {
  'use strict';
  var STORAGE_KEY = 'agne_cookie_consent_v1';
  var POLICY_URL = 'cookie-policy.html';

  // --- Consent Mode v2: default PRIMA di qualsiasi tag Google ---
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  function applyConsent(granted) {
    var state = granted ? 'granted' : 'denied';
    gtag('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        v: 1,
        analytics: !!granted,
        marketing: !!granted,
        ts: Date.now()
      }));
    } catch (e) {}
  }

  function hasChoice() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || o.v !== 1) return null;
      return o;
    } catch (e) { return null; }
  }

  function hideBanner() {
    var el = document.getElementById('cookie-banner');
    if (el) {
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('cookie-lock');
    }
  }

  function showBanner() {
    var el = document.getElementById('cookie-banner');
    if (el) {
      el.classList.add('is-open');
      el.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('cookie-lock');
    }
  }

  function buildBanner() {
    if (document.getElementById('cookie-banner')) return;

    var style = document.createElement('style');
    style.textContent = [
      'html.cookie-lock,html.cookie-lock body{overflow:hidden!important}',
      '#cookie-banner{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(18,21,43,.72);backdrop-filter:blur(4px)}',
      '#cookie-banner.is-open{display:flex}',
      '#cookie-banner .cb-box{background:#fff;color:#1d2342;max-width:480px;width:100%;border-radius:20px;padding:28px 26px 24px;box-shadow:0 24px 60px rgba(0,0,0,.28);font-family:system-ui,-apple-system,"Open Sans",sans-serif}',
      '#cookie-banner h2{margin:0 0 12px;font-size:1.25rem;font-weight:700;line-height:1.3;font-family:system-ui,sans-serif}',
      '#cookie-banner p{margin:0 0 1em;font-size:.95rem;line-height:1.55;color:#555c78}',
      '#cookie-banner a{color:#34428f;font-weight:600}',
      '#cookie-banner .cb-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}',
      '#cookie-banner .cb-btn{flex:1 1 140px;border:0;border-radius:999px;padding:12px 18px;font-weight:700;font-size:.95rem;cursor:pointer;font-family:inherit}',
      '#cookie-banner .cb-accept{background:#34428f;color:#fff}',
      '#cookie-banner .cb-accept:hover{background:#26327a}',
      '#cookie-banner .cb-reject{background:#e8e9ef;color:#1d2342}',
      '#cookie-banner .cb-reject:hover{background:#d8dae6}',
      '@media (prefers-color-scheme:dark){',
      '  #cookie-banner .cb-box{background:#1b2040;color:#eceffa}',
      '  #cookie-banner p{color:#aab1d0}',
      '  #cookie-banner .cb-reject{background:#2e3560;color:#eceffa}',
      '}'
    ].join('');
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.id = 'cookie-banner';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-labelledby', 'cookie-banner-title');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML =
      '<div class="cb-box">' +
        '<h2 id="cookie-banner-title">Utilizzo dei cookie</h2>' +
        '<p>Questo sito utilizza cookie tecnici necessari al funzionamento e, solo con il tuo consenso, cookie di analisi e marketing per migliorare l’esperienza e misurare le visite (Google Consent Mode v2).</p>' +
        '<p>Puoi accettare o rifiutare i cookie non essenziali. La tua scelta viene salvata su questo dispositivo. Maggiori dettagli nella <a href="' + POLICY_URL + '">Politica dei cookie</a>.</p>' +
        '<div class="cb-actions">' +
          '<button type="button" class="cb-btn cb-reject" data-action="reject">Rifiuta</button>' +
          '<button type="button" class="cb-btn cb-accept" data-action="accept">Accetta</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var accept = btn.getAttribute('data-action') === 'accept';
      applyConsent(accept);
      hideBanner();
    });
  }

  function init() {
    buildBanner();
    var choice = hasChoice();
    if (choice) {
      applyConsent(!!(choice.analytics || choice.marketing));
      hideBanner();
    } else {
      applyConsent(false);
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // API pubblica per riaprire le preferenze (es. link in footer)
  window.agneCookieConsent = {
    reopen: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      applyConsent(false);
      showBanner();
    },
    accept: function () { applyConsent(true); hideBanner(); },
    reject: function () { applyConsent(false); hideBanner(); }
  };
})();
