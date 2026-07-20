import type { Answers, IncomeRange } from "@/lib/questionnaire";
import { PARAMS_2026 } from "@/content/parameters";

const RANGE_MIDPOINTS: Record<IncomeRange, number> = {
  lt100: 75000,
  r100to250: 175000,
  r250to500: 375000,
  gt500: 600000,
};

export function familySize(a: Answers): number {
  return a.adults + a.childrenAges.length;
}

export function incomeEstimate(a: Answers): { value: number | null; approximate: boolean } {
  if (!a.incomeUnknown && a.incomeMonthly !== null) {
    return { value: a.incomeMonthly, approximate: false };
  }
  if (a.incomeUnknown && a.incomeRange) {
    return { value: RANGE_MIDPOINTS[a.incomeRange], approximate: true };
  }
  return { value: null, approximate: false };
}

export function perCapitaIncome(a: Answers): { value: number | null; approximate: boolean } {
  const { value, approximate } = incomeEstimate(a);
  if (value === null) return { value: null, approximate };
  return { value: Math.round(value / familySize(a)), approximate };
}

export function age(a: Answers): number | null {
  if (a.birthYear === null) return null;
  return PARAMS_2026.year - a.birthYear;
}

export function childrenUnder(a: Answers, maxAgeExclusive: number): number {
  return a.childrenAges.filter((c) => c < maxAgeExclusive).length;
}
