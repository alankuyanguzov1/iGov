import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { Badge, Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { allBenefits, categoryOrder, categoryTitles, getBenefitsByCategory } from "@/content/benefits";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Каталог мер поддержки | GovAid Navigator",
  description:
    "Все меры государственной поддержки Казахстана в одном каталоге: пособия, вычеты, гранты и жилищные программы с суммами и ссылками на законы.",
};

export default function BenefitsPage() {
  const t = getDictionary();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-fg md:text-4xl">
          {t.benefits.title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">{t.benefits.subtitle}</p>
        <p className="text-sm text-faint">
          {t.benefits.count}: {allBenefits.length}
        </p>
      </div>

      {categoryOrder.map((category) => {
        const items = getBenefitsByCategory(category);
        if (items.length === 0) return null;

        return (
          <section key={category} className="flex flex-col gap-6">
            <h2 className="font-heading text-xl font-semibold text-fg">
              {categoryTitles[category]}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {items.map((benefit) => (
                <Link key={benefit.slug} href={`/benefits/${benefit.slug}`} className="group">
                  <Card className="h-full transition-colors group-hover:border-fg">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base leading-snug">{benefit.title}</CardTitle>
                        <ArrowRight
                          className="mt-1 size-4 shrink-0 text-faint transition-colors group-hover:text-accent"
                          aria-hidden
                        />
                      </div>
                      <CardDescription>{benefit.shortDesc}</CardDescription>
                      {benefit.proactive && (
                        <Badge variant="outline" className="mt-2 w-fit">
                          <Bell className="size-3" aria-hidden />
                          {t.benefits.proactiveBadge}
                        </Badge>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <p className="max-w-3xl border-t border-border pt-6 text-sm leading-relaxed text-faint">
        {t.benefits.disclaimer}
      </p>
    </main>
  );
}
