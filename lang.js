// Shared language picker. A page marks text with data-i18n="key" (or
// data-i18n-attr="attr:key,...") and calls I18N.init(texts, onChange), where
// texts = {uk:{...}, en:{...}, ...}. Missing keys fall back to English.
(() => {
  const LANGS = {uk: 'Українська', en: 'English', pl: 'Polski', ru: 'Русский'};
  const KEY = 'lang';
  // The device time zone stands in for location: it needs no network call.
  const ZONES = {
    pl: ['Europe/Warsaw'],
    uk: ['Europe/Kyiv', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye', 'Europe/Simferopol'],
    ru: ['Europe/Moscow', 'Europe/Minsk', 'Europe/Kaliningrad', 'Europe/Samara', 'Europe/Volgograd',
         'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk',
         'Asia/Yakutsk', 'Asia/Vladivostok', 'Asia/Magadan', 'Asia/Kamchatka']
  };

  function byZone() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      for (const [code, zones] of Object.entries(ZONES)) if (zones.includes(tz)) return code;
    } catch (e) {}
    return null;
  }

  function initial() {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS[q]) return q;
    try { const s = localStorage.getItem(KEY); if (LANGS[s]) return s; } catch (e) {}
    const z = byZone();
    if (z) return z;
    for (const l of navigator.languages || [navigator.language]) {
      const code = (l || '').slice(0, 2).toLowerCase();
      if (LANGS[code]) return code;
    }
    return 'en';
  }

  let lang = initial(), texts = {}, onChange = () => {};

  function t(key) {
    return texts[lang]?.[key] ?? texts.en?.[key] ?? key;
  }

  function apply() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      for (const pair of el.dataset.i18nAttr.split(',')) {
        const [attr, key] = pair.split(':');
        el.setAttribute(attr, t(key));
      }
    });
    if (texts.en?.title) document.title = t('title');
    const meta = document.querySelector('meta[name=description]');
    if (meta && texts.en?.description) meta.content = t('description');
    document.querySelectorAll('select.lang-pick').forEach(s => { s.value = lang; });
    onChange(lang);
  }

  function set(l) {
    if (!LANGS[l]) return;
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    apply();
  }

  function init(pageTexts, cb) {
    texts = pageTexts;
    if (cb) onChange = cb;
    document.querySelectorAll('select.lang-pick').forEach(s => {
      s.replaceChildren(...Object.entries(LANGS).map(([code, name]) => new Option(name, code)));
      s.addEventListener('change', () => set(s.value));
    });
    apply();
  }

  window.I18N = {init, t, set, get lang() { return lang; }};
})();
