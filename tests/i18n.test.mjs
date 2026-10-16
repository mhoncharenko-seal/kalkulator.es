import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {translations,locales,localeNames,intlLocales} from '../i18n.mjs';

test('four locales have identical, nonempty translation keys',()=>{
 assert.deepEqual(locales,['es','ru','uk','en']);
 const reference=Object.keys(translations.es).sort();
 for(const locale of locales){
  assert.deepEqual(Object.keys(translations[locale]).sort(),reference,locale);
  for(const [key,value] of Object.entries(translations[locale]))assert.ok(typeof value==='string'&&value.trim(),`${locale}: ${key}`);
  assert.ok(localeNames[locale]);
  assert.doesNotThrow(()=>new Intl.NumberFormat(intlLocales[locale]).format(1234.56));
 }
});
test('all template and literal runtime translation calls resolve in every locale',()=>{
 const html=fs.readFileSync('index.html','utf8'),app=fs.readFileSync('app.mjs','utf8');
 const keys=[...html.matchAll(/data-t="([^"]+)"/g),...app.matchAll(/\b(?:t|row)\('([^']+)'/g)].map(m=>m[1]);
 for(const locale of locales)for(const key of keys)assert.ok(translations[locale][key],`${locale}: ${key}`);
 for(const locale of locales)for(let i=1;i<=3;i++)for(const suffix of ['q','a'])assert.ok(translations[locale][`faq${i}${suffix}`]);
});
test('language navigation keeps the requested order without flags',()=>{
 const html=fs.readFileSync('index.html','utf8');
 const nav=html.match(/<nav id="languages"[^>]*>([\s\S]*?)<\/nav>/)[1];
 assert.deepEqual([...nav.matchAll(/href="\/([^/]+)\/"/g)].map(m=>m[1]),locales);
 assert.ok(!/[🇦-🇿]/u.test(nav));
});
test('dynamic result states and generated minimum form have translated messages',()=>{
 const dynamic=['eligible','missing','unknown','ageReached','agePending','minimumExcluded','minimumNotNeeded','incomeReview','minimumReview'];
 for(const locale of locales)for(const key of dynamic)assert.ok(translations[locale][key],`${locale}: ${key}`);
 // Long untranslated Spanish messages should not silently survive in another locale.
 for(const locale of locales.filter(x=>x!=='es'))for(const [key,value] of Object.entries(translations[locale])){
  if(value.length>35)assert.notEqual(value,translations.es[key],`${locale}: Spanish fallback in ${key}`);
 }
});
