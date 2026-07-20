import { getDictionary } from "@/lib/i18n";

export function HowItWorks() {
  const t = getDictionary();

  return (
    <section id="how" className="scroll-mt-16 border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-24">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-fg">
          {t.landing.how.title}
        </h2>
        <ol className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {t.landing.how.steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-4">
              <span className="flex size-10 items-center justify-center rounded-sm bg-accent font-heading text-base font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="font-heading text-lg font-semibold text-fg">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
