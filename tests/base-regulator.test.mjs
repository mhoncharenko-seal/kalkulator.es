import test from 'node:test';
import assert from 'node:assert/strict';
import {baseRules,calculateNationalBase as calc} from '../base-regulator.mjs';
const confirmed={adjustedConfirmed:true,noGapsConfirmed:true,generalRegimeConfirmed:true};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8);
test('enacted transitional rows and complete 2037 formula',()=>{
 assert.deepEqual([2026,2027,2030,2036,2037,2039].map(y=>{const r=baseRules(y);return [r.windowMonths,r.selectedMonths,r.divisor]}),[[304,302,352.33],[308,304,354.67],[320,310,361.67],[344,322,375.67],[348,324,378],[348,324,378]]);
 assert.equal(baseRules(2040),null);assert.equal(baseRules(2025),null);
});
test('constant bases independently calculated and old alternative retained',()=>{
 const r=calc({year:2026,bases:Array(304).fill(1000),...confirmed});
 near(r.oldBase,300000/350);near(r.newBase,302000/352.33);near(r.nationalBase,Math.max(300000/350,302000/352.33));
 const complete=calc({year:2037,bases:Array(348).fill(1400),...confirmed});near(complete.nationalBase,1200);
});
test('best-bases branch discards smallest amounts after IPC input, not chronological ends',()=>{
 const bases=Array(304).fill(1000);bases[0]=100;bases[100]=100;
 const r=calc({year:2026,bases,...confirmed});near(r.newBase,302000/352.33);near(r.oldBase,299100/350);assert.equal(r.selected,'new');
});
test('old alternative can win when oldest bases are low',()=>{
 const r=calc({year:2026,bases:[1,1,1,1,...Array(300).fill(1000)],...confirmed});
 near(r.oldBase,300000/350);near(r.newBase,300002/352.33);assert.equal(r.selected,'old');near(r.nationalBase,r.oldBase);
});
test('invalid, unsupported and missing confirmations cannot fabricate a base',()=>{
 for(const bases of [Array(300).fill(1000),Array(304).fill(0),Array(304).fill(NaN),Array(304).fill(-1),Array(304).fill(Number.MAX_VALUE)])assert.equal(calc({year:2026,bases,...confirmed}).status,'invalid');
 assert.equal(calc({year:2040,bases:[]}).status,'unsupported');assert.equal(calc({year:2026,bases:Array(304).fill(1000)}).nationalBase,null);
});
test('does not mutate monthly series or invent treaty base',()=>{
 const bases=Array.from({length:304},(_,i)=>i+1),copy=[...bases];const r=calc({year:2026,bases,...confirmed});assert.deepEqual(bases,copy);assert.equal(r.treatyBase,null);
});
