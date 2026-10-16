import {assessMinimum} from './engine.mjs';
import {minimumMonthly2026} from './normative.mjs';
export function estimatePublicMinimum(input={}) {
 const {year,ageMonths,family,scopeConfirmed,incomeConfirmed,scenarioConfirmed,...amounts}=input;
 const minimum=minimumMonthly2026(ageMonths,family);
 if(year!==2026||minimum==null)return {status:'needs-review',annual:null};
 const dependent=family==='dependent';
 const minimumAnnual=minimum*14;
 const result=assessMinimum({...amounts,minimumAnnual,incomeLimit:dependent?11013:9442,complementCapAnnual:dependent?14965.44:8803.2,estimateConfirmed:scopeConfirmed===true&&incomeConfirmed===true&&scenarioConfirmed===true});
 return {...result,minimumAnnual};
}
export function composition(result, minimum) {
 const amounts=[result?.spanish?.annual??null,minimum?.annual??null,result?.ukraine?.annual??null];
 const subtotal=amounts.reduce((sum,x)=>sum+(x??0),0);
 return {amounts,subtotal,total:amounts.every(x=>x!=null)?subtotal:null,shares:amounts.map(x=>x==null||subtotal===0?0:x/subtotal*100)};
}
