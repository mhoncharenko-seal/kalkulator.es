import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateEligibility as evaluate,retirementAge,pensionPercentage,estimatePension,normalizePension,assessMinimum} from '../engine.mjs';
const base={birthDate:'1960-01-01',retirementDate:'2027-01-01',spainMonths:120,ukraineMonths:120,overlapMonths:0,recentSpainMonths:12,recentUkraineMonths:12,referenceConfirmed:true};
test('general qualifying period below, at, above 15 years',()=>{
 for(const [u,status] of [[59,'insufficient'],[60,'potential'],[61,'potential']]) assert.equal(evaluate({...base,ukraineMonths:u}).status,status);
});
test('specific period includes Ukraine, does not require final two years in Spain',()=>{
 assert.equal(evaluate({...base,recentSpainMonths:0,recentUkraineMonths:24}).status,'potential');
 assert.equal(evaluate({...base,recentSpainMonths:0,recentUkraineMonths:23}).status,'insufficient');
 assert.equal(evaluate({...base,referenceConfirmed:false}).status,'needs-review');
});
test('under one Spanish year needs institutional check',()=>assert.equal(evaluate({...base,spainMonths:11,ukraineMonths:240,recentSpainMonths:0,recentUkraineMonths:24}).status,'needs-review'));
test('overlap never counted twice, including recent periods',()=>{
 const e=evaluate({...base,spainMonths:120,ukraineMonths:60,overlapMonths:12});
 assert.equal(e.totalMonths,168);assert.equal(e.status,'insufficient');
 assert.equal(evaluate({...base,overlapMonths:1,recentOverlapMonths:1}).status,'insufficient');
});
test('national and totalization independently qualified',()=>{
 assert.equal(evaluate(base).nationalEligible,false); assert.equal(evaluate(base).treatyEligible,true);
 const e=evaluate({...base,spainMonths:180,recentSpainMonths:24});assert.equal(e.nationalEligible,true);
});
test('year-specific ordinary ages and age gate',()=>{
 assert.equal(retirementAge(2026,458),802);assert.equal(retirementAge(2026,459),780);
 assert.equal(retirementAge(2027,461),804);assert.equal(retirementAge(2035,462),780);
 assert.equal(evaluate({...base,birthDate:'1965-01-01'}).ageReached,false);
 assert.equal(evaluate({...base,birthDate:'1958-01-01'}).ageReached,true);
});
test('independent hand-calculated percentage examples and maximum',()=>{
 assert.equal(pensionPercentage(2026,180),50);assert.equal(pensionPercentage(2026,229),60.29);
 assert.equal(pensionPercentage(2026,438),100);assert.equal(pensionPercentage(2027,444),100);
 assert.ok(Math.abs(pensionPercentage(2027,240)-61.4)<1e-10);
});
test('national versus treaty chooses higher Spanish result; does not compare Ukrainian alternatives',()=>{
 const e=evaluate({...base,spainMonths:180,recentSpainMonths:24});
 const p=estimatePension({eligibility:e,year:2027,spainMonths:180,ukraineMonths:120,nationalBase:1200,treatyBase:1200,ukraineAmount:100,ukrainePayments:12});
 assert.equal(p.national,600);assert.ok(Math.abs(p.theoretical-873.6)<1e-8);assert.ok(Math.abs(p.treaty-524.16)<1e-8);
 assert.equal(p.best,600);assert.equal(p.totalAnnual,9600);assert.equal(p.internationalComparisonComplete,false);
});
test('treaty cap prevents diluting ratio beyond full pension',()=>{
 const e=evaluate({...base,spainMonths:240,ukraineMonths:360,recentSpainMonths:24});
 const p=estimatePension({eligibility:e,year:2027,spainMonths:240,ukraineMonths:360,treatyBase:1000});
 assert.equal(p.treatyMonths,444);assert.ok(Math.abs(p.treaty-1000*240/444)<1e-8);assert.equal(p.best,null);
});
test('12/14 payments normalized to annual equivalent',()=>{
 assert.equal(normalizePension(1000,14).monthly12,14000/12);
 assert.equal(normalizePension(1000,12).annual,12000);assert.equal(normalizePension(4000,12,.02).annual,960);
});
test('minimum is excluded for residence/income, never an automatic top-up',()=>{
 assert.equal(assessMinimum({residentSpain:false}).annual,0);
 assert.equal(assessMinimum({annualOtherIncome:10001,incomeLimit:10000}).status,'needs-review');
 assert.equal(assessMinimum({incomeExclusionConfirmed:true}).annual,0);
 assert.equal(assessMinimum({annualSpanish:2000,annualUkraine:18000,minimumAnnual:15000}).status,'not-needed');
 const r=assessMinimum({residentSpain:true,annualOtherIncome:0,annualSpanish:2000,annualUkraine:1000,minimumAnnual:15000,complementCapAnnual:8000});
 assert.equal(r.annual,null);assert.equal(r.capAnnual,8000);
});
test('invalid and missing data do not yield fabricated amounts',()=>{
 assert.equal(evaluate({...base,spainMonths:-1}).status,'invalid');
 assert.equal(evaluate({...base,birthDate:'1960-02-31'}).status,'invalid');
 assert.equal(evaluate({...base,recentUkraineMonths:null}).status,'needs-review');
 assert.equal(estimatePension({eligibility:evaluate(base),year:2027,spainMonths:120,ukraineMonths:120}).best,null);
 assert.equal(evaluate({...base,spainMonths:120.5}).status,'invalid');
 assert.equal(evaluate({...base,recentOverlapMonths:1}).status,'invalid');
});
test('economic amounts respect national and treaty ordinary ages independently',()=>{
 const e=evaluate({...base,birthDate:'1962-01-01',spainMonths:240,ukraineMonths:240,recentSpainMonths:24});
 assert.equal(e.ageReached,true);assert.equal(e.nationalAgeReached,false);
 const p=estimatePension({eligibility:e,year:2027,spainMonths:240,ukraineMonths:240,nationalBase:1000,treatyBase:1000});
 assert.equal(p.national,null);assert.ok(p.best>0);
 const young=evaluate({...base,birthDate:'1965-01-01'});
 assert.equal(estimatePension({eligibility:young,year:2027,spainMonths:120,ukraineMonths:120,treatyBase:1000}).best,null);
});
test('under one Ukrainian year requires confirmation of no Ukrainian own right',()=>{
 const e=evaluate({...base,spainMonths:240,ukraineMonths:6,recentSpainMonths:24,recentUkraineMonths:0});
 const i={eligibility:e,year:2027,spainMonths:240,ukraineMonths:6,treatyBase:1000};
 assert.equal(estimatePension(i).treaty,null);
 assert.ok(estimatePension({...i,ukraineUnderOneYearNoRightConfirmed:true}).treaty>0);
});
test('pending Ukrainian short-period branch blocks declaring national result best',()=>{
 const e=evaluate({...base,spainMonths:240,ukraineMonths:6,recentSpainMonths:24,recentUkraineMonths:0});
 const p=estimatePension({eligibility:e,year:2027,spainMonths:240,ukraineMonths:6,nationalBase:1000,treatyBase:1000});
 assert.equal(p.best,null);assert.ok(p.reasons.includes('ukraine-under-one-year-review'));
});
test('unconfirmed allocation of overlapping months blocks economic comparison',()=>{
 const e=evaluate({...base,overlapMonths:12});
 const p=estimatePension({eligibility:e,year:2027,spainMonths:120,ukraineMonths:120,overlapMonths:12,treatyBase:1000});
 assert.equal(p.status,'incomplete');assert.equal(p.best,null);assert.ok(p.reasons.includes('overlap-allocation-review'));
 assert.ok(estimatePension({eligibility:e,year:2027,spainMonths:120,ukraineMonths:120,overlapMonths:12,treatyBase:1000,overlapAllocationConfirmed:true}).best>0);
});
test('2026 maximum review blocks unbounded pensions; future maximum is explicit',()=>{
 const e=evaluate({...base,birthDate:'1955-01-01',retirementDate:'2026-01-01',spainMonths:438,ukraineMonths:120,recentSpainMonths:24});
 const p=estimatePension({eligibility:e,year:2026,spainMonths:438,ukraineMonths:120,nationalBase:4000,treatyBase:4000});
 assert.equal(p.best,null);assert.ok(p.reasons.includes('maximum-review'));assert.equal(p.beforeMaximumCap,false);
 const future=estimatePension({eligibility:evaluate(base),year:2027,spainMonths:120,ukraineMonths:120,treatyBase:1000});
 assert.equal(future.beforeMaximumCap,true);
});
test('impossible credited duration is rejected',()=>{
 assert.equal(evaluate({...base,spainMonths:720,ukraineMonths:720}).status,'invalid');
 assert.equal(estimatePension({eligibility:evaluate(base),year:2028,spainMonths:120,ukraineMonths:120,treatyBase:1000}).status,'invalid');
});

