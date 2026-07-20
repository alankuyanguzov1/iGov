import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";

export default function NotFound() {
  const t = getDictionary();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-start justify-center gap-6 px-6">
      <SearchX className="size-8 text-faint" aria-hidden />
      <h1 className="font-heading text-3xl font-bold tracking-tight text-fg">
        {t.notFound.title}
      </h1>
      <p className="text-base leading-relaxed text-muted">{t.notFound.text}</p>
      <ButtonLink href="/">{t.notFound.cta}</ButtonLink>
    </main>
  );
}
