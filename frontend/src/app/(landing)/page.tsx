import { getDictionary } from "@/lib/i18n";

export default function LandingPage() {
  const t = getDictionary();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="font-heading text-4xl font-bold tracking-tight text-fg md:text-5xl">
        {t.landing.title}
      </h1>
      <p className="max-w-xl text-center text-base leading-relaxed text-muted">
        {t.landing.subtitle}
      </p>
    </main>
  );
}
