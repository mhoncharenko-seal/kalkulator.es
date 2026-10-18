import test from 'node:test';
import assert from 'node:assert/strict';
import {composition} from '../pension-result.mjs';
import {simplifiedAmounts} from '../scenario.mjs';
test('unknown supplement is excluded, Spanish 14 payments normalized against Ukrainian 12',()=>{
 const r=composition({spanish:{annual:100*14},ukraine:{annual:80*12}},{annual:null});
 assert.equal(r.total,null);assert.equal(r.subtotal,2360);assert.deepEqual(r.amounts,[1400,null,960]);assert.equal(r.shares[1],0);
 assert.ok(Math.abs(r.shares.reduce((a,b)=>a+b,0)-100)<1e-10);
});
test('unknown Ukrainian pension remains unknown rather than zero',()=>{
 assert.equal(simplifiedAmounts(1400,null).ukraineAmount,null);
 const r=composition({spanish:{annual:1400},ukraine:null},{annual:null});
 assert.equal(r.total,null);assert.equal(r.subtotal,1400);assert.deepEqual(r.shares,[100,0,0]);
});
test('confirmed zero components remain included and all-zero chart is finite',()=>{
 const r=composition({spanish:{annual:0},ukraine:{annual:0}},{annual:0});
 assert.equal(r.total,0);assert.deepEqual(r.shares,[0,0,0]);
});
