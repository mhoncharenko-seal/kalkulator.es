import test from 'node:test';
import assert from 'node:assert/strict';
import {simulateMinimum} from '../minimum-simulation.mjs';
import {compareScenarios} from '../pension-result.mjs';
import {renderComparison} from '../comparison-view.mjs';
import {translations,locales} from '../i18n.mjs';
const eligibility={status:'potential',ageReached:true,ageMonths:804,year:2026};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('low pension matrix respects the international supplement cap and reaches minimum only when possible',()=>{
 for(const [family,target,cap] of [['single',13106.8,8803.2],['nondependent',12441.8,8803.2],['dependent',17592.4,14965.44]]){
  for(const [es,ua] of [[80,0],[80,960],[1200,960],[target-cap,0],[7000,960],[20000,960]]){
   const result={spanish:{annual:es},ukraine:{annual:ua}};
   const minimum=simulateMinimum({result,eligibility,periods:{recentSpainMonths:24},detail:{family,income:0,otherPensions:0,cohabit:'yes',spousePension:'no',spouseIncome:0}});
   const expected=Math.min(Math.max(0,target-es-ua),cap),m=compareScenarios(result,minimum);
   near(minimum.annual,expected);near(m.withMinimum.total,es+ua+expected);near(m.withoutMinimum.total,es+ua);
   if(es+ua<target-cap-0.001)assert.ok(m.withMinimum.total<target);
   else if(es+ua<=target)near(m.withMinimum.total,target);
  }
 }
});
test('cap explanation is visible in the primary card in all four languages, absent for uncapped and pending cases',()=>{
 for(const lang of locales){
  const result={spanish:{annual:1200},ukraine:{annual:960}},opts={t:k=>translations[lang][k],money:v=>v.toFixed(2),num:String,year:2026};
  const minimum=simulateMinimum({result,eligibility,periods:{recentSpainMonths:24}});
  const html=renderComparison(result,minimum,opts),card=html.split('</section>')[0];
  assert.ok(card.includes(translations[lang].capExplanation));assert.ok(card.includes('2143.60'));assert.ok(card.includes('1092.23'));assert.ok(card.includes('8803.20'));
  assert.ok(!card.includes('<details'));assert.ok(!html.includes('undefined'));
  for(const m of [{annual:null},{annual:600,capped:false}])assert.ok(!renderComparison(result,m,opts).includes('minimum-cap-notice'));
 }
});
