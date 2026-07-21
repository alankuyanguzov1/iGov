"use client";

import { useState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { getDictionary } from "@/lib/i18n";

export default function ResetPage() {
  const t = getDictionary();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email);
    setSent(true);
    setLoading(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-col gap-8 px-6 py-24">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-fg">
          {t.auth.resetTitle}
        </h1>
        <p className="text-sm leading-relaxed text-muted">{t.auth.resetSubtitle}</p>
      </div>

      {sent ? (
        <div className="flex flex-col items-start gap-4 border border-border p-6">
          <MailCheck className="size-6 text-accent" aria-hidden />
          <p className="text-sm leading-relaxed text-muted">{t.auth.resetSent}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <Input
            label={t.auth.email}
            type="email"
            autoComplete="email"
            placeholder={t.auth.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            {t.auth.resetCta}
          </Button>
        </form>
      )}

      <p className="text-sm text-muted">
        <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
          {t.auth.toLogin}
        </Link>
      </p>
    </main>
  );
}
