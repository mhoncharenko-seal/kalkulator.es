import {simulateMinimum} from './minimum-simulation.mjs';
import {renderComparison} from './comparison-view.mjs';
import {composition,estimatePublicMinimum} from './pension-result.mjs';
import {updatePageLanguage} from './pension-content.mjs';
import {minimumMonthly2026} from './normative.mjs';
import {translations,locales,intlLocales} from './i18n.mjs';
import {evaluateEligibility,estimatePension,assessMinimum} from './engine.mjs';
import {simplifiedPeriods,simplifiedAmounts} from './scenario.mjs';
let lang=location.pathname.split('/')[1];if(!locales.includes(lang))lang='es';
let current=null,periods=null,lastMoney=null,lastMinimum=null,wizardStep=1,refined=false;
const $=s=>document.querySelector(s),t=k=>translations[lang][k]??k;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=v=>v==null?t('notAvailable'):new Intl.NumberFormat(intlLocales[lang],{style:'currency',currency:'EUR'}).format(v);
const num=v=>new Intl.NumberFormat(intlLocales[lang],{maximumFractionDigits:2}).format(v);
const row=(key,value)=>`<div class="row ${key==='ukrainePart'?'ukraine-result':''}"><span>${esc(t(key))}</span><strong>${esc(value)}</strong></div>`;
const stepNames=['stepSpain','stepUkraine','stepAge','stepBase','stepUkrainePension','stepFamily','stepResolution'];
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
function values(form){return Object.fromEntries([...new FormData(form)].map(([k,v])=>[k,form.elements[k].type==='number'?(v===''?null:Number(v)):v]));}
function translate(){
 document.querySelectorAll('.brand,.back-to-menu').forEach(a=>a.href=`/${lang}/`);
 document.documentElement.lang=lang;document.title=t('metaTitle');$('meta[name="description"]').content=t('metaDescription');
 const canonical=$('link[rel="canonical"]');if(canonical)canonical.href=new URL(`/${lang}/pensiones/`,canonical.href).href;
 document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));$('.skip').textContent=t('skip');$('#languages').setAttribute('aria-label',t('language'));
 document.querySelectorAll('#languages a').forEach(a=>{a.removeAttribute('aria-current');if(a.pathname===`/${lang}/pensiones/`)a.setAttribute('aria-current','page');});
 $('#faq').innerHTML=[1,2,3].map(i=>`<details><summary>${esc(t(`faq${i}q`))}</summary><p>${esc(t(`faq${i}a`))}</p></details>`).join('');
 updatePageLanguage(lang,translations[lang]);
 if(current)renderEligibility();if(current)renderMoney();showStep(wizardStep,false);
}
function renderEligibility(){
 const e=current,key=e.ageBoundaryUncertain?'ageApproximateReview':e.status==='potential'?(e.ageReached?'eligible':'agePending'):e.status==='insufficient'?'missing':'unknown';
 $('#result').innerHTML=`${lastMoney?'':`<h2 class="result-title ${e.status==='insufficient'?'informational-warning':''}">${esc(t(key))}</h2>`}<details ${lastMoney?'':'open'}><summary>${esc(t('eligibilityDetails'))}</summary>${lastMoney?`<p>${esc(t(key))}</p>`:''}${row('age',`${Math.floor(e.ordinaryAgeMonths/12)} ${t('years').toLowerCase()} ${e.ordinaryAgeMonths%12} ${t('months').toLowerCase()}`)}${row('totalYears',num(e.totalMonths/12))}${e.missingMonths?row('remaining',`${num(e.missingMonths/12)} ${t('years').toLowerCase()}`):''}${e.missingRecentMonths?row('recentMissing',`${e.missingRecentMonths} ${t('months').toLowerCase()}`):''}<p>${esc(t('ageAssumptions'))}</p><p>${esc(t('recentAssumptions'))}</p></details>`;
}
function renderMoney(){
 $('#money').innerHTML=renderComparison(lastMoney,lastMinimum,{t,money,num,year:current?.year})+`<section aria-labelledby="used-title"><h3 id="used-title">${esc(t('usedData'))}</h3><p>${esc(t(refined?'refinedAssumptions':'favourableAssumptions'))}</p>${lastMinimum?.used?row('family',t({single:'familySingle',dependent:'familyDependent',nondependent:'familyNonDependent'}[lastMinimum.used.family]))+row('usedIncome',money(lastMinimum.used.income)):''}</section>`+(lastMoney?`<details><summary>${esc(t('how'))}</summary>${row('nativeSpain',money(lastMoney.best))}${row('contributionBase',money(values($('#amount')).contributionBase))}<p>${esc(t('prorata'))}: ${num(lastMoney.fraction*100)}%.</p><p>${esc(t('baseApproximation'))}</p><p>${esc(t('averageBasis'))}</p></details>`:'')+`<p class="notice">${esc(t('disclaimer'))}</p><button class="secondary" id="print" type="button">${esc(t('print'))}</button><button class="secondary" id="download" type="button">${esc(t('download'))}</button>`;
 $('#print').onclick=()=>window.print();$('#download').onclick=()=>{const url=URL.createObjectURL(new Blob([$('#money').innerText+'\n\n'+$('#result').innerText],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`kalkulator-${lang}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
function calculateMinimum(){
 const v=values($('#minimum-form'));
 lastMinimum=simulateMinimum({result:lastMoney,eligibility:current,periods,detail:refined?v:null});
}
function refreshRefinement(){
 const f=$('#minimum-form'),v=values(f),spouse=v.family!=='single';
 $('#spouse-details').hidden=!spouse;
 f.elements.spouseIncome.closest('label').hidden=!spouse||v.family!=='dependent'||v.spousePension==='yes';
 f.elements.spousePensionAnnual.closest('label').hidden=!spouse||v.spousePension!=='yes';
 if(lastMoney){calculateMinimum();renderMoney();}
}
function setupWizard(){
 const panel=$('.form-panel');panel.insertAdjacentHTML('afterbegin','<p id="wizard-caption" aria-live="polite"></p><progress id="wizard-progress" max="6" value="1"></progress><h2 id="wizard-title" tabindex="-1"></h2>');
 const select=(name,key)=>`<label><span data-t="${key}"></span><select name="${name}"><option value="" data-t="unverified"></option><option value="yes" data-t="yes"></option><option value="no" data-t="no"></option></select></label>`;
 const number=(name,key)=>`<label><span data-t="${key}"></span><input name="${name}" type="number" min="0" step="0.01"></label>`;
 $('#money').insertAdjacentHTML('afterend',`<details id="refine-details" hidden><summary data-t="refineTitle"></summary><form id="minimum-form" novalidate><label><span data-t="family"></span><select name="family">${['single','dependent','nondependent'].map((value,i)=>`<option value="${value}" data-t="${['familySingle','familyDependent','familyNonDependent'][i]}"></option>`).join('')}</select></label><p data-t="incomeDetailHelp"></p>${number('income','ownIncome')}${number('otherPensions','otherPensions')}<div id="spouse-details" hidden>${select('cohabit','cohabit')}${select('spousePension','spousePension')}${number('spousePensionAnnual','spousePensionAnnual')}${number('spouseIncome','spouseIncome')}<p data-t="dependencyHelp"></p></div><button type="button" id="restore-basic" class="secondary" data-t="restoreBasic"></button></form></details>`);
 $('#minimum-form').addEventListener('input',()=>{refined=true;refreshRefinement();});
 $('#minimum-form').addEventListener('submit',e=>e.preventDefault());
 $('#restore-basic').onclick=()=>{$('#minimum-form').reset();refined=false;refreshRefinement();};
 const eligibility=$('#eligibility'),amount=$('#amount'),label=name=>document.querySelector(`[name="${name}"]`).closest('label');
 function screen(parent,step,nodes){const el=document.createElement('div');el.dataset.screen=step;for(const node of nodes)if(node)el.append(node);parent.append(el);return el;}
 for(const [i,country] of ['spain','ukraine'].entries())screen(eligibility,i+1,[label(country+'Years')]);
 const recent=$('#recent-fields');recent.hidden=false;const ageScreen=screen(eligibility,3,[label('ageYears'),label('retirementDate'),recent,$('#error')]); ageScreen.insertAdjacentHTML('beforeend','<p class="notice" data-t="periodAssumption"></p><p class="notice" data-t="periodReview"></p>');
 for(const el of eligibility.querySelectorAll('button,.step-caption'))el.hidden=true;$('#initial-fields').remove();
 $('#eligibility [name="retirementDate"]').min=today();
 const baseScreen=screen(amount,4,[label('contributionBase'),$('#base-help-link'),$('#base-help')]); baseScreen.insertAdjacentHTML('beforeend','<p class="notice" data-t="baseApproximation"></p>');
 const ukrainian=screen(amount,5,[label('ukraineAmount'),$('#amount-error')]);ukrainian.insertAdjacentHTML('beforeend','<p class="notice" data-t="missingUkraine"></p>');
 for(const el of amount.querySelectorAll(':scope > h2,:scope > .grid,:scope > button'))el.remove();
 // Result amount comes first, followed by the eligibility and calculation explanations.
 panel.insertBefore($('#money'),$('#result'));panel.insertBefore($('#refine-details'),$('#result'));
 $('#base-help-link').onclick=()=>{$('#base-help').open=true;};
 panel.insertAdjacentHTML('beforeend','<div class="wizard-actions"><button type="button" id="wizard-back" class="secondary" data-t="modify"></button><button type="button" id="wizard-next" class="primary" data-t="continue"></button><button type="button" id="wizard-reset" class="secondary" data-t="newQuery" hidden></button></div>');
 $('#wizard-next').onclick=advance;$('#wizard-back').onclick=()=>showStep(wizardStep===7?(lastMoney?5:3):wizardStep-1);
 $('#wizard-reset').onclick=()=>{for(const f of document.querySelectorAll('form'))f.reset();current=periods=lastMoney=lastMinimum=null;refined=false;$('#result').innerHTML='';$('#money').innerHTML='';document.querySelectorAll('.error').forEach(e=>e.textContent='');showStep(1);};
 for(const f of document.querySelectorAll('form:not(#minimum-form)')){f.addEventListener('submit',e=>{e.preventDefault();advance();});f.addEventListener('input',()=>{lastMoney=lastMinimum=null;$('#money').hidden=true;$('#result').hidden=true;document.querySelectorAll('.error').forEach(e=>e.textContent='');});}
 // Start with the user's own estimate, never a prefilled pension amount.
 $('#amount [name="ukraineAmount"]').placeholder='80';
}
function showStep(step,focus=true){
 wizardStep=step;for(const country of ['spain','ukraine']){const cap=Number($('[name="'+country+'Years"]').value);$('[name="recent'+country[0].toUpperCase()+country.slice(1)+'Years"]').max=Math.min(15,cap);}document.querySelectorAll('[data-screen]').forEach(el=>el.hidden=Number(el.dataset.screen)!==step);
 $('#eligibility').hidden=step>3;$('#amount').hidden=step<4||step>5;$('#result').hidden=step!==7;$('#money').hidden=step!==7;$('#refine-details').hidden=step!==7||!lastMoney;
 $('#wizard-caption').textContent=`${t('stepLabel')} ${step===7?6:step} / 6`;$('#wizard-progress').value=step===7?6:step;$('#wizard-progress').setAttribute('aria-label',t('stepLabel'));$('#wizard-title').textContent=t(stepNames[step-1]);
 $('#wizard-back').hidden=step===1;$('#wizard-next').hidden=step===7;$('#wizard-reset').hidden=step!==7;$('#wizard-next').textContent=t(step===5?'calculatePension':'continue');
 $('aside .eyebrow').textContent=`0${step===7?6:step} — 06`;$('#tool-title').textContent=t(stepNames[step-1]);$('aside [data-t="recentHelp"]').hidden=true;
 document.querySelectorAll('[data-minimum]').forEach(el=>el.textContent=current?.year===2026?`${money(minimumMonthly2026(current.ageMonths,el.dataset.minimum))} × 14`:t('minimum2026'));
 if(focus)$('#wizard-title').focus();
}
function advance(){
 const screen=document.querySelector(`[data-screen="${wizardStep}"]`);if(!screen)return;
 const invalid=[...screen.querySelectorAll('input,select,textarea')].find(el=>!el.disabled&&!el.checkValidity());if(invalid){invalid.reportValidity();return;}
 // Rebuild the monetary scenario after going back from the result to the family step.
 if(wizardStep===3){
  periods=simplifiedPeriods(values($('#eligibility')),today());current=evaluateEligibility(periods);lastMoney=lastMinimum=null;
  if(current.status==='invalid'){$('#error').textContent=t('invalid');return;}
  $('#error').textContent='';renderEligibility();if(current.status!=='potential'||!current.ageReached){renderMoney();showStep(7);return;}
 }else if(wizardStep===5||wizardStep===6){
  const v=values($('#amount')),amount=simplifiedAmounts(v.contributionBase,v.ukraineAmount);
  lastMoney=amount?estimatePension({...amount,...periods,year:current.year,eligibility:current}):null;
  if(lastMoney?.best==null){lastMoney=null;$('#amount-error').textContent=t('economicReview');showStep(5);return;}
  calculateMinimum();renderMoney();renderEligibility();showStep(7);return;
 }
 showStep(wizardStep+1);
}
document.querySelectorAll('#languages a').forEach(a=>a.addEventListener('click',event=>{event.preventDefault();lang=a.pathname.split('/')[1];history.pushState({},'',`/${lang}/pensiones/`);translate();}));
window.addEventListener('popstate',()=>{lang=location.pathname.split('/')[1];if(!locales.includes(lang))lang='es';translate();});
setupWizard();translate();showStep(1,false);
