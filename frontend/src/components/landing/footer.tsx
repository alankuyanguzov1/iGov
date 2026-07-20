import { getDictionary } from "@/lib/i18n";

export function LandingFooter() {
  const t = getDictionary();

  return (
    <footer>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
        <p className="max-w-3xl text-sm leading-relaxed text-faint">
          {t.landing.footer.disclaimer}
        </p>
        <p className="text-sm text-faint">{t.landing.footer.rights}</p>
      </div>
    </footer>
  );
}
