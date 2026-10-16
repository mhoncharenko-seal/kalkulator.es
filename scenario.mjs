/** Explicit simplified scenario, not an official determination of the calculation base. */
export function simplifiedPeriods(values,ageAsOf){
 return {...values,spainMonths:(Number.isInteger(values.spainYears)?values.spainYears*12:NaN),ukraineMonths:(Number.isInteger(values.ukraineYears)?values.ukraineYears*12:NaN),overlapMonths:0,recentOverlapMonths:0,referenceConfirmed:true,ageAsOf};
}
export function simplifiedAmounts(contributionBase,ukraineAmount){
 if(!Number.isFinite(contributionBase)||contributionBase<=0||(ukraineAmount!=null&&(!Number.isFinite(ukraineAmount)||ukraineAmount<0)))return null;
 // Flat contribution base throughout the reference history: 12 contribution months / 14 pension payments.
 const proxyBase=contributionBase*12/14;
 return {nationalBase:proxyBase,treatyBase:proxyBase,ukraineAmount,ukrainePayments:12,exchangeRate:1,proxyBase};
}
