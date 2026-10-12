import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile('data/cases.json', 'utf8'));
const ui = JSON.parse(await readFile('src/i18n.json', 'utf8'));
const date = /^\d{4}-\d{2}-\d{2}$/;
assert.match(data.updatedAt, date);
assert.deepEqual(Object.keys(ui.zh).sort(), Object.keys(ui.en).sort(), 'UI translations must match');
assert.ok(data.cases.length > 0, 'Collection cannot be empty');
const ids = new Set();
for (const entry of data.cases) {
  const context = `Case ${entry.id}`;
  assert.match(entry.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, context);
  assert.ok(!ids.has(entry.id), `Duplicate case: ${entry.id}`);
  ids.add(entry.id);
  assert.ok(data.categories[entry.category], `${context}: unknown category`);
  assert.ok(['code', 'report', 'official', 'related'].includes(entry.evidence), `${context}: unknown evidence type`);
  assert.match(entry.language, /^[a-z]{2,3}(?:-[A-Z]{2})?$/, `${context}: invalid source language`);
  assert.match(entry.checkedAt, date, context);
  assert.ok(entry.checkedAt <= data.updatedAt, `${context}: checked after collection update`);
  if (entry.publishedAt !== null) {
    assert.match(entry.publishedAt, date, context);
    assert.ok(entry.publishedAt <= entry.checkedAt, `${context}: publication after source check`);
  }
  for (const key of ['target', 'author']) assert.ok(entry[key]?.trim(), `${context}: missing ${key}`);
  assert.ok(entry.tools.length > 0 && entry.tools.every(t => typeof t === 'string' && t.trim()), `${context}: tools required`);
  for (const field of ['title', 'summary', 'question', 'outcome', 'limitation']) {
    for (const lang of ['zh', 'en']) assert.ok(entry[field]?.[lang]?.trim(), `${context}: missing ${field}.${lang}`);
  }
  for (const lang of ['zh', 'en']) {
    assert.ok(Array.isArray(entry.workflow[lang]) && entry.workflow[lang].length > 0, `${context}: workflow required`);
    assert.ok(entry.workflow[lang].every(step => typeof step === 'string' && step.trim()), `${context}: empty workflow step`);
  }
  assert.ok(entry.sources.length > 0, `${context}: original sources required`);
  for (const source of entry.sources) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:', `${context}: HTTPS source required`);
    assert.equal(url.username + url.password, '', `${context}: credentials in source URL`);
    assert.ok(source.label?.trim(), `${context}: source label required`);
    if (source.kind === 'x') assert.match(source.url, /^https:\/\/x\.com\/[\w]+\/status\/\d+$/, `${context}: canonical X URL required`);
  }
  if (entry.evidence === 'code') assert.ok(entry.sources.some(s => s.kind === 'code'), `${context}: public code link required`);
  if (entry.evidence === 'official') assert.ok(entry.sources.some(s => s.kind === 'official' && new URL(s.url).hostname === 'rea.tools'), `${context}: upstream case required`);
}
const template = await readFile('src/index.html', 'utf8');
for (const [, key] of template.matchAll(/data-i18n(?:-placeholder)?="([^"]+)"/g)) {
  assert.ok(ui.zh[key] && ui.en[key], `Missing UI translation: ${key}`);
}
console.log(`Validated ${ids.size} source-backed entries, ${new Set(data.cases.map(c => c.language)).size} original languages, and both UI translations.`);
