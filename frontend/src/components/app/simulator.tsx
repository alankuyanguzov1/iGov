"use client";

import { useMemo, useState } from "react";
import {
  Minus,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";
import type { Answers, Employment, IncomeRange } from "@/lib/questionnaire";
import { formatKzt } from "@/content/parameters";
import { getBenefitBySlug } from "@/content/benefits";
import { evaluateAll } from "@/rules/engine";

const RANGE_MIDPOINTS: Record<IncomeRange, number> = {
  lt100: 75000,
  r100to250: 175000,
  r250to500: 375000,
  gt500: 600000,
};

function materialize(a: Answers): Answers {
  return {
    ...a,
    incomeUnknown: false,
    incomeRange: null,
    incomeMonthly:
      a.incomeMonthly ?? (a.incomeRange ? RANGE_MIDPOINTS[a.incomeRange] : 0),
  };
}

type SimulatorProps = {
  base: Answers;
  onApply: (answers: Answers) => void;
};

export function Simulator({ base, onApply }: SimulatorProps) {
  const t = getDictionary();
  const baseline = useMemo(() => materialize(base), [base]);
  const [sim, setSim] = useState<Answers>(baseline);

  const baseOut = useMemo(() => evaluateAll(baseline), [baseline]);
  const simOut = useMemo(() => evaluateAll(sim), [sim]);

  const changed = JSON.stringify(sim) !== JSON.stringify(baseline);
  const delta = simOut.totalYearly - baseOut.totalYearly;

  const baseSlugs = new Set(baseOut.eligible.map((r) => r.slug));
  const simSlugs = new Set(simOut.eligible.map((r) => r.slug));
  const appeared = [...simSlugs]
    .filter((s) => !baseSlugs.has(s))
    .map((s) => getBenefitBySlug(s)?.title)
    .filter(Boolean) as string[];
  const disappeared = [...baseSlugs]
    .filter((s) => !simSlugs.has(s))
    .map((s) => getBenefitBySlug(s)?.title)
    .filter(Boolean) as string[];

  function update(patch: Partial<Answers>) {
    setSim((prev) => ({ ...prev, ...patch }));
  }

  function setChildrenCount(count: number) {
    const next = Math.max(0, Math.min(10, count));
    const ages = [...sim.childrenAges];
    while (ages.length < next) ages.push(0);
    update({ childrenAges: ages.slice(0, next) });
  }

  return (
    <section className="flex flex-col gap-6 border border-border p-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="size-5 text-accent" aria-hidden />
          <h2 className="font-heading text-xl font-semibold text-fg">{t.simulator.title}</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted">{t.simulator.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Input
          label={t.simulator.income}
          type="number"
          inputMode="numeric"
          min={0}
          value={sim.incomeMonthly ?? ""}
          onChange={(e) =>
            update({ incomeMonthly: e.target.value ? Number(e.target.value) : 0 })
          }
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-fg">{t.simulator.children}</span>
          <div className="flex h-10 items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setChildrenCount(sim.childrenAges.length - 1)}
              disabled={sim.childrenAges.length === 0}
              aria-label="minus"
            >
              <Minus className="size-4" aria-hidden />
            </Button>
            <span className="w-6 text-center text-base font-medium text-fg">
              {sim.childrenAges.length}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setChildrenCount(sim.childrenAges.length + 1)}
              disabled={sim.childrenAges.length >= 10}
              aria-label="plus"
            >
              <Plus className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
        <Select
          label={t.simulator.employment}
          value={sim.employment ?? ""}
          onChange={(e) => update({ employment: (e.target.value || null) as Employment | null })}
        >
          {(Object.keys(t.wizard.employment.items) as Employment[]).map((key) => (
            <option key={key} value={key}>
              {t.wizard.employment.items[key]}
            </option>
          ))}
        </Select>
      </div>

      {changed && (delta !== 0 || appeared.length > 0 || disappeared.length > 0) ? (
        <div className="flex flex-col gap-4 border-t border-border pt-5">
          <div className="flex items-center gap-3">
            {delta >= 0 ? (
              <TrendingUp className="size-5 text-accent" aria-hidden />
            ) : (
              <TrendingDown className="size-5 text-fg" aria-hidden />
            )}
            <p className="text-sm text-muted">{t.simulator.delta}</p>
            <p
              className={`font-heading text-2xl font-bold tracking-tight ${
                delta >= 0 ? "text-accent" : "text-fg"
              }`}
            >
              {delta > 0 ? "+" : ""}
              {formatKzt(delta)}
            </p>
          </div>
          {appeared.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-fg">{t.simulator.appeared}</p>
              <ul className="flex flex-col gap-1.5">
                {appeared.map((title) => (
                  <li key={title} className="flex items-center gap-2 text-sm text-fg">
                    <Plus className="size-3.5 shrink-0 text-accent" aria-hidden />
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {disappeared.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-fg">{t.simulator.disappeared}</p>
              <ul className="flex flex-col gap-1.5">
                {disappeared.map((title) => (
                  <li key={title} className="flex items-center gap-2 text-sm text-muted">
                    <Minus className="size-3.5 shrink-0 text-faint" aria-hidden />
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : changed ? (
        <p className="border-t border-border pt-5 text-sm text-muted">
          {t.simulator.noChanges}
        </p>
      ) : null}

      {changed && (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setSim(baseline)}>
            <RotateCcw className="size-4" aria-hidden />
            {t.simulator.reset}
          </Button>
          <Button size="sm" onClick={() => onApply(sim)}>
            {t.simulator.apply}
          </Button>
        </div>
      )}
    </section>
  );
}
