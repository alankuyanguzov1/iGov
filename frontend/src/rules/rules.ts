import type { Answers } from "@/lib/questionnaire";
import { PARAMS_2026, formatKzt, mrp, pm } from "@/content/parameters";
import type { Rule, RuleResult } from "./types";
import { age, childrenUnder, perCapitaIncome } from "./helpers";

const P = PARAMS_2026;

function no(slug: string): RuleResult {
  return { slug, verdict: "no", reasons: [] };
}

/**
 * Правила движка. Каждое правило детерминировано, ссылается на карточку льготы
 * по slug и объясняет вывод человеческим языком.
 * Суммы являются оценкой: точный размер определяет госорган при назначении.
 */
export const rules: Rule[] = [
  // ===== Адресная социальная помощь =====
  (a: Answers): RuleResult => {
    const slug = "asp";
    const { value: perCapita, approximate } = perCapitaIncome(a);
    if (perCapita === null) return no(slug);

    const line = P.povertyLine;
    const kids = childrenUnder(a, 18);

    if (perCapita < line) {
      const adultTopUp = Math.max(0, line - perCapita) * a.adults;
      const childPayment = kids * line;
      return {
        slug,
        verdict: "yes",
        amountMonthly: adultTopUp + childPayment,
        approximate,
        reasons: [
          `Доход на человека в вашей семье ${formatKzt(perCapita)}: это ниже черты бедности ${formatKzt(line)}`,
          kids > 0
            ? `На каждого из ${kids} детей выплата составляет 70% прожиточного минимума`
            : "Взрослым доход доводится до черты бедности",
        ],
      };
    }

    if (perCapita < line * 1.2) {
      return {
        slug,
        verdict: "almost",
        approximate,
        reasons: [],
        missing: [
          `Доход на человека ${formatKzt(perCapita)} выше черты бедности ${formatKzt(line)} на ${formatKzt(perCapita - line)}. При снижении дохода семьи право появится`,
        ],
      };
    }
    return no(slug);
  },

  // ===== Единовременное пособие на рождение =====
  (a: Answers): RuleResult => {
    const slug = "birth-benefit";
    const newborns = a.childrenAges.filter((c) => c === 0).length;
    if (newborns === 0) return no(slug);
    const totalKids = a.childrenAges.length;
    const perChild = totalKids >= 4 ? mrp(63) : mrp(38);
    return {
      slug,
      verdict: "yes",
      amountOnce: perChild * newborns,
      reasons: [
        "У вас есть ребенок младше года: пособие на рождение положено независимо от дохода",
        totalKids >= 4
          ? "Размер повышенный: в семье четверо и больше детей"
          : "Стандартный размер: 38 МРП на ребенка",
      ],
    };
  },

  // ===== Пособие по уходу до 1.5 лет =====
  (a: Answers): RuleResult => {
    const slug = "childcare-benefit";
    const younglings = a.childrenAges.filter((c) => c <= 1).length;
    if (younglings === 0) return no(slug);
    const order = Math.min(a.childrenAges.length, 4);
    const coefByOrder = [5.76, 6.81, 7.85, 8.9];
    const base = mrp(coefByOrder[order - 1]);
    if (a.employment === "official") {
      return {
        slug,
        verdict: "yes",
        amountNote: "40% от вашего среднемесячного дохода за последние 2 года, но не меньше базового размера",
        reasons: [
          "У вас есть ребенок младше полутора лет",
          "Вы работаете официально: выплату платит фонд соцстрахования от вашего дохода",
        ],
      };
    }
    return {
      slug,
      verdict: "yes",
      amountMonthly: base,
      reasons: [
        "У вас есть ребенок младше полутора лет",
        `Базовый размер зависит от очередности ребенка: для вашей семьи примерно ${formatKzt(base)} в месяц`,
      ],
    };
  },

  // ===== Пособие многодетным =====
  (a: Answers): RuleResult => {
    const slug = "multichild-benefit";
    const kids = childrenUnder(a, 18);
    if (kids >= 4) {
      const estimate = kids >= 8 ? mrp(4 * kids) : mrp(16.03 + 4.01 * (kids - 4));
      return {
        slug,
        verdict: "yes",
        amountMonthly: estimate,
        reasons: [
          `В семье ${kids} несовершеннолетних детей: пособие положено независимо от дохода`,
        ],
      };
    }
    if (kids === 3) {
      return {
        slug,
        verdict: "almost",
        reasons: [],
        missing: ["Пособие назначается с четырех детей: у вас трое"],
      };
    }
    return no(slug);
  },

  // ===== Алтын алқа / Күміс алқа =====
  (a: Answers): RuleResult => {
    const slug = "altyn-alka";
    if (!a.statuses.includes("multichildAward")) return no(slug);
    return {
      slug,
      verdict: "yes",
      amountMonthly: mrp(6.4),
      reasons: [
        "У вас есть награда Алтын алқа или Күміс алқа: пособие пожизненное",
        `Показан размер для Күміс алқа; для Алтын алқа выплата выше: ${formatKzt(mrp(7.4))} в месяц`,
      ],
    };
  },

  // ===== Нацфонд детям =====
  (a: Answers): RuleResult => {
    const slug = "natsfond-detyam";
    const kids = childrenUnder(a, 18);
    if (kids === 0) return no(slug);
    return {
      slug,
      verdict: "yes",
      amountNote: `Накопления идут автоматически на каждого из ${kids} детей, доступны с 18 лет на жилье или образование`,
      reasons: ["Всем детям гражданам РК ежегодно начисляется доля инвестдохода Нацфонда"],
    };
  },

  // ===== Пособие по инвалидности =====
  (a: Answers): RuleResult => {
    const slug = "disability-benefit";
    if (!a.statuses.includes("disability") || a.disabilityGroup === null) return no(slug);
    const coef = a.disabilityGroup === 1 ? 2.2 : a.disabilityGroup === 2 ? 1.76 : 1.2;
    return {
      slug,
      verdict: "yes",
      amountMonthly: pm(coef),
      reasons: [
        `Инвалидность ${a.disabilityGroup} группы дает право на ежемесячное госпособие`,
        "Точный размер зависит от причины и группы: показана оценка",
      ],
    };
  },

  // ===== Пособие по потере кормильца =====
  (a: Answers): RuleResult => {
    const slug = "survivor-benefit";
    if (!a.statuses.includes("singleParent") || a.childrenAges.length === 0) return no(slug);
    return {
      slug,
      verdict: "check",
      amountNote: `От ${formatKzt(pm(0.86))} в месяц в зависимости от числа иждивенцев`,
      reasons: [
        "Вы воспитываете детей без второго родителя. Если второй родитель умер или признан безвестно отсутствующим, детям положено ежемесячное пособие",
      ],
    };
  },

  // ===== Пенсия по возрасту =====
  (a: Answers): RuleResult => {
    const slug = "age-pension";
    const years = age(a);
    if (years === null) return no(slug);
    if (a.statuses.includes("pensioner")) return no(slug);
    if (years >= 63) {
      return {
        slug,
        verdict: "yes",
        amountNote: `Базовая пенсия от ${formatKzt(pm(0.7))} до ${formatKzt(pm(1.18))} по стажу, плюс солидарная и накопительная части`,
        reasons: ["Вы достигли пенсионного возраста"],
      };
    }
    if (years >= 61) {
      return {
        slug,
        verdict: "almost",
        reasons: [],
        missing: [
          "В вашем возрасте право на пенсию зависит от пола: женщины выходят с 61 года, мужчины с 63 лет",
        ],
      };
    }
    return no(slug);
  },

  // ===== Пособие по уходу за лицом с инвалидностью 1 группы =====
  (a: Answers): RuleResult => {
    const slug = "caregiver-benefit";
    if (a.disabilityGroup !== 1) return no(slug);
    return {
      slug,
      verdict: "check",
      amountMonthly: pm(1.4),
      reasons: [
        `Человеку, который ухаживает за вами, положено пособие ${formatKzt(pm(1.4))} в месяц. Расскажите близким`,
      ],
    };
  },

  // ===== Технические средства реабилитации =====
  (a: Answers): RuleResult => {
    const slug = "tsr";
    if (!a.statuses.includes("disability")) return no(slug);
    return {
      slug,
      verdict: "yes",
      amountNote: "Бесплатно по индивидуальной программе реабилитации",
      reasons: ["При инвалидности средства реабилитации из вашей программы предоставляются бесплатно"],
    };
  },

  // ===== Бесплатные лекарства =====
  (a: Answers): RuleResult => {
    const slug = "free-medicines";
    if (!a.statuses.includes("disability") && !a.statuses.includes("pensioner")) return no(slug);
    return {
      slug,
      verdict: "check",
      amountNote: "Зависит от диагноза и перечня",
      reasons: [
        "Если вы состоите на диспансерном учете, лекарства из государственного перечня выдаются бесплатно",
      ],
    };
  },

  // ===== Образовательный грант =====
  (a: Answers): RuleResult => {
    const slug = "edu-grant";
    const years = age(a);
    if (years === null || years > 23 || a.statuses.includes("student")) return no(slug);
    return {
      slug,
      verdict: "check",
      amountNote: "Полная оплата обучения в вузе",
      reasons: [
        "В вашем возрасте можно участвовать в ежегодном конкурсе грантов по результатам ЕНТ, включая отдельные квоты",
      ],
    };
  },

  // ===== Государственная стипендия =====
  (a: Answers): RuleResult => {
    const slug = "state-stipend";
    if (!a.statuses.includes("student")) return no(slug);
    return {
      slug,
      verdict: "check",
      amountNote: "52 372 тенге в месяц при обучении на гранте без троек, отличникам 60 228",
      reasons: ["Вы студент очной формы: стипендия зависит от гранта и успеваемости"],
    };
  },

  // ===== Льготный проезд =====
  (a: Answers): RuleResult => {
    const slug = "student-transport";
    if (!a.statuses.includes("student")) return no(slug);
    return {
      slug,
      verdict: "yes",
      amountNote: "Экономия порядка 5 000 тенге в месяц при ежедневных поездках",
      reasons: ["Студентам очной формы положен льготный тариф по студенческой транспортной карте"],
    };
  },

  // ===== Общежитие =====
  (a: Answers): RuleResult => {
    const slug = "dormitory";
    if (!a.statuses.includes("student")) return no(slug);
    if (a.housing === "own") return no(slug);
    return {
      slug,
      verdict: "yes",
      amountNote: "Существенно дешевле аренды, льготным категориям приоритет",
      reasons: ["Вы студент и не имеете собственного жилья: можно претендовать на место в общежитии"],
    };
  },

  // ===== Грант на бизнес =====
  (a: Answers): RuleResult => {
    const slug = "youth-business-grant";
    const years = age(a);
    const youth = years !== null && years >= 18 && years <= 35;
    const seeker =
      a.statuses.includes("jobSeekerRegistered") ||
      a.employment === "searching" ||
      a.employment === "notWorking";
    if (!youth && !seeker) return no(slug);
    return {
      slug,
      verdict: "check",
      amountOnce: mrp(400),
      reasons: [
        youth
          ? "По возрасту вы подходите под молодежные программы гранта на собственное дело"
          : "Ищущим работу доступен грант на собственное дело",
        "Грант конкурсный: нужен бизнес план и защита проекта",
      ],
    };
  },

  // ===== Базовый налоговый вычет 30 МРП =====
  (a: Answers): RuleResult => {
    const slug = "base-tax-deduction";
    if (a.employment === "official") {
      return {
        slug,
        verdict: "yes",
        amountMonthly: Math.round(mrp(30) * 0.1),
        reasons: [
          "Вы работаете официально: вычет 30 МРП положен каждому работнику по заявлению",
          `Экономия на налоге до ${formatKzt(Math.round(mrp(30) * 0.1))} в месяц: проверьте, что бухгалтерия применяет вычет`,
        ],
      };
    }
    if (a.employment === "informal") {
      return {
        slug,
        verdict: "almost",
        reasons: [],
        missing: [
          "Вычет применяется только к официальному доходу. При оформлении по договору вы начнете экономить на налоге каждый месяц",
        ],
      };
    }
    return no(slug);
  },

  // ===== Социальные вычеты 882 и 5000 МРП =====
  (a: Answers): RuleResult => {
    const slug = "social-tax-deduction";
    if (a.employment !== "official" || !a.statuses.includes("disability")) return no(slug);
    const big = a.disabilityGroup === 1 || a.disabilityGroup === 2;
    return {
      slug,
      verdict: "yes",
      amountNote: big
        ? "Вычет 5000 МРП в год: у большинства обладателей права ИПН обнуляется полностью"
        : "Вычет 882 МРП в год дополнительно к базовому",
      reasons: [
        "Официальная работа и инвалидность дают право на крупный социальный вычет по статье 404 Налогового кодекса",
      ],
    };
  },

  // ===== Выплата при потере работы =====
  (a: Answers): RuleResult => {
    const slug = "job-loss-payment";
    const relevant =
      a.employment === "searching" ||
      a.employment === "notWorking" ||
      a.statuses.includes("jobSeekerRegistered");
    if (!relevant) return no(slug);
    return {
      slug,
      verdict: "almost",
      reasons: [],
      missing: [
        "Нужно, чтобы за вас платились соцотчисления минимум 6 месяцев за последние 2 года, и регистрация на enbek.kz в качестве ищущего работу",
      ],
    };
  },

  // ===== ОСМС за счет государства =====
  (a: Answers): RuleResult => {
    const slug = "osms-state";
    const covered =
      a.statuses.includes("student") ||
      a.statuses.includes("pensioner") ||
      a.statuses.includes("disability") ||
      a.statuses.includes("multichildAward") ||
      a.statuses.includes("jobSeekerRegistered");
    if (!covered) return no(slug);
    return {
      slug,
      verdict: "yes",
      amountNote: "Государство платит взносы медстрахования за вас",
      reasons: ["Ваша категория входит в перечень, за который взносы ОСМС платит государство"],
    };
  },

  // ===== Переобучение =====
  (a: Answers): RuleResult => {
    const slug = "free-retraining";
    const relevant =
      a.employment === "searching" ||
      a.employment === "notWorking" ||
      a.employment === "informal" ||
      a.statuses.includes("jobSeekerRegistered");
    if (!relevant) return no(slug);
    return {
      slug,
      verdict: "yes",
      amountNote: "Курсы оплачивает государство, часто со стипендией",
      reasons: ["Вам доступны бесплатные курсы и переобучение через центры занятости"],
    };
  },

  // ===== Жилищная помощь =====
  (a: Answers): RuleResult => {
    const slug = "housing-assistance";
    const { value: perCapita, approximate } = perCapitaIncome(a);
    if (perCapita === null || a.housing === "relatives") return no(slug);
    if (perCapita < P.pm * 1.5) {
      return {
        slug,
        verdict: "check",
        approximate,
        amountNote: "Компенсация части коммунальных платежей сверх допустимой доли расходов",
        reasons: [
          "При вашем доходе стоит проверить право на жилищную помощь: если коммунальные платежи превышают допустимую долю дохода семьи, разницу компенсирует акимат",
        ],
      };
    }
    return no(slug);
  },

  // ===== Отбасы =====
  (a: Answers): RuleResult => {
    const slug = "otbasy-programs";
    if (a.housing === "own") return no(slug);
    return {
      slug,
      verdict: "check",
      amountNote: "Ставки ниже рыночных плюс госпремия на накопления",
      reasons: ["У вас нет собственного жилья: система жилстройсбережений дает льготный путь к ипотеке"],
    };
  },

  // ===== Очередь на жилье =====
  (a: Answers): RuleResult => {
    const slug = "housing-queue";
    if (a.housing === "own") return no(slug);
    const category =
      childrenUnder(a, 18) >= 4 ||
      a.statuses.includes("disability") ||
      a.statuses.includes("singleParent");
    if (!category) return no(slug);
    return {
      slug,
      verdict: "yes",
      amountNote: "Арендное или кредитное жилье от акимата по льготным условиям",
      reasons: [
        "Ваша категория входит в перечень социально уязвимых: можно встать в очередь на жилье от государства",
      ],
    };
  },
];
