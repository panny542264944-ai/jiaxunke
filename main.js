(function () {
  const LANG_KEY = 'jxk_lang';

  function getLang() {
    try {
      return localStorage.getItem(LANG_KEY) || 'zh-Hant';
    } catch (e) {
      return 'zh-Hant';
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {}
  }

  function applyI18n() {
    const dict = window.JXK_PAGE_I18N;
    if (!dict) return;
    let lang = getLang();
    if (!dict[lang]) lang = 'zh-Hant';
    const pack = dict[lang];

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (pack[key] !== undefined) el.innerHTML = pack[key];
    });

    document.querySelectorAll('.lang-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.documentElement.lang =
      lang === 'en' ? 'en' : lang === 'zh-Hans' ? 'zh-CN' : 'zh-Hant';

    if (typeof window.JXK_onLangApplied === 'function') {
      window.JXK_onLangApplied(lang, pack);
    }
  }

  function initMobileNav() {
    const btn = document.getElementById('mobile-menu');
    const drawer = document.getElementById('mobile-nav');
    const backdrop = document.getElementById('nav-backdrop');
    if (!btn || !drawer) return;

    function toggleMenu(forceClose) {
      const shouldOpen = forceClose ? false : !drawer.classList.contains('active');
      btn.classList.toggle('open', shouldOpen);
      btn.setAttribute('aria-expanded', String(shouldOpen));
      drawer.classList.toggle('active', shouldOpen);
      if (backdrop) backdrop.classList.toggle('active', shouldOpen);
      document.body.style.overflow = shouldOpen ? 'hidden' : '';
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu();
    });
    if (backdrop) backdrop.addEventListener('click', () => toggleMenu(true));
    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => toggleMenu(true));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(true);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const switcher = document.getElementById('lang-switch');
    if (switcher) {
      switcher.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-btn');
        if (!btn) return;
        setLang(btn.dataset.lang);
        applyI18n();
      });
    }
    initMobileNav();
    applyI18n();
  });
})();