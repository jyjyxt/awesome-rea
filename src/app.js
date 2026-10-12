(() => {
  'use strict';
  const data = JSON.parse(document.querySelector('#case-data').textContent);
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const search = $('#search');
  const sourceLanguage = $('#source-language');
  const evidence = $('#evidence');
  const dialog = $('#case-dialog');
  const cards = [...document.querySelectorAll('[data-case]')];
  const byId = new Map(data.cases.map(entry => [entry.id, entry]));
  const normalize = value => value.normalize('NFKC').toLocaleLowerCase();
  const searchable = new Map(data.cases.map(entry => [entry.id, normalize([entry.target, entry.author, ...entry.tools, ...Object.values(entry.title), ...Object.values(entry.summary), ...Object.values(entry.outcome), ...Object.values(data.categories[entry.category])].join(' '))]));
  let uiLanguage = new URLSearchParams(location.search).get('ui') === 'en' ? 'en' : 'zh';
  let category = 'all';
  let openedId = null;
  let returnFocus = null;
  let copyTimer;
  const t = key => data.ui[uiLanguage][key];
  const evidenceLabel = entry => t(data.labels[entry.evidence]);

  function updateURL() {
    const url = new URL(location.href);
    for (const [key, value, fallback] of [['q', search.value.trim(), ''], ['category', category, 'all'], ['language', sourceLanguage.value, 'all'], ['evidence', evidence.value, 'all'], ['ui', uiLanguage, 'zh']]) {
      if (value === fallback) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    history.replaceState(null, '', url);
  }

  function filterCases(sync = true) {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    for (const card of cards) {
      const entry = byId.get(card.dataset.case);
      const matches = (category === 'all' || entry.category === category) && (sourceLanguage.value === 'all' || entry.language === sourceLanguage.value) && (evidence.value === 'all' || entry.evidence === evidence.value) && terms.every(term => searchable.get(entry.id).includes(term));
      card.hidden = !matches;
      count += Number(matches);
    }
    $('#results-count').textContent = t('results').replace('{count}', count);
    $('#empty-state').hidden = count > 0;
    $('#reset-filters').hidden = !search.value && category === 'all' && sourceLanguage.value === 'all' && evidence.value === 'all';
    document.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
    if (sync) updateURL();
  }

  function applyLanguage() {
    document.documentElement.lang = uiLanguage === 'zh' ? 'zh-CN' : 'en';
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(node => { node.placeholder = t(node.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-category-label]').forEach(node => { node.textContent = data.categories[node.dataset.categoryLabel][uiLanguage]; });
    for (const card of cards) {
      const entry = byId.get(card.dataset.case);
      card.querySelectorAll('[data-case-field]').forEach(node => { node.textContent = entry[node.dataset.caseField][uiLanguage]; });
      card.querySelector('[data-open]').setAttribute('aria-label', `${t('readCase')}: ${entry.title[uiLanguage]}`);
    }
    $('#ui-language').textContent = uiLanguage === 'zh' ? 'EN' : '中文';
    $('#ui-language').setAttribute('aria-label', uiLanguage === 'zh' ? 'Switch to English' : '切换到中文');
    $('#dialog-close').setAttribute('aria-label', t('close'));
    $('#categories').setAttribute('aria-label', t('categoriesLabel'));
    if (openedId) renderDetail(byId.get(openedId));
    filterCases();
  }

  function renderDetail(entry) {
    clearTimeout(copyTimer);
    const text = key => escape(entry[key][uiLanguage]);
    $('#dialog-content').innerHTML = `<div class="dialog-meta"><span class="evidence-dot ${entry.evidence}-dot" aria-hidden="true"></span><span>${escape(evidenceLabel(entry))}</span><span class="source-language">${entry.language.toUpperCase()}</span></div><p class="dialog-target">${escape(entry.target)}</p><h2 id="dialog-title">${text('title')}</h2><p class="dialog-summary">${text('summary')}</p><div class="dialog-section"><h3>${t('question')}</h3><p>${text('question')}</p></div><div class="dialog-section"><h3>${t('workflow')}</h3><ol class="dialog-workflow">${entry.workflow[uiLanguage].map(step => `<li>${escape(step)}</li>`).join('')}</ol></div><div class="dialog-section outcome-box"><h3>${t('outcome')}</h3><p>${text('outcome')}</p></div><div class="dialog-section limit-box"><h3>${t('limitation')}</h3><p>${text('limitation')}</p></div><div class="dialog-section"><h3>${t('sources')}</h3><div class="source-links">${entry.sources.map(source => `<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div></div><div class="dialog-bottom"><span>${t('checked')} ${entry.checkedAt}<br>${t('sourceLanguage')}: ${escape(data.nativeLanguages[entry.language] || entry.language)}</span><div><button class="copy-link" type="button" id="copy-link">${t('copy')} ↗</button><p class="copy-status" id="copy-status" role="status"></p></div></div>`;
    $('#copy-link').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        $('#copy-status').textContent = t('copied');
      } catch {
        $('#copy-status').textContent = t('copyFailed');
      }
      copyTimer = setTimeout(() => { if ($('#copy-status')) $('#copy-status').textContent = ''; }, 3500);
    });
  }

  function openDetail(id, sync = true) {
    const entry = byId.get(id);
    if (!entry) return;
    if (!dialog.showModal) { location.href = `./cases/${id}/`; return; }
    if (!dialog.open) returnFocus = document.activeElement;
    openedId = id;
    renderDetail(entry);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    $('#dialog-close').focus();
    if (sync) {
      const url = new URL(location.href);
      url.hash = `case/${id}`;
      history.pushState(null, '', url);
    }
  }

  function closeDetail() {
    dialog.close();
    const url = new URL(location.href);
    if (url.hash.startsWith('#case/')) { url.hash = ''; history.replaceState(null, '', url); }
  }

  function readURL() {
    const params = new URLSearchParams(location.search);
    search.value = params.get('q') || '';
    const selected = params.get('category');
    category = selected && data.categories[selected] ? selected : 'all';
    sourceLanguage.value = data.cases.some(c => c.language === params.get('language')) ? params.get('language') : 'all';
    evidence.value = ['code', 'report', 'official', 'related'].includes(params.get('evidence')) ? params.get('evidence') : 'all';
    uiLanguage = params.get('ui') === 'en' ? 'en' : 'zh';
    applyLanguage();
    const id = location.hash.startsWith('#case/') ? location.hash.slice(6) : null;
    if (id && byId.has(id)) openDetail(id, false);
    else if (dialog.open) dialog.close();
  }

  function reset() {
    search.value = '';
    category = 'all';
    sourceLanguage.value = evidence.value = 'all';
    filterCases();
    search.focus();
  }
  document.querySelectorAll('[data-open]').forEach(node => node.addEventListener('click', event => { event.preventDefault(); openDetail(node.dataset.open); }));
  search.addEventListener('input', () => filterCases());
  sourceLanguage.addEventListener('change', () => filterCases());
  evidence.addEventListener('change', () => filterCases());
  $('#categories').addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (button) { category = button.dataset.category; filterCases(); } });
  $('#reset-filters').addEventListener('click', reset);
  $('#empty-reset').addEventListener('click', reset);
  $('#ui-language').addEventListener('click', () => { uiLanguage = uiLanguage === 'zh' ? 'en' : 'zh'; applyLanguage(); });
  $('#dialog-close').addEventListener('click', closeDetail);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDetail(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDetail(); } });
  dialog.addEventListener('close', () => { openedId = null; clearTimeout(copyTimer); if (returnFocus?.isConnected) returnFocus.focus(); });
  window.addEventListener('popstate', readURL);
  window.addEventListener('hashchange', readURL);
  document.addEventListener('keydown', event => { if (event.key === '/' && !dialog.open && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { event.preventDefault(); search.focus(); } });
  $('#filters').hidden = $('#categories').hidden = false;
  readURL();
})();
