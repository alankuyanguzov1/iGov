import { ChevronDown } from "lucide-react";
import { getDictionary } from "@/lib/i18n";

export function Faq() {
  const t = getDictionary();

  return (
    <section id="faq" className="scroll-mt-16 border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-24">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-fg">
          {t.landing.faq.title}
        </h2>
        <div className="flex max-w-3xl flex-col">
          {t.landing.faq.items.map((item) => (
            <details key={item.q} className="group border-b border-border py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-fg [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="max-w-2xl pt-4 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