test('recent periods must form a possible common fifteen-year window',()=>{
 assert.equal(evaluate({...base,spainMonths:240,ukraineMonths:240,recentSpainMonths:120,recentUkraineMonths:120}).status,'invalid');
 assert.equal(evaluate({...base,overlapMonths:120,recentSpainMonths:120,recentUkraineMonths:0}).status,'invalid');
 assert.equal(evaluate({...base,spainMonths:240,ukraineMonths:240,overlapMonths:60,recentSpainMonths:120,recentUkraineMonths:120,recentOverlapMonths:60}).status,'potential');
});
test('a result cannot be reused with a different country distribution',()=>{
 const e=evaluate(base);
 assert.equal(estimatePension({eligibility:e,year:2027,spainMonths:180,ukraineMonths:60,nationalBase:1000,treatyBase:1000}).status,'invalid');
});
test('normalization rejects invalid currency, payments and overflow',()=>{
 for(const args of [[1000,0,1],[1000,15,1],[1000,12,0],[-1,12,1],[1000,12,Infinity],[Number.MAX_VALUE,14,1]]) assert.equal(normalizePension(...args),null);
});

test('economic invalid data are rejected rather than silently ignored',()=>{
 const i={eligibility:evaluate(base),year:2027,spainMonths:120,ukraineMonths:120,treatyBase:1000};
 for(const extra of [{treatyBase:-1},{nationalBase:Infinity},{treatyBase:Number.MAX_VALUE},{ukraineAmount:100,exchangeRate:0},{ukraineAmount:100,ukrainePayments:0}]) assert.equal(estimatePension({...i,...extra}).status,'invalid');
});

