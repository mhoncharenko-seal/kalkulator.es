import test from 'node:test';
import assert from 'node:assert/strict';
import {calculatorCatalog,catalogTranslations,localizedCatalog} from '../catalog.mjs';
import {renderHome} from '../home.mjs';
import {locales,translations} from '../i18n.mjs';

test('catalog exposes only implemented tools as available routes',()=>{
 assert.equal(calculatorCatalog.length,7);
 assert.equal(new Set(calculatorCatalog.map(tool=>tool.id)).size,7);
 assert.deepEqual(calculatorCatalog.filter(tool=>tool.status==='available').map(tool=>tool.route),['pensiones']);
 assert.ok(calculatorCatalog.filter(tool=>tool.status==='planned').every(tool=>tool.route===null));
});

test('each locale has a complete catalog and no future-tool navigation',()=>{
 for(const lang of locales){
  const tools=localizedCatalog(lang);
  assert.equal(Object.keys(catalogTranslations[lang]).length,7);
  assert.ok(tools.every(tool=>tool.name&&tool.description));
  const html=renderHome(lang,translations[lang],false);
  assert.equal((html.match(/class="calculator-card /g)||[]).length,7);
  assert.equal((html.match(/type="button" disabled/g)||[]).length,6);
  assert.equal((html.match(/class="coming-stamp"/g)||[]).length,6);
  assert.equal((html.match(new RegExp(`href="/${lang}/pensiones/"`,'g'))||[]).length,1);
  for(const tool of tools.filter(tool=>tool.status==='planned')){
   assert.ok(html.includes(`<button class="calculator-card is-coming" data-calculator="${tool.id}" type="button" disabled>`));
  }
  assert.ok(!/[\u{1F1E6}-\u{1F1FF}]/u.test(html));
  assert.ok(!html.includes('undefined'));
  assert.ok(!/<script\b/.test(html));
 }
});

test('unsupported catalog language fails explicitly',()=>{
 assert.throws(()=>localizedCatalog('xx'),RangeError);
});
