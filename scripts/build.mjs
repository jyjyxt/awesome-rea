import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';

const data = JSON.parse(await readFile('data/cases.json', 'utf8'));
const ui = JSON.parse(await readFile('src/i18n.json', 'utf8'));
const cases = [...data.cases].sort((a, b) => Number(a.evidence === 'related') - Number(b.evidence === 'related'));
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const symbols = { creative: 'Aa', devtools: '</>', hardware: '⌁', games: '✳', apps: '↔', analysis: '{…}' };
const labels = { code: 'evidenceCode', report: 'evidenceReport', official: 'evidenceOfficial', related: 'evidenceRelated' };
const nativeLanguages = { zh: '中文', en: 'English', ja: '日本語', es: 'Español', fr: 'Français', ko: '한국어', de: 'Deutsch', pt: 'Português', ru: 'Русский' };
const languages = [...new Set(cases.map(c => c.language))];
const sourceLinks = entry => entry.sources.map(s => `<a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer">${escape(s.label)} <span aria-hidden="true">↗</span></a>`).join('');
const cards = cases.map(entry => `<article class="case-card category-${escape(entry.category)}" data-case="${entry.id}">
  <div class="card-visual"><span class="card-target">${escape(entry.target)}</span><span class="card-symbol" aria-hidden="true">${escape(symbols[entry.category])}</span></div>
  <div class="card-body"><div class="card-meta"><span data-category-label="${entry.category}">${escape(data.categories[entry.category].zh)}</span><span class="source-language" title="${escape(nativeLanguages[entry.language] || entry.language)}">${entry.language.toUpperCase()}</span></div>
  <h3 class="card-title" data-case-field="title">${escape(entry.title.zh)}</h3><p class="card-summary" data-case-field="summary">${escape(entry.summary.zh)}</p>
  <div class="tool-tags">${entry.tools.map(t => `<span>${escape(t)}</span>`).join('')}</div>
  <div class="card-evidence"><span class="evidence-dot ${entry.evidence}-dot" aria-hidden="true"></span><span data-i18n="${labels[entry.evidence]}">${ui.zh[labels[entry.evidence]]}</span></div></div>
  <div class="card-footer"><a class="card-author" href="${escape(entry.sources[0].url)}" target="_blank" rel="noopener noreferrer">${escape(entry.author)} ↗</a><a class="case-open" href="./cases/${entry.id}/" data-open="${entry.id}"><span data-i18n="readCase">${ui.zh.readCase}</span><span aria-hidden="true">↗</span></a></div>
</article>`).join('\n');
const categoryButtons = [['all', { zh: ui.zh.allCategories, en: ui.en.allCategories }], ...Object.entries(data.categories)].map(([id, label]) => `<button class="category-button" type="button" data-category="${id}" aria-pressed="${id === 'all'}"><span${id === 'all' ? ' data-i18n="allCategories"' : ` data-category-label="${id}"`}>${escape(label.zh)}</span><span>${cases.filter(c => id === 'all' || c.category === id).length}</span></button>`).join('');
const languageOptions = `<option value="all" data-i18n="allLanguages">${ui.zh.allLanguages}</option>` + languages.map(lang => `<option value="${lang}">${escape(nativeLanguages[lang] || lang)}</option>`).join('');
const payload = { ...data, cases, ui, nativeLanguages, labels };
let html = await readFile('src/index.html', 'utf8');
const replacements = { COUNT: cases.length, LANGUAGES: languages.length, UPDATED: data.updatedAt, CARDS: cards, CATEGORIES: categoryButtons, LANGUAGE_OPTIONS: languageOptions, DATA: JSON.stringify(payload).replaceAll('<', '\\u003c') };
html = html.replace(/%%([A-Z_]+)%%/g, (_, key) => {
  if (!(key in replacements)) throw new Error(`Unknown template token: ${key}`);
  return replacements[key];
});
await mkdir('dist/assets', { recursive: true });
await writeFile('dist/index.html', html);
for (const file of ['styles.css', 'app.js', 'favicon.svg']) await copyFile(`src/${file}`, `dist/assets/${file}`);
await writeFile('dist/.nojekyll', '');
await copyFile('data/cases.json', 'dist/cases.json');

