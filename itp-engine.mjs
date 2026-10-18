/** Draft scope: ordinary resale housing, full ownership, Catalonia. Not published. */
export function estimateITP(v={}){
 const pending=reason=>({status:'review',reason,tax:null});const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
 if(typeof v.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v.date)||!Number.isFinite(Date.parse(v.date))||new Date(v.date).toISOString().slice(0,10)!==v.date)return pending('data');
 if(v.date<'2025-06-27'||v.date>'2026-10-17')return pending('date');
 if(v.operation!=='ordinary')return pending('scope');
 if(![v.price,v.declared].every(valid)||!valid(v.share)||v.share<=0||v.share>100)return pending('data');
 const valuation=v.referenceStatus==='known'?v.reference:v.referenceStatus==='absent'?v.market:null;
 if(!valid(valuation))return pending('base');
 const full=Math.max(v.price,v.declared,valuation);if(full<=0)return pending('data');
 const bands=[[600000,.10],[300000,.11],[600000,.12],[Infinity,.13]];let rest=full,quota=0;const breakdown=[];
 for(const [limit,rate] of bands){const base=Math.min(rest,limit);if(base>0){quota+=base*rate;breakdown.push({base,rate,tax:base*rate});rest-=base;}}
 const generalRate=v.share===100?quota/full*100:Math.round(quota/full*100*1000)/1000;const base=full*v.share/100;const round=n=>Math.round((n+Number.EPSILON)*100)/100;
 let rate=generalRate;
 if(v.rate==='youth'){
 if(!Number.isInteger(v.age)||v.age<18||v.age>35||!Number.isFinite(v.income)||v.income>36000||v.habitual!==true||v.youthConfirmed!==true)return pending('youth');rate=5;
 }else if(v.rate!=='general')return pending('scope');
 return {status:'conditional',full,base,rate,tax:round(base*rate/100),generalTax:round(base*generalRate/100),pricePart:round(v.price*v.share/100),breakdown};
}

