"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CircleCheck, CircleHelp, ClipboardList, Pencil } from "lucide-react";
import {
  Badge,
  ButtonLink,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { getDictionary } from "@/lib/i18n";
import { type Answers, loadAnswers } from "@/lib/questionnaire";
import { getBenefitBySlug } from "@/content/benefits";
import { formatKzt } from "@/content/parameters";
import { evaluateAll } from "@/rules/engine";
import type { RuleResult } from "@/rules/types";

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

  const output = evaluateAll(answers);
  const hasAny =
    output.eligible.length > 0 || output.almost.length > 0 || output.check.length > 0;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-fg">
            {t.results.title}
          </h1>
          <p className="text-base text-muted">{t.results.subtitle}</p>
        </div>
        <ButtonLink href="/check" variant="secondary" size="sm">
          <Pencil className="size-4" aria-hidden />
          {t.results.editCta}
        </ButtonLink>
      </div>

      {output.totalYearly > 0 && (
        <section className="flex flex-col gap-4 border border-border p-6">
          <p className="text-sm text-muted">{t.results.totalTitle}</p>
          <p className="font-heading text-4xl font-bold tracking-tight text-accent">
            {formatKzt(output.totalYearly)}
            <span className="ml-2 text-base font-normal text-muted">
              {t.results.totalYearly}
            </span>
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
            {output.totalMonthly > 0 && (
              <span>
                {formatKzt(output.totalMonthly)} {t.results.perMonth}
              </span>
            )}
            {output.totalOnce > 0 && (
              <span>
                {formatKzt(output.totalOnce)} {t.results.once}
              </span>
            )}
          </div>
          {output.approximate && <Badge>{t.results.approxBadge}</Badge>}
        </section>
      )}

      {!hasAny && (
        <section className="flex flex-col items-start gap-4">
          <h2 className="font-heading text-xl font-semibold text-fg">{t.results.noneTitle}</h2>
          <p className="text-base text-muted">{t.results.noneText}</p>
          <ButtonLink href="/benefits" variant="secondary">
            {t.results.catalogCta}
          </ButtonLink>
        </section>
      )}

      {output.eligible.length > 0 && (
        <ResultSection
          title={t.results.eligibleTitle}
          subtitle={t.results.eligibleSubtitle}
          items={output.eligible}
          t={t}
        />
      )}
      {output.almost.length > 0 && (
        <ResultSection
          title={t.results.almostTitle}
          subtitle={t.results.almostSubtitle}
          items={output.almost}
          t={t}
        />
      )}
      {output.check.length > 0 && (
        <ResultSection
          title={t.results.checkTitle}
          subtitle={t.results.checkSubtitle}
          items={output.check}
          t={t}
        />
      )}

      <p className="border-t border-border pt-4 text-sm leading-relaxed text-faint">
        {t.results.estimateNote}
      </p>
    </main>
  );
}

function ResultSection({
  title,
  subtitle,
  items,
  t,
}: {
  title: string;
  subtitle: string;
  items: RuleResult[];
  t: ReturnType<typeof getDictionary>;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold text-fg">
          {title} <span className="text-muted">{items.length}</span>
        </h2>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((result) => (
          <ResultCard key={result.slug} result={result} t={t} />
        ))}
      </div>
    </section>
  );
}

function ResultCard({
  result,
  t,
}: {
  result: RuleResult;
  t: ReturnType<typeof getDictionary>;
}) {
  const benefit = getBenefitBySlug(result.slug);
  if (!benefit) return null;

  const amount =
    result.amountMonthly !== undefined && result.amountMonthly > 0
      ? `${formatKzt(result.amountMonthly)} ${t.results.perMonth}`
      : result.amountOnce !== undefined && result.amountOnce > 0
        ? `${formatKzt(result.amountOnce)} ${t.results.once}`
        : result.amountNote;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle className="text-base leading-snug">{benefit.title}</CardTitle>
          {benefit.proactive && (
            <Badge variant="outline">
              <Bell className="size-3" aria-hidden />
              {t.results.proactiveBadge}
            </Badge>
          )}
        </div>
        {amount && <p className="text-lg font-semibold text-accent">{amount}</p>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {result.reasons.length > 0 && (
          <ul className="flex flex-col gap-2">
            {result.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2.5 text-sm leading-relaxed text-fg">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                {reason}
              </li>
            ))}
          </ul>
        )}
        {result.missing && result.missing.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-fg">{t.results.missingLabel}</p>
            <ul className="flex flex-col gap-2">
              {result.missing.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                  <CircleHelp className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link
          href={`/benefits/${benefit.slug}`}
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          {t.results.detailsCta}
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </CardContent>
    </Card>
  );
}