// Readable, shareable detail pages also work without JavaScript.
for (const entry of cases) {
  const sections = ['zh', 'en'].map(lang => `<section lang="${lang === 'zh' ? 'zh-CN' : 'en'}" class="dialog-section"><p class="eyebrow">${lang === 'zh' ? '中文摘要' : 'ENGLISH SUMMARY'}</p><h2>${escape(entry.title[lang])}</h2><p class="dialog-summary">${escape(entry.summary[lang])}</p><div class="dialog-section"><h3>${ui[lang].question}</h3><p>${escape(entry.question[lang])}</p></div><div class="dialog-section"><h3>${ui[lang].workflow}</h3><ol class="dialog-workflow">${entry.workflow[lang].map(s => `<li>${escape(s)}</li>`).join('')}</ol></div><div class="dialog-section outcome-box"><h3>${ui[lang].outcome}</h3><p>${escape(entry.outcome[lang])}</p></div><div class="dialog-section limit-box"><h3>${ui[lang].limitation}</h3><p>${escape(entry.limitation[lang])}</p></div></section>`).join('');
  const path = `dist/cases/${entry.id}`;
  await mkdir(path, { recursive: true });
  await writeFile(`${path}/index.html`, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(entry.target)} — Awesome REA</title><meta name="description" content="${escape(entry.summary.en)}"><link rel="canonical" href="https://jyjyxt.github.io/awesome-rea/cases/${entry.id}/"><link rel="stylesheet" href="../../assets/styles.css"><link rel="icon" href="../../assets/favicon.svg"></head><body><main class="wrap" style="max-width:760px;padding-block:36px"><a class="upstream-link" href="../../">← Awesome REA</a><p class="dialog-target" style="margin-top:30px">${escape(entry.target)} / ${escape(entry.author)} / ${entry.language.toUpperCase()}</p><h1>${escape(entry.title.zh)}</h1>${sections}<div class="dialog-section"><h2>原始来源 / Original sources</h2><div class="source-links">${sourceLinks(entry)}</div></div><p class="dialog-bottom">核对 / Checked ${entry.checkedAt} · ${ui.zh[labels[entry.evidence]]} / ${ui.en[labels[entry.evidence]]}</p></main></body></html>`);
}
const markdown = ['# REA 应用实例 / REA investigations', '', `来源核对日期：${data.updatedAt}。中英文均为编辑摘要；作者报告保留原有范围，本站未独立复现。`, '', '由 `data/cases.json` 生成。请编辑数据后运行 `npm run build`。', ''];
for (const entry of cases) {
  markdown.push(`## ${entry.target}`, '', `**${ui.zh[labels[entry.evidence]]} / ${ui.en[labels[entry.evidence]]}** · ${entry.author} · ${nativeLanguages[entry.language] || entry.language}`, '', entry.summary.zh, '', entry.summary.en, '', `- 结果：${entry.outcome.zh}`, `- 范围：${entry.limitation.zh}`, '', ...entry.sources.map(s => `- [${s.label}](${s.url})`), '', `[完整记录 / Full case](https://jyjyxt.github.io/awesome-rea/cases/${entry.id}/)`, '');
}
await writeFile('CASES.md', markdown.join('\n'));
const urls = ['https://jyjyxt.github.io/awesome-rea/', ...cases.map(c => `https://jyjyxt.github.io/awesome-rea/cases/${c.id}/`)];
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${escape(url)}</loc><lastmod>${data.updatedAt}</lastmod></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://jyjyxt.github.io/awesome-rea/sitemap.xml\n');
console.log(`Built dist/: ${cases.length} entries, static detail pages, bilingual UI, and source catalog.`);
