"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Pencil, Search } from "lucide-react";
import {
  Badge,
  ButtonLink,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { getDictionary } from "@/lib/i18n";
import { type Answers, loadAnswers, regionLabel } from "@/lib/questionnaire";
import { formatKzt } from "@/content/parameters";

export default function ResultsPage() {
  const t = getDictionary();
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAnswers(loadAnswers());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <main className="min-h-96" aria-hidden />;
  }

  if (!answers || !answers.region) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-col items-start gap-6 px-6 py-24">
        <ClipboardList className="size-8 text-faint" aria-hidden />
        <h1 className="font-heading text-3xl font-bold tracking-tight text-fg">
          {t.results.emptyTitle}
        </h1>
        <p className="text-base leading-relaxed text-muted">{t.results.emptyText}</p>
        <ButtonLink href="/check" size="lg">
          {t.results.emptyCta}
        </ButtonLink>
      </main>
    );
  }

  const L = t.results.labels;
  const income = answers.incomeUnknown
    ? `${L.incomeUnknownPrefix}: ${
        answers.incomeRange ? t.wizard.income.ranges[answers.incomeRange] : ""
      }`
    : answers.incomeMonthly !== null
      ? formatKzt(answers.incomeMonthly)
      : "";

  const family =
    `${answers.adults} ${L.adults}` +
    (answers.childrenAges.length > 0
      ? `, ${answers.childrenAges.length} ${L.children}`
      : `, ${L.noChildren}`);

  const statusLabels =
    answers.statuses.length > 0
      ? answers.statuses.map((s) => t.wizard.statuses.items[s])
      : [L.noStatuses];

  const rows: { label: string; value: string }[] = [
    { label: L.region, value: regionLabel(answers.region) },
    { label: L.birthYear, value: answers.birthYear ? String(answers.birthYear) : "" },
    { label: L.family, value: family },
    { label: L.income, value: income },
    {
      label: L.employment,
      value: answers.employment ? t.wizard.employment.items[answers.employment] : "",
    },
    {
      label: L.housing,
      value: answers.housing ? t.wizard.housing.items[answers.housing] : "",
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-fg">
          {t.results.title}
        </h1>
        <p className="text-base leading-relaxed text-muted">{t.results.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{L.statuses}</CardTitle>
          <div className="flex flex-wrap gap-2 pt-1">
            {statusLabels.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-col divide-y divide-border">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-muted">{row.label}</dt>
                <dd className="text-right text-sm font-medium text-fg">{row.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <ButtonLink href="/check" variant="secondary">
          <Pencil className="size-4" aria-hidden />
          {t.results.editCta}
        </ButtonLink>
        <ButtonLink href="/benefits" variant="ghost">
          <Search className="size-4" aria-hidden />
          {t.results.catalogCta}
        </ButtonLink>
      </div>

      <p className="border-t border-border pt-4 text-sm leading-relaxed text-faint">
        {t.results.note}
      </p>
    </main>
  );
}
