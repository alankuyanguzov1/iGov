import type { Metadata } from "next";
import { Wizard } from "@/components/app/check/wizard";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Анкета | GovAid Navigator",
  description:
    "Восемь простых вопросов, чтобы узнать ваши выплаты, вычеты и льготы. Анонимно и бесплатно.",
};

export default function CheckPage() {
  const t = getDictionary();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-10 px-6 py-16">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-fg">
        {t.check.title}
      </h1>
      <Wizard />
    </main>
  );
}
