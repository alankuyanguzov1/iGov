import { describe, expect, it } from "vitest";
import { evaluateAll } from "../engine";
import { emptyAnswers, type Answers } from "@/lib/questionnaire";
import { PARAMS_2026, mrp } from "@/content/parameters";

function profile(patch: Partial<Answers>): Answers {
  return { ...emptyAnswers, ...patch };
}

function find(output: ReturnType<typeof evaluateAll>, slug: string) {
  return [...output.eligible, ...output.almost, ...output.check].find((r) => r.slug === slug);
}

describe("АСП", () => {
  it("положена при доходе ниже черты бедности и учитывает детей", () => {
    const out = evaluateAll(
      profile({
        region: "turkestan",
        birthYear: 1995,
        adults: 2,
        childrenAges: [2, 5],
        incomeMonthly: 100000, // 25 000 на человека при семье из 4
        employment: "informal",
        housing: "rent",
      }),
    );
    const asp = find(out, "asp");
    expect(asp?.verdict).toBe("yes");
    // 2 ребенка по черте бедности + доплата взрослым
    const expected = 2 * PARAMS_2026.povertyLine + 2 * (PARAMS_2026.povertyLine - 25000);
    expect(asp?.amountMonthly).toBe(expected);
  });

  it("почти подходит при доходе чуть выше черты", () => {
    const out = evaluateAll(
      profile({
        region: "astana",
        birthYear: 1990,
        adults: 1,
        incomeMonthly: Math.round(PARAMS_2026.povertyLine * 1.1),
        employment: "official",
        housing: "rent",
      }),
    );
    expect(find(out, "asp")?.verdict).toBe("almost");
  });

  it("не показывается при высоком доходе", () => {
    const out = evaluateAll(
      profile({
        region: "astana",
        birthYear: 1990,
        adults: 1,
        incomeMonthly: 500000,
        employment: "official",
        housing: "own",
      }),
    );
    expect(find(out, "asp")).toBeUndefined();
  });
});

describe("Налоговые вычеты", () => {
  it("базовый вычет положен официально работающему", () => {
    const out = evaluateAll(
      profile({
        region: "almaty-city",
        birthYear: 1998,
        incomeMonthly: 400000,
        employment: "official",
        housing: "rent",
      }),
    );
    const ded = find(out, "base-tax-deduction");
    expect(ded?.verdict).toBe("yes");
    expect(ded?.amountMonthly).toBe(Math.round(mrp(30) * 0.1));
  });

  it("неофициальная работа дает вердикт almost", () => {
    const out = evaluateAll(
      profile({
        region: "almaty-city",
        birthYear: 1998,
        incomeMonthly: 400000,
        employment: "informal",
        housing: "rent",
      }),
    );
    expect(find(out, "base-tax-deduction")?.verdict).toBe("almost");
  });
});

describe("Семейные пособия", () => {
  it("пособие многодетным с четырьмя детьми", () => {
    const out = evaluateAll(
      profile({
        region: "shymkent",
        birthYear: 1988,
        adults: 2,
        childrenAges: [0, 4, 9, 15],
        incomeMonthly: 600000,
        employment: "official",
        housing: "own",
      }),
    );
    expect(find(out, "multichild-benefit")?.verdict).toBe("yes");
    // Новорожденный дает и пособие на рождение по повышенной ставке
    const birth = find(out, "birth-benefit");
    expect(birth?.amountOnce).toBe(mrp(63));
  });

  it("три ребенка: многодетное пособие almost", () => {
    const out = evaluateAll(
      profile({
        region: "shymkent",
        birthYear: 1988,
        adults: 2,
        childrenAges: [3, 7, 11],
        incomeMonthly: 600000,
        employment: "official",
        housing: "own",
      }),
    );
    expect(find(out, "multichild-benefit")?.verdict).toBe("almost");
  });
});

describe("Пенсионный возраст", () => {
  it("63 года дает право", () => {
    const out = evaluateAll(
      profile({
        region: "karaganda",
        birthYear: PARAMS_2026.year - 63,
        incomeMonthly: 0,
        employment: "notWorking",
        housing: "own",
      }),
    );
    expect(find(out, "age-pension")?.verdict).toBe("yes");
  });

  it("в 61 зависит от пола: almost", () => {
    const out = evaluateAll(
      profile({
        region: "karaganda",
        birthYear: PARAMS_2026.year - 61,
        incomeMonthly: 0,
        employment: "notWorking",
        housing: "own",
      }),
    );
    expect(find(out, "age-pension")?.verdict).toBe("almost");
  });
});

describe("Инвалидность", () => {
  it("первая группа: пособие, ТСР и вычет при официальной работе", () => {
    const out = evaluateAll(
      profile({
        region: "astana",
        birthYear: 1985,
        incomeMonthly: 300000,
        employment: "official",
        housing: "own",
        statuses: ["disability"],
        disabilityGroup: 1,
      }),
    );
    expect(find(out, "disability-benefit")?.verdict).toBe("yes");
    expect(find(out, "tsr")?.verdict).toBe("yes");
    expect(find(out, "social-tax-deduction")?.verdict).toBe("yes");
    expect(find(out, "caregiver-benefit")?.verdict).toBe("check");
  });
});

describe("Студент", () => {
  it("студент без своего жилья: стипендия, проезд, общежитие", () => {
    const out = evaluateAll(
      profile({
        region: "astana",
        birthYear: 2006,
        incomeMonthly: 100000,
        employment: "notWorking",
        housing: "rent",
        statuses: ["student"],
      }),
    );
    expect(find(out, "state-stipend")?.verdict).toBe("check");
    expect(find(out, "student-transport")?.verdict).toBe("yes");
    expect(find(out, "dormitory")?.verdict).toBe("yes");
    expect(find(out, "osms-state")?.verdict).toBe("yes");
  });
});

describe("Итоги", () => {
  it("годовая оценка равна месячной сумме за 12 месяцев плюс разовые", () => {
    const out = evaluateAll(
      profile({
        region: "turkestan",
        birthYear: 1995,
        adults: 2,
        childrenAges: [0, 3],
        incomeMonthly: 90000,
        employment: "notWorking",
        housing: "rent",
      }),
    );
    expect(out.totalYearly).toBe(out.totalMonthly * 12 + out.totalOnce);
    expect(out.totalMonthly).toBeGreaterThan(0);
    expect(out.totalOnce).toBeGreaterThan(0);
  });

  it("расчет по диапазону дохода помечается как приблизительный", () => {
    const out = evaluateAll(
      profile({
        region: "turkestan",
        birthYear: 1995,
        adults: 2,
        childrenAges: [2],
        incomeMonthly: null,
        incomeUnknown: true,
        incomeRange: "lt100",
        employment: "informal",
        housing: "rent",
      }),
    );
    expect(out.approximate).toBe(true);
  });
});
