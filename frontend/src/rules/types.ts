import type { Answers } from "@/lib/questionnaire";

/**
 * Результат применения одного правила.
 * eligible:
 *  yes     право с высокой вероятностью есть, критерии закона выполнены
 *  almost  не хватает одного проверяемого условия, показываем чего именно
 *  check   заявительная или конкурсная мера: право вероятно, но зависит от факторов вне анкеты
 *  no      критерии не выполнены, в выдаче не показывается
 */
export type Verdict = "yes" | "almost" | "check" | "no";

export type RuleResult = {
  slug: string;
  verdict: Verdict;
  /** Оценка выгоды в тенге в месяц */
  amountMonthly?: number;
  /** Разовая выплата в тенге */
  amountOnce?: number;
  /** Текстовая оценка, когда выгода не сводится к точному числу */
  amountNote?: string;
  /** Почему вам положено, человеческим языком */
  reasons: string[];
  /** Для almost: чего не хватает */
  missing?: string[];
  /** Расчет по примерному доходу из диапазона */
  approximate?: boolean;
};

export type Rule = (answers: Answers) => RuleResult;

export type EngineOutput = {
  eligible: RuleResult[];
  almost: RuleResult[];
  check: RuleResult[];
  totalMonthly: number;
  totalOnce: number;
  totalYearly: number;
  approximate: boolean;
};
