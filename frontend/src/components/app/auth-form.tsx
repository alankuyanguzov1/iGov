"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import { getDictionary } from "@/lib/i18n";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const t = getDictionary();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(t.auth.passwordHint);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (result.error) {
      setError(translateAuthError(result.error.message));
      setLoading(false);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      // Включено подтверждение почты: сессии нет, ждем клика по ссылке из письма
      setAwaitingConfirm(true);
      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  if (awaitingConfirm) {
    return (
      <div className="flex flex-col items-start gap-4 border border-border p-6">
        <MailCheck className="size-6 text-accent" aria-hidden />
        <h2 className="font-heading text-lg font-semibold text-fg">
          {t.auth.checkEmailTitle}
        </h2>
        <p className="text-sm leading-relaxed text-muted">{t.auth.checkEmailText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      <Input
        label={t.auth.email}
        type="email"
        autoComplete="email"
        placeholder={t.auth.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label={t.auth.password}
        type="password"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        hint={mode === "signup" ? t.auth.passwordHint : undefined}
        error={error ?? undefined}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} className="w-full">
        {mode === "login" ? t.auth.loginCta : t.auth.signupCta}
      </Button>
      {mode === "signup" && (
        <p className="text-sm leading-relaxed text-faint">
          {t.auth.consentPrefix}{" "}
          <Link href="/terms" className="text-muted underline hover:text-fg">
            {t.auth.consentTerms}
          </Link>{" "}
          {t.auth.consentAnd}{" "}
          <Link href="/privacy" className="text-muted underline hover:text-fg">
            {t.auth.consentPrivacy}
          </Link>
        </p>
      )}
    </form>
  );
}
