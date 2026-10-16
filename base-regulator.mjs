/** National general-regime base only. No treaty art.12 base is inferred. */
export const BASE_SOURCE = 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724';
const divisors=[352.33,354.67,357,359.33,361.67,364,366.33,368.67,371,373.33,375.67];
export function baseRules(year){
  if(!Number.isInteger(year)||year<2026||year>2039)return null;
  const step=Math.min(year-2025,12);
  return {year,windowMonths:300+4*step,selectedMonths:300+2*step,divisor:year>=2037?378:divisors[year-2026],oldMonths:300,oldDivisor:350};
}
/** Oldest to newest; ends TWO calendar months before retirement month.
 * All bases must already satisfy art209 IPC rules (last24 nominal), no gaps,
 * no special cases, no unreconciled multiple-employment/max-base amounts.
 */
export function calculateNationalBase({year,bases,adjustedConfirmed=false,noGapsConfirmed=false,generalRegimeConfirmed=false}={}){
  const rule=baseRules(year);
  if(!rule)return {status:'unsupported',reason:'year',nationalBase:null};
  if(!Array.isArray(bases)||bases.length!==rule.windowMonths||!bases.every(x=>typeof x==='number'&&Number.isFinite(x)&&x>0&&x<=Number.MAX_VALUE/1000))return {status:'invalid',reason:'monthly-bases',nationalBase:null,requiredMonths:rule.windowMonths};
  if(!adjustedConfirmed||!noGapsConfirmed||!generalRegimeConfirmed)return {status:'incomplete',reason:'scope-confirmations',nationalBase:null,requiredMonths:rule.windowMonths};
  const sum=xs=>xs.reduce((a,b)=>a+b,0);
  const oldBase=sum(bases.slice(-300))/350;
  const newBase=sum([...bases].sort((a,b)=>b-a).slice(0,rule.selectedMonths))/rule.divisor;
  return {status:'conditional',nationalBase:Math.max(oldBase,newBase),oldBase,newBase,selected:oldBase>=newBase?'old':'new',rule,scope:'national-general-regime-no-gaps-adjusted-input',treatyBase:null};
}
