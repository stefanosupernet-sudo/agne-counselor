/**
 * Cookie banner (modal bloccante) + Google Consent Mode v2
 * Pulsanti: Rifiuta | Personalizza | Accetta
 * In Personalizza: toggle analitici e marketing, salva preferenze
 */
(function () {
  'use strict';
  var STORAGE_KEY = 'agne_cookie_consent_v1';
  var POLICY_URL = 'cookie-policy.html';

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

  function applyConsent(analytics, marketing) {
    gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied'
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        v: 1,
        analytics: !!analytics,
        marketing: !!marketing,
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

  function showBanner(panel) {
    var el = document.getElementById('cookie-banner');
    if (!el) return;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('cookie-lock');
    setPanel(panel || 'main');
  }

  function setPanel(name) {
    var main = document.getElementById('cb-panel-main');
    var cust = document.getElementById('cb-panel-custom');
    if (!main || !cust) return;
    if (name === 'custom') {
      main.hidden = true;
      cust.hidden = false;
      var choice = hasChoice();
      var a = document.getElementById('cb-analytics');
      var m = document.getElementById('cb-marketing');
      if (a) a.checked = choice ? !!choice.analytics : false;
      if (m) m.checked = choice ? !!choice.marketing : false;
    } else {
      main.hidden = false;
      cust.hidden = true;
    }
  }

  function buildBanner() {
    if (document.getElementById('cookie-banner')) return;

    var style = document.createElement('style');
    style.textContent = [
      'html.cookie-lock,html.cookie-lock body{overflow:hidden!important}',
      '#cookie-banner{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(18,21,43,.72);backdrop-filter:blur(4px)}',
      '#cookie-banner.is-open{display:flex}',
      '#cookie-banner .cb-box{background:#fff;color:#1d2342;max-width:520px;width:100%;border-radius:20px;padding:28px 26px 24px;box-shadow:0 24px 60px rgba(0,0,0,.28);font-family:system-ui,-apple-system,"Open Sans",sans-serif;max-height:min(90vh,640px);overflow:auto}',
      '#cookie-banner h2{margin:0 0 12px;font-size:1.25rem;font-weight:700;line-height:1.3}',
      '#cookie-banner p{margin:0 0 1em;font-size:.95rem;line-height:1.55;color:#555c78}',
      '#cookie-banner a{color:#34428f;font-weight:600}',
      '#cookie-banner .cb-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}',
      '#cookie-banner .cb-btn{flex:1 1 120px;border:0;border-radius:999px;padding:12px 16px;font-weight:700;font-size:.92rem;cursor:pointer;font-family:inherit}',
      '#cookie-banner .cb-accept{background:#34428f;color:#fff}',
      '#cookie-banner .cb-accept:hover{background:#26327a}',
      '#cookie-banner .cb-reject{background:#e8e9ef;color:#1d2342}',
      '#cookie-banner .cb-reject:hover{background:#d8dae6}',
      '#cookie-banner .cb-custom{background:#fff;color:#34428f;border:2px solid #34428f}',
      '#cookie-banner .cb-custom:hover{background:#eceffa}',
      '#cookie-banner .cb-cat{border:1px solid #e2e1da;border-radius:14px;padding:14px 16px;margin:0 0 12px;background:#fbfaf6}',
      '#cookie-banner .cb-cat-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}',
      '#cookie-banner .cb-cat h3{margin:0 0 4px;font-size:1rem;font-weight:700}',
      '#cookie-banner .cb-cat p{margin:0;font-size:.88rem;color:#555c78}',
      '#cookie-banner .cb-switch{position:relative;width:48px;height:28px;flex-shrink:0}',
      '#cookie-banner .cb-switch input{opacity:0;width:0;height:0}',
      '#cookie-banner .cb-slider{position:absolute;cursor:pointer;inset:0;background:#c5c8d6;border-radius:999px;transition:.2s}',
      '#cookie-banner .cb-slider:before{content:"";position:absolute;height:22px;width:22px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 4px rgba(0,0,0,.2)}',
      '#cookie-banner .cb-switch input:checked+.cb-slider{background:#5f9a45}',
      '#cookie-banner .cb-switch input:checked+.cb-slider:before{transform:translateX(20px)}',
      '#cookie-banner .cb-switch input:disabled+.cb-slider{opacity:.7;cursor:not-allowed;background:#34428f}',
      '#cookie-banner .cb-back{background:transparent;border:0;color:#34428f;font-weight:600;cursor:pointer;padding:8px 0;margin-bottom:8px;font-size:.9rem}',
      '@media (prefers-color-scheme:dark){',
      '  #cookie-banner .cb-box{background:#1b2040;color:#eceffa}',
      '  #cookie-banner p,#cookie-banner .cb-cat p{color:#aab1d0}',
      '  #cookie-banner .cb-reject{background:#2e3560;color:#eceffa}',
      '  #cookie-banner .cb-custom{background:#1b2040;border-color:#9fb0f0;color:#9fb0f0}',
      '  #cookie-banner .cb-cat{background:#12152b;border-color:#2e3560}',
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
        /* PANNELLO PRINCIPALE */
        '<div id="cb-panel-main">' +
          '<h2 id="cookie-banner-title">Utilizzo dei cookie</h2>' +
          '<p>Questo sito utilizza cookie tecnici necessari al funzionamento e, solo con il tuo consenso, cookie analitici e di marketing (Google Consent Mode v2).</p>' +
          '<p>Puoi accettare tutti, rifiutare i non essenziali oppure personalizzare le categorie. Dettagli nella <a href="' + POLICY_URL + '">Politica dei cookie</a>.</p>' +
          '<div class="cb-actions">' +
            '<button type="button" class="cb-btn cb-reject" data-action="reject">Rifiuta</button>' +
            '<button type="button" class="cb-btn cb-custom" data-action="customize">Personalizza</button>' +
            '<button type="button" class="cb-btn cb-accept" data-action="accept">Accetta tutto</button>' +
          '</div>' +
        '</div>' +
        /* PANNELLO PERSONALIZZA */
        '<div id="cb-panel-custom" hidden>' +
          '<button type="button" class="cb-back" data-action="back">← Indietro</button>' +
          '<h2>Personalizza i cookie</h2>' +
          '<p>Scegli quali categorie attivare. I cookie tecnici restano sempre attivi perché necessari al sito.</p>' +

          '<div class="cb-cat">' +
            '<div class="cb-cat-head">' +
              '<div><h3>Tecnici (necessari)</h3><p>Memorizzano la tua scelta di consenso e garantiscono il funzionamento del sito. Non richiedono consenso.</p></div>' +
              '<label class="cb-switch" title="Sempre attivi"><input type="checkbox" checked disabled aria-label="Cookie tecnici sempre attivi"><span class="cb-slider"></span></label>' +
            '</div>' +
          '</div>' +

          '<div class="cb-cat">' +
            '<div class="cb-cat-head">' +
              '<div><h3>Analitici</h3><p>Aiutano a capire come viene usato il sito (pagine visitate, traffico), in forma aggregata. Consent Mode: analytics_storage.</p></div>' +
              '<label class="cb-switch"><input type="checkbox" id="cb-analytics" aria-label="Abilita cookie analitici"><span class="cb-slider"></span></label>' +
            '</div>' +
          '</div>' +

          '<div class="cb-cat">' +
            '<div class="cb-cat-head">' +
              '<div><h3>Marketing e pubblicità</h3><p>Usati per misurare campagne e, se previsto, personalizzare contenuti promozionali. Consent Mode: ad_storage, ad_user_data, ad_personalization.</p></div>' +
              '<label class="cb-switch"><input type="checkbox" id="cb-marketing" aria-label="Abilita cookie di marketing"><span class="cb-slider"></span></label>' +
            '</div>' +
          '</div>' +

          '<div class="cb-actions">' +
            '<button type="button" class="cb-btn cb-reject" data-action="reject">Rifiuta tutto</button>' +
            '<button type="button" class="cb-btn cb-accept" data-action="save">Salva preferenze</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'accept') {
        applyConsent(true, true);
        hideBanner();
      } else if (action === 'reject') {
        applyConsent(false, false);
        hideBanner();
      } else if (action === 'customize') {
        setPanel('custom');
      } else if (action === 'back') {
        setPanel('main');
      } else if (action === 'save') {
        var a = document.getElementById('cb-analytics');
        var m = document.getElementById('cb-marketing');
        applyConsent(a && a.checked, m && m.checked);
        hideBanner();
      }
    });
  }

  function init() {
    buildBanner();
    var choice = hasChoice();
    if (choice) {
      applyConsent(!!choice.analytics, !!choice.marketing);
      hideBanner();
    } else {
      applyConsent(false, false);
      showBanner('main');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.agneCookieConsent = {
    reopen: function () {
      showBanner('main');
    },
    accept: function () { applyConsent(true, true); hideBanner(); },
    reject: function () { applyConsent(false, false); hideBanner(); }
  };
})();
