import type { Answers } from "@/lib/questionnaire";
import { getBenefitBySlug } from "@/content/benefits";
import { rules } from "./rules";
import type { EngineOutput, RuleResult } from "./types";

/**
 * Прогоняет профиль через все правила и раскладывает результаты по корзинам.
 * Детерминировано: одинаковый профиль всегда дает одинаковый результат.
 */
export function evaluateAll(answers: Answers): EngineOutput {
  const results = rules
    .map((rule) => rule(answers))
    .filter((r) => r.verdict !== "no")
    .filter((r) => getBenefitBySlug(r.slug) !== undefined);

  const eligible = results.filter((r) => r.verdict === "yes");
  const almost = results.filter((r) => r.verdict === "almost");
  const check = results.filter((r) => r.verdict === "check");

  const sum = (items: RuleResult[], key: "amountMonthly" | "amountOnce") =>
    items.reduce((acc, r) => acc + (r[key] ?? 0), 0);

  const totalMonthly = sum(eligible, "amountMonthly");
  const totalOnce = sum(eligible, "amountOnce");

  return {
    eligible,
    almost,
    check,
    totalMonthly,
    totalOnce,
    totalYearly: totalMonthly * 12 + totalOnce,
    approximate: results.some((r) => r.approximate),
  };
}
