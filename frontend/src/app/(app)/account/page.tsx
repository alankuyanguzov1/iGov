import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FolderOpen } from "lucide-react";
import {
  Badge,
  ButtonLink,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n";
import { getBenefitBySlug } from "@/content/benefits";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const t = getDictionary();
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("ru-RU")
    : null;

  const { data: savedRows } = await supabase
    .from("user_benefits")
    .select("benefit_slug, status, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const saved = (savedRows ?? [])
    .map((row) => ({
      benefit: getBenefitBySlug(row.benefit_slug as string),
      status: row.status as string,
    }))
    .filter((item) => item.benefit !== undefined);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-fg">
        {t.account.title}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{user.email}</CardTitle>
          {createdAt && (
            <CardDescription>
              {t.account.sinceLabel}: {createdAt}
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold text-fg">
            {t.account.savedTitle}{" "}
            {saved.length > 0 && <span className="text-muted">{saved.length}</span>}
          </h2>
          <div className="flex items-center gap-3">
            <ButtonLink href="/check" variant="secondary" size="sm">
              {t.account.retakeCta}
            </ButtonLink>
            <ButtonLink href="/results" variant="ghost" size="sm">
              {t.account.resultsCta}
            </ButtonLink>
          </div>
        </div>

        {saved.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-start gap-3 p-6">
              <FolderOpen className="size-6 text-faint" aria-hidden />
              <p className="text-sm leading-relaxed text-muted">{t.account.savedEmpty}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {saved.map(({ benefit, status }) => (
              <Link key={benefit!.slug} href={`/benefits/${benefit!.slug}`} className="group">
                <Card className="transition-colors group-hover:border-fg">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1.5">
                        <CardTitle className="text-base leading-snug">
                          {benefit!.title}
                        </CardTitle>
                        <CardDescription>{benefit!.shortDesc}</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="accent">
                          {t.tracker.statuses[status as keyof typeof t.tracker.statuses] ??
                            status}
                        </Badge>
                        <ArrowRight
                          className="size-4 shrink-0 text-faint transition-colors group-hover:text-accent"
                          aria-hidden
                        />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
