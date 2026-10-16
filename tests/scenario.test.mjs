import test from 'node:test';
import assert from 'node:assert/strict';
import {simplifiedPeriods,simplifiedAmounts} from '../scenario.mjs';
import {evaluateEligibility,estimatePension,assessMinimum} from '../engine.mjs';
const data={spainYears:10,ukraineYears:20,recentSpainMonths:24,recentUkraineMonths:0,ageYears:67,retirementDate:'2026-10-16'};
test('whole contribution years and current age reach the engine without a fabricated birth date',()=>{
 const p=simplifiedPeriods(data,'2026-10-16');assert.equal(p.spainMonths,120);assert.equal(p.ukraineMonths,240);assert.equal(p.birthDate,undefined);
 const e=evaluateEligibility(p);assert.equal(e.status,'potential');assert.equal(e.ageMonths,804);assert.equal(e.ageApproximate,true);assert.equal(e.ageReached,true);
});
test('completed age leaves borderline retirement eligibility unresolved',()=>{
 const e=evaluateEligibility(simplifiedPeriods({...data,ageYears:66},'2026-10-16'));assert.equal(e.ageReached,false);assert.equal(e.ageBoundaryUncertain,true);
});
test('age input rejects missing age, fractions, missing reference date and retirement in the past',()=>{
 for(const change of [{ageYears:null},{ageYears:66.5},{ageAsOf:undefined},{retirementDate:'2026-10-15'}])assert.equal(evaluateEligibility({...simplifiedPeriods(data,'2026-10-16'),...change}).status,'invalid');
});
test('future age advances using the planned retirement date',()=>{
 const e=evaluateEligibility(simplifiedPeriods({...data,ageYears:65,retirementDate:'2028-10-16'},'2026-10-16'));assert.equal(e.ageMonths,804);assert.equal(e.ageReached,true);
});
test('payroll contribution base is explicitly converted and Ukrainian euros are annualized over twelve months',()=>{
 const p=simplifiedPeriods(data,'2026-10-16'),eligibility=evaluateEligibility(p),amount=simplifiedAmounts(1400,80);
 assert.equal(amount.nationalBase,1200);assert.equal(amount.treatyBase,1200);assert.equal(amount.ukrainePayments,12);assert.equal(amount.exchangeRate,1);
 const r=estimatePension({...p,...amount,eligibility,year:2026});/* 50 + 49×0.21 + 131×0.19 = 85.18%; 1200×85.18%×10/30. */ assert.ok(Math.abs(r.best-340.72)<1e-8);assert.equal(r.ukraine.annual,960);assert.ok(Math.abs(r.totalAnnual-5730.08)<1e-8);
 const c=assessMinimum({residentSpain:false,annualOtherIncome:0,annualSpanish:r.spanish.annual,annualUkraine:r.ukraine.annual});assert.equal(c.annual,0);assert.ok(Math.abs((r.totalAnnual+c.annual)/12-477.5066666667)<1e-8);
});
test('empty and invalid amounts cannot silently become zero pensions or calculation bases',()=>{
 for(const values of [[null,80],[0,80],[1400,-1],[NaN,80]])assert.equal(simplifiedAmounts(...values),null);
 assert.equal(simplifiedAmounts(1400,0).ukraineAmount,0);
});
