import { ArrowRight, Clock } from "lucide-react";
import { ButtonLink, buttonClasses } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";

export function Hero() {
  const t = getDictionary();

  return (
    <section className="border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 py-24 md:py-32">
        <h1 className="max-w-3xl font-heading text-4xl leading-tight font-bold tracking-tight text-fg md:text-6xl">
          {t.landing.hero.title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {t.landing.hero.subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/check" size="lg">
            {t.landing.hero.ctaPrimary}
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <a href="#how" className={buttonClasses("ghost", "lg")}>
            {t.landing.hero.ctaSecondary}
          </a>
        </div>
        <p className="flex items-center gap-2 text-sm text-faint">
          <Clock className="size-4" aria-hidden />
          {t.landing.hero.note}
        </p>
      </div>
    </section>
  );
}
