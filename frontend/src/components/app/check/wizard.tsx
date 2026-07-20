"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Button, Checkbox, Input, Progress, Radio, Select } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";
import {
  type Answers,
  type Employment,
  type Housing,
  type IncomeRange,
  type StatusKey,
  REGIONS,
  emptyAnswers,
  loadAnswers,
  saveAnswers,
} from "@/lib/questionnaire";

const STEPS = [
  "region",
  "birthYear",
  "adults",
  "children",
  "income",
  "statuses",
  "employment",
  "housing",
] as const;

type StepId = (typeof STEPS)[number];

const CURRENT_YEAR = 2026;

export function Wizard() {
  const router = useRouter();
  const t = getDictionary();
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [stepIndex, setStepIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadAnswers();
    if (saved) setAnswers(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveAnswers(answers);
  }, [answers, hydrated]);

  const step = STEPS[stepIndex];
  const total = STEPS.length;

  function update(patch: Partial<Answers>) {
    setShowError(false);
    setAnswers((prev) => ({ ...prev, ...patch }));
  }

  function stepValid(current: StepId): boolean {
    switch (current) {
      case "region":
        return answers.region !== null && answers.region !== "";
      case "birthYear":
        return (
          answers.birthYear !== null &&
          answers.birthYear >= 1930 &&
          answers.birthYear <= CURRENT_YEAR - 14
        );
      case "adults":
        return answers.adults >= 1;
      case "children":
        return answers.childrenAges.every((age) => age >= 0 && age <= 17);
      case "income":
        return answers.incomeUnknown
          ? answers.incomeRange !== null
          : answers.incomeMonthly !== null && answers.incomeMonthly >= 0;
      case "statuses":
        return answers.statuses.includes("disability")
          ? answers.disabilityGroup !== null
          : true;
      case "employment":
        return answers.employment !== null;
      case "housing":
        return answers.housing !== null;
    }
  }

  function next() {
    if (!stepValid(step)) {
      setShowError(true);
      return;
    }
    if (stepIndex === total - 1) {
      router.push("/results");
      return;
    }
    setShowError(false);
    setStepIndex((i) => i + 1);
  }

  function back() {
    setShowError(false);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function toggleStatus(key: StatusKey) {
    const has = answers.statuses.includes(key);
    const statuses = has
      ? answers.statuses.filter((s) => s !== key)
      : [...answers.statuses, key];
    update({
      statuses,
      disabilityGroup: key === "disability" && has ? null : answers.disabilityGroup,
    });
  }

  const stepErrors: Record<StepId, string> = {
    region: t.wizard.required,
    birthYear: t.wizard.birthYear.error,
    adults: t.wizard.required,
    children: t.wizard.children.error,
    income: t.wizard.income.error,
    statuses: t.wizard.required,
    employment: t.wizard.employment.error,
    housing: t.wizard.housing.error,
  };

  const why: Record<StepId, string> = {
    region: t.wizard.region.why,
    birthYear: t.wizard.birthYear.why,
    adults: t.wizard.adults.why,
    children: t.wizard.children.why,
    income: t.wizard.income.why,
    statuses: t.wizard.statuses.why,
    employment: t.wizard.employment.why,
    housing: t.wizard.housing.why,
  };

  if (!hydrated) {
    return <div className="min-h-96" aria-hidden />;
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted">
          {t.wizard.stepLabel} {stepIndex + 1} {t.wizard.of} {total}
        </p>
        <Progress value={((stepIndex + 1) / total) * 100} label={`${stepIndex + 1} / ${total}`} />
      </div>

      <div className="flex min-h-72 flex-col gap-6">
        {step === "region" && (
          <StepBlock question={t.wizard.region.q} hint={t.wizard.region.hint}>
            <Select
              value={answers.region ?? ""}
              onChange={(e) => update({ region: e.target.value || null })}
            >
              <option value="" disabled>
                {t.wizard.region.placeholder}
              </option>
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
          </StepBlock>
        )}

        {step === "birthYear" && (
          <StepBlock question={t.wizard.birthYear.q} hint={t.wizard.birthYear.hint}>
            <Input
              type="number"
              inputMode="numeric"
              min={1930}
              max={CURRENT_YEAR - 14}
              placeholder="2001"
              value={answers.birthYear ?? ""}
              onChange={(e) =>
                update({ birthYear: e.target.value ? Number(e.target.value) : null })
              }
            />
          </StepBlock>
        )}

        {step === "adults" && (
          <StepBlock question={t.wizard.adults.q} hint={t.wizard.adults.hint}>
            <Select
              value={String(answers.adults)}
              onChange={(e) => update({ adults: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </StepBlock>
        )}

        {step === "children" && (
          <StepBlock question={t.wizard.children.q} hint={t.wizard.children.hint}>
            <Select
              value={String(answers.childrenAges.length)}
              onChange={(e) => {
                const count = Number(e.target.value);
                const ages = [...answers.childrenAges];
                while (ages.length < count) ages.push(0);
                update({ childrenAges: ages.slice(0, count) });
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
            {answers.childrenAges.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {answers.childrenAges.map((age, index) => (
                  <Select
                    key={index}
                    label={`${t.wizard.children.ageLabel} ${index + 1}`}
                    value={String(age)}
                    onChange={(e) => {
                      const ages = [...answers.childrenAges];
                      ages[index] = Number(e.target.value);
                      update({ childrenAges: ages });
                    }}
                  >
                    {Array.from({ length: 18 }, (_, i) => (
                      <option key={i} value={i}>
                        {i} {t.wizard.children.years}
                      </option>
                    ))}
                  </Select>
                ))}
              </div>
            )}
          </StepBlock>
        )}

        {step === "income" && (
          <StepBlock question={t.wizard.income.q} hint={t.wizard.income.hint}>
            {!answers.incomeUnknown && (
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder={t.wizard.income.placeholder}
                value={answers.incomeMonthly ?? ""}
                onChange={(e) =>
                  update({ incomeMonthly: e.target.value ? Number(e.target.value) : null })
                }
              />
            )}
            <Checkbox
              label={t.wizard.income.unknownLabel}
              checked={answers.incomeUnknown}
              onChange={(e) =>
                update({
                  incomeUnknown: e.target.checked,
                  incomeMonthly: e.target.checked ? null : answers.incomeMonthly,
                  incomeRange: e.target.checked ? answers.incomeRange : null,
                })
              }
            />
            {answers.incomeUnknown && (
              <Select
                label={t.wizard.income.rangeLabel}
                value={answers.incomeRange ?? ""}
                onChange={(e) =>
                  update({ incomeRange: (e.target.value || null) as IncomeRange | null })
                }
              >
                <option value="" disabled>
                  {t.wizard.income.rangeLabel}
                </option>
                {(Object.keys(t.wizard.income.ranges) as IncomeRange[]).map((key) => (
                  <option key={key} value={key}>
                    {t.wizard.income.ranges[key]}
                  </option>
                ))}
              </Select>
            )}
          </StepBlock>
        )}

        {step === "statuses" && (
          <StepBlock question={t.wizard.statuses.q} hint={t.wizard.statuses.hint}>
            <div className="flex flex-col gap-4">
              {(Object.keys(t.wizard.statuses.items) as StatusKey[]).map((key) => (
                <Checkbox
                  key={key}
                  label={t.wizard.statuses.items[key]}
                  checked={answers.statuses.includes(key)}
                  onChange={() => toggleStatus(key)}
                />
              ))}
            </div>
            {answers.statuses.includes("disability") && (
              <Select
                label={t.wizard.statuses.groupLabel}
                value={answers.disabilityGroup ? String(answers.disabilityGroup) : ""}
                onChange={(e) =>
                  update({
                    disabilityGroup: e.target.value
                      ? (Number(e.target.value) as 1 | 2 | 3)
                      : null,
                  })
                }
              >
                <option value="" disabled>
                  {t.wizard.statuses.groupLabel}
                </option>
                {(["1", "2", "3"] as const).map((g) => (
                  <option key={g} value={g}>
                    {t.wizard.statuses.groups[g]}
                  </option>
                ))}
              </Select>
            )}
          </StepBlock>
        )}

        {step === "employment" && (
          <StepBlock question={t.wizard.employment.q}>
            <div className="flex flex-col gap-4">
              {(Object.keys(t.wizard.employment.items) as Employment[]).map((key) => (
                <Radio
                  key={key}
                  name="employment"
                  label={t.wizard.employment.items[key]}
                  checked={answers.employment === key}
                  onChange={() => update({ employment: key })}
                />
              ))}
            </div>
          </StepBlock>
        )}

        {step === "housing" && (
          <StepBlock question={t.wizard.housing.q}>
            <div className="flex flex-col gap-4">
              {(Object.keys(t.wizard.housing.items) as Housing[]).map((key) => (
                <Radio
                  key={key}
                  name="housing"
                  label={t.wizard.housing.items[key]}
                  checked={answers.housing === key}
                  onChange={() => update({ housing: key })}
                />
              ))}
            </div>
          </StepBlock>
        )}

        {showError && (
          <p className="text-sm font-medium text-fg" role="alert">
            {stepErrors[step]}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" onClick={back} disabled={stepIndex === 0}>
          <ArrowLeft className="size-4" aria-hidden />
          {t.wizard.back}
        </Button>
        <Button onClick={next}>
          {stepIndex === total - 1 ? t.wizard.finish : t.wizard.next}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>

      <p className="flex items-start gap-2 border-t border-border pt-4 text-sm leading-relaxed text-faint">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        {t.wizard.whyWeAsk}: {why[step]}
      </p>
    </div>
  );
}

function StepBlock({
  question,
  hint,
  children,
}: {
  question: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-heading text-2xl leading-snug font-semibold text-fg">{question}</h2>
        {hint && <p className="text-sm text-muted">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
