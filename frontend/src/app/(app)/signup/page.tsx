import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/app/auth-form";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/account");
  }

  const t = getDictionary();

  return (
    <main className="mx-auto flex w-full max-w-sm flex-col gap-8 px-6 py-24">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-fg">
          {t.auth.signupTitle}
        </h1>
        <p className="text-sm leading-relaxed text-muted">{t.auth.signupSubtitle}</p>
      </div>
      <AuthForm mode="signup" />
      <p className="text-sm text-muted">
        {t.auth.haveAccount}{" "}
        <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
          {t.auth.toLogin}
        </Link>
      </p>
    </main>
  );
}
