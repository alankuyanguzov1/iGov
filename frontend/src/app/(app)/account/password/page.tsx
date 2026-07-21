"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import { getDictionary } from "@/lib/i18n";

export default function NewPasswordPage() {
  const router = useRouter();
  const t = getDictionary();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) router.replace("/login");
    })();
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError(t.auth.passwordHint);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(translateAuthError(updateError.message));
      setLoading(false);
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-col gap-8 px-6 py-24">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-fg">
          {t.auth.newPasswordTitle}
        </h1>
        <p className="text-sm leading-relaxed text-muted">{t.auth.newPasswordSubtitle}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Input
          label={t.auth.password}
          type="password"
          autoComplete="new-password"
          hint={t.auth.passwordHint}
          error={error ?? undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          {t.auth.newPasswordCta}
        </Button>
      </form>
    </main>
  );
}
