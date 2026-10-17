import {retirementAge} from './engine.mjs';
/** Explicit simplified scenario, not an official determination of the calculation base. */
export function simplifiedPeriods(values,ageAsOf){
 return {...values,recentSpainMonths:Object.hasOwn(values,"recentSpainExtraMonths")?yearMonth(values.recentSpainYears,values.recentSpainExtraMonths):recentMonths(values.recentSpainYears),recentUkraineMonths:Object.hasOwn(values,"recentUkraineExtraMonths")?(values.recentUkraineYears==null&&values.recentUkraineExtraMonths==null?null:yearMonth(values.recentUkraineYears,values.recentUkraineExtraMonths)):recentMonths(values.recentUkraineYears),spainMonths:(Number.isInteger(values.spainYears)?values.spainYears*12:NaN),ukraineMonths:(Number.isInteger(values.ukraineYears)?values.ukraineYears*12:NaN),overlapMonths:values.overlapMonths??0,recentOverlapMonths:values.recentOverlapMonths??0,referenceConfirmed:true,ageAsOf};
}
export function simplifiedAmounts(contributionBase,ukraineAmount){
 if(!Number.isFinite(contributionBase)||contributionBase<=0||(ukraineAmount!=null&&(!Number.isFinite(ukraineAmount)||ukraineAmount<0)))return null;
 // Flat contribution base throughout the reference history: 12 contribution months / 14 pension payments.
 const proxyBase=contributionBase*12/14;
 return {nationalBase:proxyBase,treatyBase:proxyBase,ukraineAmount,ukrainePayments:12,exchangeRate:1,proxyBase};
}

// Quarter-years are exact three-month units; blanks never become zero.
export function recentMonths(years){return Number.isFinite(years)&&years>=0&&years<=15&&Number.isInteger(years*4)?years*12:NaN;}

export function yearMonth(years,months){return Number.isInteger(years)&&years>=0&&Number.isInteger(months)&&months>=0&&months<=11&&years*12+months<=180?years*12+months:NaN;}

/** Months after the planned date, allowing annual age-rule transitions. No extra contributions assumed. */
export function retirementWait(e,date){
 const d=new Date(date+'T00:00:00Z');
 const wait=age=>{for(let n=0;n<=1200;n++){const year=d.getUTCFullYear()+Math.floor((d.getUTCMonth()+n)/12),required=retirementAge(year,e.totalMonths);if(required==null)return null;if(age+n>=required)return n;}return null;};
 return {low:wait(e.ageUpperMonths),high:wait(e.ageMonths)};
}
