import type { Benefit, BenefitCategory } from "../types";
import { familyBenefits } from "./family";
import { vulnerableBenefits } from "./vulnerable";
import { studentBenefits } from "./students";
import { workerBenefits } from "./workers";
import { housingBenefits } from "./housing";

export const allBenefits: Benefit[] = [
  ...familyBenefits,
  ...studentBenefits,
  ...workerBenefits,
  ...housingBenefits,
  ...vulnerableBenefits,
];

export const categoryTitles: Record<BenefitCategory, string> = {
  family: "Семьям с детьми",
  students: "Студентам и молодежи",
  vulnerable: "Пенсионерам и людям с инвалидностью",
  workers: "Работающим",
  housing: "Жилье",
  tax: "Налоговые вычеты",
};

export const categoryOrder: BenefitCategory[] = [
  "tax",
  "family",
  "students",
  "workers",
  "housing",
  "vulnerable",
];

export function getBenefitBySlug(slug: string): Benefit | undefined {
  return allBenefits.find((b) => b.slug === slug);
}

export function getBenefitsByCategory(category: BenefitCategory): Benefit[] {
  return allBenefits.filter((b) => b.category === category);
}