test('treaty can increase Spain payment: neither branch is presumed superior',()=>{
 const e=evaluate({...base,spainMonths:180,recentSpainMonths:24});
 const p=estimatePension({eligibility:e,year:2027,spainMonths:180,ukraineMonths:120,nationalBase:1000,treatyBase:2000});
 assert.equal(p.national,500);
 // 25 years: (50 + 120 × .19)% × EUR 2000 × (180 / 300).
 assert.ok(Math.abs(p.treaty-873.6)<1e-8);assert.equal(p.best,p.treaty);
});
test('Ukraine recent contributions establish treaty right without a national right',()=>{
 const e=evaluate({...base,spainMonths:180,recentSpainMonths:0,recentUkraineMonths:24});
 assert.equal(e.nationalEligible,false);assert.equal(e.treatyEligible,true);
 const p=estimatePension({eligibility:e,year:2027,spainMonths:180,ukraineMonths:120,treatyBase:1000});
 assert.equal(p.national,null);assert.ok(Math.abs(p.best-436.8)<1e-8);
});
test('confirmed sub-year Ukraine exception removes proration, not percentage calculation',()=>{
 const e=evaluate({...base,spainMonths:240,ukraineMonths:6,recentSpainMonths:24,recentUkraineMonths:0});
 const p=estimatePension({eligibility:e,year:2027,spainMonths:240,ukraineMonths:6,nationalBase:1000,treatyBase:1000,ukraineUnderOneYearNoRightConfirmed:true});
 assert.equal(p.fraction,1);assert.ok(Math.abs(p.treaty-625.4)<1e-8);assert.equal(p.best,p.treaty);
});
test('empty calls and invalid minimum inputs do not manufacture outcomes',()=>{
 assert.equal(evaluate().status,'invalid');assert.equal(estimatePension().status,'invalid');
 assert.equal(assessMinimum().status,'needs-review');
 for(const extra of [{annualUkraine:-1},{annualSpanish:Infinity},{minimumAnnual:NaN},{complementCapAnnual:-1}]) assert.equal(assessMinimum(extra).status,'invalid');
});
test('an entirely Spanish history does not require a hypothetical treaty base',()=>{
 const e=evaluate({...base,spainMonths:180,ukraineMonths:0,recentSpainMonths:24,recentUkraineMonths:0});
 const p=estimatePension({eligibility:e,year:2027,spainMonths:180,ukraineMonths:0,nationalBase:1000});
 assert.equal(p.best,500);assert.equal(p.treaty,null);assert.equal(p.comparable,true);
});
