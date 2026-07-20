import { Accessibility, Briefcase, GraduationCap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";

const icons = {
  users: Users,
  graduation: GraduationCap,
  accessibility: Accessibility,
  briefcase: Briefcase,
} as const;

export function Segments() {
  const t = getDictionary();

  return (
    <section id="segments" className="scroll-mt-16 border-b border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-24">
        <div className="flex flex-col gap-3">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-fg">
            {t.landing.segments.title}
          </h2>
          <p className="max-w-2xl text-base text-muted">{t.landing.segments.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.landing.segments.items.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons] ?? Users;
            return (
              <Card key={item.title}>
                <CardContent className="flex flex-col gap-4 p-6">
                  <Icon className="size-6 text-accent" aria-hidden />
                  <h3 className="font-heading text-base font-semibold text-fg">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{item.text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
