import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {renderHome,homeTranslations} from '../home.mjs';
import {translations,locales,localeNames} from '../i18n.mjs';
import {calculatorCatalog,localizedCatalog} from '../catalog.mjs';
const production=process.argv.includes('--production');
const origin=production?'https://kalkulator.es':(process.env.KALKULATOR_ORIGIN||'http://localhost:4173').replace(/\/$/,'');
if(!/^https?:\/\/[^/?#]+$/.test(origin))throw Error('KALKULATOR_ORIGIN must be an HTTP(S) origin');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const active=calculatorCatalog.filter(m=>m.status==='available');
for(const m of active)if(!/^[a-z0-9-]+$/.test(m.route)||!m.template)throw Error('Active module requires a safe route and template');
if(new Set(active.map(m=>m.route)).size!==active.length)throw Error('Duplicate module routes');
function seo(html,lang,route,title,description,module){
 const url=`${origin}/${lang}/${route}`;
 const schema=module?{'@context':'https://schema.org','@graph':[{'@type':'WebApplication',name:title,description,url,inLanguage:lang,applicationCategory:'FinanceApplication',operatingSystem:'Any',isAccessibleForFree:true},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:homeTranslations[lang].back,item:`${origin}/${lang}/`},{'@type':'ListItem',position:2,name:module.name,item:url}]}]}:{'@context':'https://schema.org','@type':'CollectionPage',name:title,description,url,inLanguage:lang,mainEntity:{'@type':'ItemList',itemListElement:localizedCatalog(lang).filter(m=>m.status==='available').map((m,i)=>({'@type':'ListItem',position:i+1,name:m.name,url:`${origin}/${lang}/${m.route}/`}))}};
 html=html.replace(/<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>/g,'').replace(/<meta\b[^>]*name="robots"[^>]*>/g,'');
 return html.replace('</head>',`<meta name="robots" content="${production?'index,follow':'noindex,nofollow'}"><link rel="canonical" href="${url}">${locales.map(l=>`<link rel="alternate" hreflang="${l}" href="${origin}/${l}/${route}">`).join('')}<link rel="alternate" hreflang="x-default" href="${origin}/es/${route}"><meta property="og:type" content="website"><meta property="og:site_name" content="Kalkulator.es"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head>`);
}
fs.rmSync('dist',{recursive:true,force:true});fs.mkdirSync('dist',{recursive:true});
for(const lang of locales){
 const t=translations[lang];fs.mkdirSync(`dist/${lang}`,{recursive:true});
 fs.writeFileSync(`dist/${lang}/index.html`,seo(renderHome(lang,t,production),lang,'',homeTranslations[lang].meta,homeTranslations[lang].intro));
 for(const module of active){
  const localized=localizedCatalog(lang).find(m=>m.id===module.id);
  let html=fs.readFileSync(module.template,'utf8').replace('lang="es"',`lang="${lang}"`).replace(/<title>[^<]*<\/title>/,`<title>${escape(t.metaTitle)}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${escape(t.metaDescription)}">`).replace(/(<([a-z0-9]+)[^>]*data-t="([^"]+)"[^>]*>)[\s\S]*?<\/\2>/g,(_,open,tag,key)=>{if(!t[key])throw Error('Missing '+lang+':'+key);return open+escape(t[key])+`</${tag}>`;}).replace('Ir al contenido',escape(t.skip)).replace('aria-label="Language"',`aria-label="${escape(t.language)}"`);
  html=html.replace(/<nav id="languages"[\s\S]*?<\/nav>/,`<nav id="languages" aria-label="${escape(t.language)}">${locales.map(l=>`<a href="/${l}/${module.route}/"${l===lang?' aria-current="page"':''}>${localeNames[l]}</a>`).join('')}</nav>`);
  html=html.replace('<div id="faq"></div>','<div id="faq">'+[1,2,3].map(i=>`<details><summary>${escape(t[`faq${i}q`])}</summary><p>${escape(t[`faq${i}a`])}</p></details>`).join('')+'</div>');
  html=html.replace(/(<a class="brand"[^>]*href=")[^"]+/g,`$1/${lang}/`).replace('<main id="main">',`<main id="main"><a class="back-to-menu" href="/${lang}/">← ${escape(homeTranslations[lang].back)}</a>`);
  if(module.contentModule){const content=await import(pathToFileURL(path.resolve(module.contentModule)));html=html.replace('</main>',content.renderContent(lang)+'</main>');}
  html=seo(html,lang,`${module.route}/`,t.metaTitle,t.metaDescription,localized);
  fs.mkdirSync(`dist/${lang}/${module.route}`,{recursive:true});fs.writeFileSync(`dist/${lang}/${module.route}/index.html`,html);
 }
}
const copied=new Set();
function copyAsset(file){
 if(copied.has(file))return;copied.add(file);
 if(path.isAbsolute(file)||file.startsWith('..'))throw Error('Asset outside project');
 fs.mkdirSync(path.dirname(`dist/${file}`),{recursive:true});fs.copyFileSync(file,`dist/${file}`);
 if(file.endsWith('.mjs'))for(const match of fs.readFileSync(file,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.\.?\/[^'"]+)['"]/g))copyAsset(path.normalize(path.join(path.dirname(file),match[1])));
}
for(const file of ['app.mjs','style.css','mark.svg'])copyAsset(file);
// Explicit allowlist: internal operational and audit reports never ship.
fs.mkdirSync('dist/docs',{recursive:true});
for(const file of ['normativa.md','revision-publica.md'])if(fs.existsSync(`docs/${file}`))fs.copyFileSync(`docs/${file}`,`dist/docs/${file}`);
fs.writeFileSync('dist/docs/.htaccess','<IfModule mod_headers.c>\nHeader set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n');
fs.writeFileSync('dist/index.html','<!doctype html><html lang="es"><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/es/"><title>Kalkulator.es</title><a href="/es/">Kalkulator.es</a></html>');
fs.writeFileSync('dist/robots.txt',production?`User-agent: *\nAllow: /\nDisallow: /docs/\nDisallow: /blog/drafts/\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
fs.writeFileSync('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${production?locales.flatMap(l=>['',...active.map(m=>`${m.route}/`)].map(route=>`<url><loc>${origin}/${l}/${route}</loc></url>`)).join(''):''}</urlset>`);
fs.writeFileSync('dist/.htaccess','DirectoryIndex index.html\nAddType text/javascript .mjs\n<IfModule mod_headers.c>\nHeader set X-Content-Type-Options "nosniff"\nHeader set Referrer-Policy "strict-origin-when-cross-origin"\nHeader set Content-Security-Policy "default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; connect-src \'none\'; object-src \'none\'; base-uri \'self\'; frame-ancestors \'none\'; form-action \'none\'"\n</IfModule>\n');
console.log(`Built dist: ${production?'production':'preview/noindex'} at ${origin}`);
