import { redirect } from "next/navigation";
import { FolderOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n";

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
      <Card>
        <CardContent className="flex flex-col items-start gap-3 p-6">
          <FolderOpen className="size-6 text-faint" aria-hidden />
          <h2 className="font-heading text-base font-semibold text-fg">
            {t.account.placeholderTitle}
          </h2>
          <p className="text-sm leading-relaxed text-muted">{t.account.placeholderText}</p>
        </CardContent>
      </Card>
    </main>
  );
}
