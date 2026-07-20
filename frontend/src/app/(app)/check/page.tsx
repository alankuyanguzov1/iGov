import { getDictionary } from "@/lib/i18n";

export default function CheckPage() {
  const t = getDictionary();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="font-heading text-3xl font-semibold text-fg">{t.check.title}</h1>
    </main>
  );
}
