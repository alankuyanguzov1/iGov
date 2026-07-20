export type BenefitCategory =
  | "family"
  | "students"
  | "vulnerable"
  | "workers"
  | "housing"
  | "tax";

export type Benefit = {
  slug: string;
  title: string;
  category: BenefitCategory;
  level: "national" | "regional";
  /** Назначается государством проактивно через Цифровую карту семьи (SMS от 1414) */
  proactive: boolean;
  shortDesc: string;
  whatYouGet: string;
  whoEligible: string[];
  howToApply: string[];
  documents: string[];
  amountFormula: string;
  amountExample: string;
  legalRef: string;
  legalUrl: string;
  applyUrl?: string;
  /** Дата последней сверки карточки с первоисточником */
  verifiedAt: string;
  /** verified: цифры сверены; needs_check: формула верна, точные значения требуют юридической сверки */
  verification: "verified" | "needs_check";
};
