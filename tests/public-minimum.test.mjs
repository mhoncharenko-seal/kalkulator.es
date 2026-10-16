import test from 'node:test';
import assert from 'node:assert/strict';
import {estimatePublicMinimum,composition} from '../pension-result.mjs';
const input={year:2026,ageMonths:804,family:'single',residentSpain:true,annualOtherIncome:0,annualSpanish:1200,annualUkraine:960,scopeConfirmed:true,incomeConfirmed:true,scenarioConfirmed:true};
test('confirmed resident scenario includes capped supplement in main total and chart',()=>{
 const c=estimatePublicMinimum(input),m=composition({spanish:{annual:1200},ukraine:{annual:960}},c);
 assert.equal(c.status,'conditional');assert.equal(c.annual,8803.2);assert.equal(c.capped,true);
 assert.ok(Math.abs(m.total/12-913.6)<1e-8);assert.equal(m.amounts.filter(x=>x>0).length,3);
});
test('missing scope, income or scenario confirmation never fabricates positive supplement',()=>{
 for(const key of ['scopeConfirmed','incomeConfirmed','scenarioConfirmed'])assert.equal(estimatePublicMinimum({...input,[key]:false}).annual,null);
 for(const change of [{year:2027},{annualUkraine:null},{annualOtherIncome:null},{residentSpain:null},{annualOtherIncome:9443}])assert.equal(estimatePublicMinimum({...input,...change}).annual,null);
});
test('valid uncapped scenario reaches annual minimum; non-resident has no supplement',()=>{
 assert.ok(Math.abs(estimatePublicMinimum({...input,annualSpanish:7000}).annual-5146.8)<1e-8);
 assert.equal(estimatePublicMinimum({...input,residentSpain:false}).annual,0);
});
