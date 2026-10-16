import {renderHome,homeTranslations} from '../home.mjs';
import fs from 'node:fs';
import {translations,locales,localeNames} from '../i18n.mjs';
const production=process.argv.includes('--production');
const origin='https://kalkulator.es';
fs.rmSync('dist',{recursive:true,force:true});
fs.mkdirSync('dist',{recursive:true});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const lang of locales){const t=translations[lang];let html=fs.readFileSync('index.html','utf8').replace('lang="es"',`lang="${lang}"`).replace('<title>Kalkulator.es</title>',`<title>${escape(t.metaTitle)}</title>`).replace('content="Comprende tu jubilación entre España y Ucrania."',`content="${escape(t.metaDescription)}"`).replace(/(<([a-z0-9]+)[^>]*data-t="([^"]+)"[^>]*>)[\s\S]*?<\/\2>/g,(_,open,tag,key)=>{if(!t[key])throw Error('Missing '+lang+':'+key);return open+escape(t[key])+`</${tag}>`;}).replace('Ir al contenido',escape(t.skip)).replace('aria-label="Language"',`aria-label="${escape(t.language)}"`);html=html.replace(`href="/${lang}/">${localeNames[lang]}</a>`, `href="/${lang}/" aria-current="page">${localeNames[lang]}</a>`);html=html.replace('<div id="faq"></div>', '<div id="faq">'+[1,2,3].map(i=>`<details><summary>${escape(t[`faq${i}q`])}</summary><p>${escape(t[`faq${i}a`])}</p></details>`).join('')+'</div>');html=html.replace('</head>',`<link rel="canonical" href="${origin}/${lang}/">${locales.map(l=>`<link rel="alternate" hreflang="${l}" href="${origin}/${l}/">`).join('')}<link rel="alternate" hreflang="x-default" href="${origin}/es/"><meta name="robots" content="${production?'index,follow':'noindex,nofollow'}"></head>`);html=html.replace(/https:\/\/kalkulator.es\/(es|uk|en|ru)\//g,'https://kalkulator.es/$1/pensiones/').replace(/href="\/(es|uk|en|ru)\/"(?=[^>]*>)/g,(match,l)=>match.replace(`/${l}/`,`/${l}/pensiones/`));
html=html.replace(/(<a class="brand"[^>]*href=")[^"]+/g,`$1/${lang}/`).replace('<main id="main">',`<main id="main"><a class="back-to-menu" data-t="allCalculators" href="/${lang}/">← ${escape(homeTranslations[lang].back)}</a>`);
fs.mkdirSync(`dist/${lang}/pensiones`,{recursive:true});fs.writeFileSync(`dist/${lang}/pensiones/index.html`,html);fs.writeFileSync(`dist/${lang}/index.html`,renderHome(lang,t,production));}
for(const file of ['base-regulator.mjs','scenario.mjs','app.mjs','engine.mjs','normative.mjs','i18n.mjs','style.css','mark.svg'])fs.copyFileSync(file,`dist/${file}`);
// Keep private drafts out of the distributable. Only public methodology is copied.
fs.mkdirSync('dist/docs',{recursive:true});
for (const file of fs.readdirSync('docs')) if(file.endsWith('.md')&&!/draft|borrador/i.test(file)) fs.copyFileSync(`docs/${file}`,`dist/docs/${file}`);
fs.writeFileSync('dist/docs/.htaccess','<IfModule mod_headers.c>\nHeader set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n');
fs.writeFileSync('dist/index.html','<!doctype html><html lang="es"><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/es/"><title>Kalkulator.es</title><a href="/es/">Kalkulator.es</a></html>');
fs.writeFileSync('dist/robots.txt',production?`User-agent: *\nAllow: /\nDisallow: /docs/\nDisallow: /blog/drafts/\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
fs.writeFileSync('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${production?locales.flatMap(l=>['','pensiones/'].map(route=>`<url><loc>${origin}/${l}/${route}</loc></url>`)).join(''):''}</urlset>`);
fs.writeFileSync('dist/.htaccess','DirectoryIndex index.html\nAddType text/javascript .mjs\n<IfModule mod_headers.c>\nHeader set X-Content-Type-Options "nosniff"\nHeader set Referrer-Policy "strict-origin-when-cross-origin"\nHeader set Content-Security-Policy "default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; connect-src \'none\'; object-src \'none\'; base-uri \'self\'; frame-ancestors \'none\'; form-action \'none\'"\n</IfModule>\n');
console.log('Built dist: '+(production?'production':'preview/noindex'));
