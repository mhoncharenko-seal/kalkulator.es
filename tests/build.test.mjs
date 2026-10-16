import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {translations,locales} from '../i18n.mjs';
const root=path.resolve(import.meta.dirname,'..');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('isolated builds preserve translated form structure, assets, FAQ, SEO and exclude drafts',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'kalkulator-build-'));
 try {
  for(const name of fs.readdirSync(root))if(/\.(mjs|html|css|svg)$/.test(name))fs.copyFileSync(path.join(root,name),path.join(tmp,name));
  fs.cpSync(path.join(root,'scripts'),path.join(tmp,'scripts'),{recursive:true});
  fs.cpSync(path.join(root,'docs'),path.join(tmp,'docs'),{recursive:true});
  fs.mkdirSync(path.join(tmp,'blog/drafts'),{recursive:true});
  fs.writeFileSync(path.join(tmp,'blog/drafts/private.md'),'PRIVATE DRAFT');
  fs.writeFileSync(path.join(tmp,'docs/borrador-private.md'),'PRIVATE DRAFT');
  const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const fields=[...source.matchAll(/<(?:input|select|textarea)\b[^>]*name="([^"]+)"/g)].map(m=>m[1]);
  for(const production of [false,true]){
   const run=spawnSync(process.execPath,[path.join(tmp,'scripts/build.mjs'),...(production?['--production']:[])],{cwd:tmp,encoding:'utf8',env:{...process.env,KALKULATOR_ORIGIN:'https://preview.example.com'}});
   assert.equal(run.status,0,run.stderr);
   const dist=path.join(tmp,'dist');
   for(const lang of locales){
    const home=fs.readFileSync(path.join(dist,lang,'index.html'),'utf8');
    assert.ok(home.includes(`href="/${lang}/pensiones/"`));
    assert.equal((home.match(/type="button" disabled/g)||[]).length,6);
    assert.equal((home.match(/class="coming-stamp"/g)||[]).length,6);
    assert.ok(!home.includes('/app.mjs'));
    const h=fs.readFileSync(path.join(dist,lang,'pensiones','index.html'),'utf8');
    assert.ok(h.includes(`<html lang="${lang}">`));
    assert.equal([...h.matchAll(/aria-current="page"/g)].length,1);
    assert.ok(h.includes(`href="/${lang}/pensiones/" aria-current="page"`));
    assert.ok(h.includes(`<title>${escape(translations[lang].metaTitle)}</title>`));
    assert.ok(h.includes(`content="${escape(translations[lang].metaDescription)}"`));
    assert.ok(h.includes(`rel="canonical" href="${production?'https://kalkulator.es':'https://preview.example.com'}/${lang}/pensiones/"`));
    assert.ok(home.includes(`rel="canonical" href="${production?'https://kalkulator.es':'https://preview.example.com'}/${lang}/"`));
    assert.ok(h.includes('editorial-title'));
    const schema=JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema['@graph'][0]['@type'],'WebApplication');
    assert.equal(schema['@graph'][1]['@type'],'BreadcrumbList');
    assert.ok(h.includes('property="og:url"'));
    for(const alternate of [...locales,'x-default'])assert.ok(h.includes(`hreflang="${alternate}"`));
    assert.ok(h.includes(`content="${production?'index,follow':'noindex,nofollow'}"`));
    assert.deepEqual([...h.matchAll(/<(?:input|select|textarea)\b[^>]*name="([^"]+)"/g)].map(m=>m[1]),fields);
    for(const m of h.matchAll(/<([a-z0-9]+)[^>]*data-t="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g))assert.equal(m[3],escape(translations[lang][m[2]]),`${lang}: ${m[2]}`);
    for(let i=1;i<=3;i++)for(const suffix of ['q','a'])assert.ok(h.includes(escape(translations[lang][`faq${i}${suffix}`])));
    for(const asset of h.matchAll(/(?:src|href)="\/([^"?#]+\.(?:mjs|css|svg))"/g))assert.ok(fs.existsSync(path.join(dist,asset[1])),asset[1]);
   }
   for(const file of fs.readdirSync(dist).filter(f=>f.endsWith('.mjs'))){
    const code=fs.readFileSync(path.join(dist,file),'utf8');
    for(const dependency of code.matchAll(/from\s+['"]\.\/([^'"]+)['"]/g))assert.ok(fs.existsSync(path.join(dist,dependency[1])),`${file}: ${dependency[1]}`);
   }
   assert.ok(!fs.existsSync(path.join(dist,'blog/drafts/private.md')));
   assert.ok(fs.readFileSync(path.join(dist,'docs/.htaccess'),'utf8').includes('X-Robots-Tag "noindex, nofollow"'));
   assert.ok(!fs.existsSync(path.join(dist,'docs/borrador-private.md')));
   assert.ok(!fs.existsSync(path.join(dist,'docs/despliegue.md')));
   assert.ok(!fs.existsSync(path.join(dist,'docs/revision-normativa-2026-10-16.md')));
   const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
   assert.equal([...sitemap.matchAll(/<loc>/g)].length,production?8:0);
   assert.ok(!/draft|borrador|docs\//.test(sitemap));
   assert.ok(fs.readFileSync(path.join(dist,'robots.txt'),'utf8').includes(production?'Sitemap: https://kalkulator.es/sitemap.xml':'Disallow: /'));
  }
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});

// Exercise the client language refresh without a browser dependency.
test('language navigation refreshes editorial and sharing metadata',async()=>{
 const {updatePageLanguage}=await import('../pension-content.mjs');
 for(const lang of locales){
  const nodes=new Map([
   ['.editorial',{}],['.back-to-menu',{}],
   ['link[rel="canonical"]',{href:`https://preview.example.com/${lang}/pensiones/`}],
   ['script[type="application/ld+json"]',{textContent:JSON.stringify({'@graph':[{'@type':'WebApplication'},{'@type':'BreadcrumbList'}]})}],
   ...['meta[property="og:title"]','meta[property="og:description"]','meta[property="og:url"]','meta[name="twitter:title"]','meta[name="twitter:description"]'].map(k=>[k,{}])
  ]);
  updatePageLanguage(lang,translations[lang],{querySelector:selector=>nodes.get(selector)});
  assert.ok(nodes.get('.editorial').outerHTML.includes(`href="/${lang}/"`));
  assert.equal(nodes.get('meta[property="og:title"]').content,translations[lang].metaTitle);
  assert.equal(nodes.get('meta[name="twitter:description"]').content,translations[lang].metaDescription);
  assert.equal(nodes.get('meta[property="og:url"]').content,`https://preview.example.com/${lang}/pensiones/`);
  const graph=JSON.parse(nodes.get('script[type="application/ld+json"]').textContent)['@graph'];
  assert.equal(graph[0].inLanguage,lang);
  assert.equal(graph[1].itemListElement[0].item,`https://preview.example.com/${lang}/`);
 }
});
