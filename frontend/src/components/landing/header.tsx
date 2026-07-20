import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";

export function LandingHeader() {
  const t = getDictionary();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-heading text-base font-bold tracking-tight text-fg">
          {t.common.brand}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#how" className="text-sm text-muted transition-colors hover:text-fg">
            {t.landing.nav.how}
          </a>
          <a href="#segments" className="text-sm text-muted transition-colors hover:text-fg">
            {t.landing.nav.segments}
          </a>
          <a href="#faq" className="text-sm text-muted transition-colors hover:text-fg">
            {t.landing.nav.faq}
          </a>
          <Link href="/benefits" className="text-sm text-muted transition-colors hover:text-fg">
            {t.benefits.title}
          </Link>
        </nav>
        <ButtonLink href="/check" size="sm">
          {t.landing.nav.cta}
        </ButtonLink>
      </div>
    </header>
  );
}
