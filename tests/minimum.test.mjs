import test from 'node:test';
import assert from 'node:assert/strict';
import {minimumMonthly2026} from '../normative.mjs';
import {assessMinimum,normalizePension} from '../engine.mjs';
const scenario={residentSpain:true,annualOtherIncome:0,annualSpanish:500*14,annualUkraine:80*12,minimumAnnual:936.2*14,incomeLimit:9442,complementCapAnnual:8803.2,estimateConfirmed:true};
test('all six minima and exact 65-year boundary',()=>{
 for(const [family,under,over] of [['single',875.9,936.2],['dependent',1256.6,1256.6],['nondependent',827.9,888.7]]){
  assert.equal(minimumMonthly2026(779,family),under);assert.equal(minimumMonthly2026(780,family),over);
 }
 assert.equal(minimumMonthly2026(800,'invalid'),null);assert.equal(minimumMonthly2026(NaN,'single'),null);
});
test('resident scenario combines Spanish 14 payments and Ukrainian 12 before calculating deficit',()=>{
 const r=assessMinimum(scenario);
 assert.equal(r.status,'conditional');assert.ok(Math.abs(r.annual-5146.8)<1e-8);
 assert.ok(Math.abs((scenario.annualSpanish+scenario.annualUkraine+r.annual)/12-1092.2333333333333)<1e-8);
});
test('residence, missing income, no Spanish pension and excess income do not fabricate a positive supplement',()=>{
 assert.equal(assessMinimum({...scenario,residentSpain:false}).annual,0);
 for(const change of [{residentSpain:null},{annualOtherIncome:null},{annualSpanish:0},{annualOtherIncome:9443}])assert.equal(assessMinimum({...scenario,...change}).annual,null);
 assert.equal(assessMinimum({...scenario,annualUkraine:20000}).annual,0);
});
test('annual cap can prevent reaching minimum and currency normalization is preserved',()=>{
 const r=assessMinimum({...scenario,annualSpanish:140,annualUkraine:0});
 assert.equal(r.annual,8803.2);assert.equal(r.capped,true);
 assert.equal(normalizePension(4000,12,.02).annual,960);
});
