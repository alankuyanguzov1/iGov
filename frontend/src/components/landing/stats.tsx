import { getDictionary } from "@/lib/i18n";

export function Stats() {
  const t = getDictionary();

  return (
    <section className="border-b border-border">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {t.landing.stats.items.map((item) => (
          <div key={item.value} className="flex flex-col gap-3 px-6 py-12">
            <span className="font-heading text-4xl font-bold tracking-tight text-accent">
              {item.value}
            </span>
            <span className="max-w-xs text-sm leading-relaxed text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
