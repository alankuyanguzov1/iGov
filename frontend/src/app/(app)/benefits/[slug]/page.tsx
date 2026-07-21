import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  Bell,
  CircleCheck,
  ExternalLink,
  FileText,
  ListChecks,
  MessageCircleQuestion,
  Scale,
  Users,
} from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, buttonClasses } from "@/components/ui";
import { AskBenefit } from "@/components/app/ask-benefit";
import { BenefitTracker } from "@/components/app/benefit-tracker";
import { allBenefits, categoryTitles, getBenefitBySlug } from "@/content/benefits";
import { getDictionary } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allBenefits.map((benefit) => ({ slug: benefit.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const benefit = getBenefitBySlug(slug);
  if (!benefit) return {};
  return {
    title: `${benefit.title} | GovAid Navigator`,
    description: benefit.shortDesc,
  };
}

export default async function BenefitPage({ params }: PageProps) {
  const { slug } = await params;
  const benefit = getBenefitBySlug(slug);

  if (!benefit) {
    notFound();
  }

  const t = getDictionary();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <Link
        href="/benefits"
        className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t.benefits.backToCatalog}
      </Link>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{categoryTitles[benefit.category]}</Badge>
          {benefit.level === "regional" && <Badge>{t.benefits.regionalBadge}</Badge>}
          {benefit.proactive && (
            <Badge variant="outline">
              <Bell className="size-3" aria-hidden />
              {t.benefits.proactiveBadge}
            </Badge>
          )}
        </div>
        <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-fg">
          {benefit.title}
        </h1>
        <p className="text-base leading-relaxed text-muted">{benefit.shortDesc}</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-3">
          <Banknote className="size-5 text-accent" aria-hidden />
          <CardTitle>{t.benefits.whatYouGet}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-fg">{benefit.whatYouGet}</p>
          <div className="rounded-sm border border-border p-4">
            <p className="text-sm font-medium text-fg">{benefit.amountFormula}</p>
            <p className="mt-2 text-sm text-muted">{benefit.amountExample}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3">
          <Users className="size-5 text-accent" aria-hidden />
          <CardTitle>{t.benefits.whoEligible}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {benefit.whoEligible.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-fg">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3">
          <ListChecks className="size-5 text-accent" aria-hidden />
          <CardTitle>{t.benefits.howToApply}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <ol className="flex flex-col gap-3">
            {benefit.howToApply.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-fg">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-accent text-xs font-semibold text-white">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          {benefit.applyUrl && (
            <a
              href={benefit.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "md", "w-fit")}
            >
              {t.benefits.applyCta}
              <ExternalLink className="size-4" aria-hidden />
            </a>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3">
          <FileText className="size-5 text-accent" aria-hidden />
          <CardTitle>{t.benefits.documents}</CardTitle>
        </CardHeader>
        <CardContent>
          <BenefitTracker slug={benefit.slug} documents={benefit.documents} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <MessageCircleQuestion className="size-5 text-accent" aria-hidden />
            <CardTitle>{t.ask.title}</CardTitle>
          </div>
          <p className="text-sm text-muted">{t.ask.subtitle}</p>
        </CardHeader>
        <CardContent>
          <AskBenefit slug={benefit.slug} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 border-t border-border pt-6">
        <a
          href={benefit.legalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent-hover"
        >
          <Scale className="size-4" aria-hidden />
          {benefit.legalRef}
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
        <p className="text-sm text-faint">
          {t.benefits.verifiedAt}: {new Date(benefit.verifiedAt).toLocaleDateString("ru-RU")}
          {benefit.verification === "needs_check" && ` · ${t.benefits.needsCheck}`}
        </p>
        <p className="text-sm leading-relaxed text-faint">{t.benefits.disclaimer}</p>
      </div>
    </main>
  );
}
