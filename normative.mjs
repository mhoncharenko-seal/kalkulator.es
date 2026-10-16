/** Rules verified 2026-10-16; future rows describe current enacted law, not forecasts. */
export const SOURCES=Object.freeze({lgss:'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11724',treaty:'https://www.boe.es/buscar/act.php?id=BOE-A-1998-8056',annual2026:'https://www.boe.es/buscar/act.php?id=BOE-A-2026-6977',consulted:'2026-10-16'});
export const RULES=Object.freeze({
  2026:Object.freeze({ordinaryShortMonths:780,ordinaryLongMonths:802,shortAgeContributionMonths:459,fullPensionMonths:438,firstExtraMonths:49,firstExtraPercent:.21,laterExtraPercent:.19,maximumMonthly14:3359.60}),
  from2027:Object.freeze({ordinaryShortMonths:780,ordinaryLongMonths:804,shortAgeContributionMonths:462,fullPensionMonths:444,firstExtraMonths:248,firstExtraPercent:.19,laterExtraPercent:.18,maximumMonthly14:null})
});
export function rulesForYear(year){return Number.isInteger(year)&&year>=2026?(year===2026?RULES[2026]:RULES.from2027):null;}

// Retirement minima in 14 payments, Seguridad Social table for 2026.
export const MINIMUM_2026 = Object.freeze({
  over65: Object.freeze({single:936.20, dependent:1256.60, nondependent:888.70}),
  under65: Object.freeze({single:875.90, dependent:1256.60, nondependent:827.90})
});
export function minimumMonthly2026(ageMonths, family) {
  if (!Number.isFinite(ageMonths) || ageMonths<0) return null;
  return MINIMUM_2026[ageMonths>=780?'over65':'under65'][family]??null;
}
