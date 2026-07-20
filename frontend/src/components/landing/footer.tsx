import Link from "next/link";
import { getDictionary } from "@/lib/i18n";

export function LandingFooter() {
  const t = getDictionary();

  return (
    <footer>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
        <p className="max-w-3xl text-sm leading-relaxed text-faint">
          {t.landing.footer.disclaimer}
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <p className="text-sm text-faint">{t.landing.footer.rights}</p>
          <Link
            href="/privacy"
            className="text-sm text-faint transition-colors hover:text-fg"
          >
            {t.landing.footer.privacy}
          </Link>
          <Link href="/terms" className="text-sm text-faint transition-colors hover:text-fg">
            {t.landing.footer.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
}
