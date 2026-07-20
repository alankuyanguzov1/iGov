/**
 * Расчетные показатели Республики Казахстан на 2026 год.
 * Единственный источник числовых констант для формул льгот.
 * Обновляются раз в год законом о республиканском бюджете.
 */
export const PARAMS_2026 = {
  year: 2026,
  /** Месячный расчетный показатель */
  mrp: 4325,
  /** Прожиточный минимум */
  pm: 50851,
  /** Черта бедности: 70% от прожиточного минимума */
  povertyLine: 35596,
  /** Минимальная заработная плата */
  mzp: 85000,
} as const;

export function mrp(count: number): number {
  return Math.round(PARAMS_2026.mrp * count);
}

export function pm(coefficient: number): number {
  return Math.round(PARAMS_2026.pm * coefficient);
}

export function formatKzt(amount: number): string {
  return new Intl.NumberFormat("ru-RU").format(amount) + " ₸";
}
