import {estimatePublicMinimum} from './pension-result.mjs';
/** Hypothetical favourable case, never a declaration of the person's circumstances. */
export function simulateMinimum({result,eligibility,periods,detail=null}={}){
 const pending=reason=>({status:'needs-review',annual:null,reason});
 if(!result||eligibility?.status!=='potential'||!eligibility.ageReached)return pending('eligibility');
 if(!Number.isFinite(periods?.recentSpainMonths)||periods.recentSpainMonths<24)return pending('simplifiedScope');
 if(eligibility.year!==2026)return pending('year');
 let family='single',income=0,spouseIncome=null,spousePension=null;
 const number=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
 if(detail){
  family=detail.family;income=detail.income;
  if(!['single','dependent','nondependent'].includes(family)||!number(income)||!number(detail.otherPensions))return pending('details');
  if(detail.otherPensions>0)return pending('otherPensions');
  if(family!=='single'){
   if(detail.cohabit!=='yes'||!['yes','no'].includes(detail.spousePension))return pending('dependency');
   spousePension=detail.spousePension==='yes'?detail.spousePensionAnnual:0;
   if(!number(spousePension))return pending('dependency');
   if(family==='dependent'){
    if(detail.spousePension==='yes')family='nondependent';
    else {spouseIncome=detail.spouseIncome;if(!number(spouseIncome))return pending('dependency');income+=spouseIncome;if(income>=11013)return pending('dependency');}
   }
  }
 }
 const common={year:eligibility.year,ageMonths:eligibility.ageMonths,family,residentSpain:true,annualOtherIncome:income,annualSpanish:result.spanish?.annual??null,annualUkraine:result.ukraine?.annual??null,scopeConfirmed:true,incomeConfirmed:true,scenarioConfirmed:true};
 let r=estimatePublicMinimum(common);
 // Art. 9.2: income above the declaration threshold does not mean automatic exclusion.
 if(family!=='dependent'&&income>9442&&number(common.annualSpanish)&&number(common.annualUkraine)){
  const baseline=common.annualSpanish+common.annualUkraine,deficit=Math.max(0,r.minimumAnnual-baseline);
  const annual=Math.min(deficit,Math.max(0,r.minimumAnnual+9442-income-baseline),8803.2);
  r={...r,status:'conditional',annual,capAnnual:8803.2,capped:annual===8803.2&&deficit>8803.2};
 }
 return {...r,favourable:detail==null,used:{family,income,spouseIncome,spousePension,year:2026},refined:detail!=null};
}
