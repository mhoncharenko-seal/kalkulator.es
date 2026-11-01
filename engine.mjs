/** Pure, browser-safe scenario engine. Monetary bases are supplied, never inferred. */
import {rulesForYear} from './normative.mjs';
const finite = x => typeof x === 'number' && Number.isFinite(x) && x >= 0;
export function retirementAge(year, months) {
  const r=rulesForYear(year);
  if (!r || !finite(months)) return null;
  return months>=r.shortAgeContributionMonths?r.ordinaryShortMonths:r.ordinaryLongMonths;
}
export function pensionPercentage(year, months) {
  const r=rulesForYear(year);
  if (!r || !finite(months) || months < 180) return null;
  const extra = Math.floor(months) - 180;
  return Math.min(100,50+Math.min(extra,r.firstExtraMonths)*r.firstExtraPercent+Math.max(0,extra-r.firstExtraMonths)*r.laterExtraPercent);
}
function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const d=new Date(value+'T00:00:00Z');
  return Number.isFinite(+d) && d.toISOString().slice(0,10)===value ? d : null;
}
export function evaluateEligibility(input={}) {
  const {spainMonths:s,ukraineMonths:u,overlapMonths:o=0,recentSpainMonths:rs,recentUkraineMonths:ru,recentOverlapMonths:ro=0,referenceConfirmed=false}=input;
  const b=parseDate(input.birthDate), d=parseDate(input.retirementDate);
  const asOf=parseDate(input.ageAsOf), ageKnown=Number.isInteger(input.ageYears)&&input.ageYears>=18&&input.ageYears<=110&&asOf;
  const ageInput=Object.hasOwn(input,'ageYears');
  const errors=[];
  if (![s,u,o].every(x=>finite(x)&&Number.isInteger(x)) || o>Math.min(s,u) || s>720 || u>720) errors.push('invalid-periods');
  if (!d || d.getUTCFullYear()<2026 || (ageInput ? !ageKnown || d<asOf : !b || d<=b)) errors.push('invalid-dates');
  if (rs!=null && (!finite(rs)||!Number.isInteger(rs)||rs>s||rs>180)) errors.push('invalid-recent');
  if (ru!=null && (!finite(ru)||!Number.isInteger(ru)||ru>u||ru>180)) errors.push('invalid-recent');
  if (!finite(ro) || !Number.isInteger(ro) || ro>o || (rs!=null&&ru!=null&&ro>Math.min(rs,ru))) errors.push('invalid-overlap');
  if (errors.length) return {status:'invalid',errors};
  const totalMonths=s+u-o, year=d.getUTCFullYear();
  const elapsed=ageInput?(year-asOf.getUTCFullYear())*12+d.getUTCMonth()-asOf.getUTCMonth()-(d.getUTCDate()<asOf.getUTCDate()?1:0):0;
  const ageMonths=ageInput?input.ageYears*12+elapsed:(year-b.getUTCFullYear())*12+d.getUTCMonth()-b.getUTCMonth()-(d.getUTCDate()<b.getUTCDate()?1:0);
  const ageUpperMonths=ageMonths+(ageInput?11:0);
  if (totalMonths>ageMonths) return {status:'invalid',errors:['impossible-duration']};
  const ordinaryAgeMonths=retirementAge(year,totalMonths);
  const recentKnown=referenceConfirmed&&rs!=null&&(ru!=null||rs-ro>=24);
  const specificMonths=recentKnown?rs+(ru??0)-ro:null;
  if (rs!=null&&ru!=null&&(rs+ru-ro>Math.min(180,totalMonths)||o-ro>Math.min(s-rs,u-ru))) return {status:'invalid',errors:['invalid-recent-union']};
  const nationalEligible=referenceConfirmed&&rs!=null ? s>=180&&rs>=24 : null;
  const treatyEligible=recentKnown ? totalMonths>=180&&specificMonths>=24&&s>=12 : null;
  const missingMonths=Math.max(0,180-totalMonths);
  const reasons=[];
  if (!referenceConfirmed) reasons.push('reference-window');
  if (!recentKnown) reasons.push('recent-unknown');
  if (s<12) reasons.push('spain-under-one-year');
  if (u>0&&u<12) reasons.push('ukraine-under-one-year');
  if (o>0) reasons.push('overlap-deducted');
  const status=missingMonths>0?'insufficient':s<12?'needs-review':!recentKnown?'needs-review':specificMonths<24?'insufficient':'potential';
  if(ageInput) reasons.push('approximate-age');
  return {status,errors:[],reasons,ageUpperMonths,ageApproximate:ageInput,ageBoundaryUncertain:ageInput&&ageMonths<ordinaryAgeMonths&&ageUpperMonths>=ordinaryAgeMonths,spainMonths:s,ukraineMonths:u,overlapMonths:o,totalMonths,specificMonths,nationalEligible,treatyEligible,missingMonths,missingRecentMonths:specificMonths==null?null:Math.max(0,24-specificMonths),ageMonths,ordinaryAgeMonths,ageReached:ageMonths>=ordinaryAgeMonths,nationalAgeMonths:retirementAge(year,s),nationalAgeReached:ageMonths>=retirementAge(year,s),year};
}
export function normalizePension(amount,payments=14,exchangeRate=1) {
  if (!finite(amount)||!Number.isInteger(payments)||payments<1||payments>14||!finite(exchangeRate)||exchangeRate===0) return null;
  const annual=amount*payments*exchangeRate;
  if (!Number.isFinite(annual)) return null;
  return {annual,monthly12:annual/12,monthly14:annual/14};
}
export function estimatePension(input={}) {
  const {eligibility:e,year,spainMonths:s,ukraineMonths:u,overlapMonths:o=0,nationalBase,treatyBase}=input;
  if (!e || e.status==='invalid'||![s,u,o].every(x=>finite(x)&&Number.isInteger(x))||o>Math.min(s,u)||!retirementAge(year,s+u-o)||e.totalMonths!==s+u-o||e.spainMonths!==s||e.ukraineMonths!==u||e.overlapMonths!==o||e.year!==year) return {status:'invalid'};
  if ([nationalBase,treatyBase].some(x=>x!=null&&(!finite(x)||x>Number.MAX_VALUE/28))) return {status:'invalid'};
  if (input.ukraineAmount!=null&&!normalizePension(input.ukraineAmount,input.ukrainePayments??12,input.exchangeRate??1)) return {status:'invalid'};
  const rules=rulesForYear(year),cap=rules.fullPensionMonths;
  const total=s+u-o;
  // Art. 10.2.c: foreign periods only up to full pension; preserve own periods.
  const treatyMonths=Math.max(s,Math.min(total,cap));
  const fraction=u>0&&u<12?1:treatyMonths>0?s/treatyMonths:0;
  const nationalAvailable=e.nationalEligible&&e.nationalAgeReached;
  const treatyAvailable=u>0&&e.treatyEligible&&e.ageReached&&(!(u>0&&u<12)||input.ukraineUnderOneYearNoRightConfirmed===true);
  const national=nationalAvailable&&finite(nationalBase)?nationalBase*(pensionPercentage(year,s)/100):null;
  const theoretical=treatyAvailable&&finite(treatyBase)?treatyBase*(pensionPercentage(year,treatyMonths)/100):null;
  const treaty=theoretical==null?null:theoretical*fraction;
  const reasons=[];
  if(u>0&&u<12&&input.ukraineUnderOneYearNoRightConfirmed!==true) reasons.push('ukraine-under-one-year-review');
  if(o>0&&input.overlapAllocationConfirmed!==true) reasons.push('overlap-allocation-review');
  if(rules.maximumMonthly14!=null&&Math.max(national??0,theoretical??0)>rules.maximumMonthly14) reasons.push('maximum-review');
  const comparable=reasons.length===0&&(!nationalAvailable||national!=null)&&(!treatyAvailable||treaty!=null)&&Boolean(nationalAvailable||treatyAvailable);
  const best=comparable?Math.max(national??0,treaty??0):null;
  const ukraine=input.ukraineAmount==null?null:normalizePension(input.ukraineAmount,input.ukrainePayments??12,input.exchangeRate??1);
  return {status:best==null?'incomplete':'conditional',reasons,beforeMaximumCap:rules.maximumMonthly14==null,national,theoretical,treaty,fraction,treatyMonths,nationalPercentage:pensionPercentage(year,s),treatyPercentage:pensionPercentage(year,treatyMonths),comparable,best,spanish:best==null?null:normalizePension(best),ukraine,totalAnnual:best==null||!ukraine?null:best*14+ukraine.annual,internationalComparisonComplete:false,minimumIncluded:false};
}
export function assessMinimum({residentSpain,annualOtherIncome,annualSpanish,annualUkraine,minimumAnnual,incomeLimit,complementCapAnnual,incomeExclusionConfirmed=false,estimateConfirmed=false}={}) {
  if ([annualOtherIncome,annualSpanish,annualUkraine,minimumAnnual,incomeLimit,complementCapAnnual].some(x=>x!=null&&!finite(x))) return {status:'invalid',reason:'invalid-amount',annual:null};
  if (residentSpain===false) return {status:'excluded',reason:'residence',annual:0};
  if (incomeExclusionConfirmed) return {status:'excluded',reason:'income',annual:0};
  if (finite(annualOtherIncome)&&finite(incomeLimit)&&annualOtherIncome>incomeLimit) return {status:'needs-review',reason:'income-differential',annual:null};
  if (finite(annualSpanish)&&finite(annualUkraine)&&finite(minimumAnnual)&&annualSpanish+annualUkraine>=minimumAnnual) return {status:'not-needed',annual:0};
  // A declared scenario is an estimate, never an award of entitlement.
  if (estimateConfirmed && residentSpain===true &&
      [annualOtherIncome,annualSpanish,annualUkraine,minimumAnnual,incomeLimit,complementCapAnnual].every(finite) && annualSpanish>0) {
    const deficit=Math.max(0,minimumAnnual-annualSpanish-annualUkraine);
    const annual=Math.min(deficit,complementCapAnnual);
    return {status:'conditional',annual,deficit,capAnnual:complementCapAnnual,capped:annual<deficit};
  }
  // International minimum and proportional minimum interact with family, income,
  // recognition date and annual limits. Never manufacture a legal entitlement.
  return {status:'needs-review',reason:'international-minimum',annual:null,capAnnual:finite(complementCapAnnual)?complementCapAnnual:null};
}
