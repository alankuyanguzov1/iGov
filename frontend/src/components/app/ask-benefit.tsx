"use client";

import { useState } from "react";
import { MessageCircleQuestion, Send } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";

type AskBenefitProps = {
  slug: string;
};

export function AskBenefit({ slug }: AskBenefitProps) {
  const t = getDictionary();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(text: string) {
    const q = text.trim();
    if (q.length < 3 || loading) return;
    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, question: q }),
      });

      if (res.status === 429) {
        setError(t.ask.errorLimit);
      } else if (res.status === 503) {
        setError(t.ask.errorConfig);
      } else if (!res.ok) {
        setError(t.ask.errorGeneric);
      } else {
        const data = (await res.json()) as { answer?: string };
        setAnswer(data.answer ?? "");
      }
    } catch {
      setError(t.ask.errorGeneric);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {t.ask.suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQuestion(s);
              void ask(s);
            }}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-fg hover:text-fg"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(question);
        }}
        className="flex items-start gap-3"
      >
        <Input
          placeholder={t.ask.placeholder}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={500}
        />
        <Button type="submit" loading={loading} aria-label={t.ask.cta}>
          <Send className="size-4" aria-hidden />
          {t.ask.cta}
        </Button>
      </form>

      {error && (
        <p className="text-sm font-medium text-fg" role="alert">
          {error}
        </p>
      )}

      {answer && (
        <div className="flex flex-col gap-3 border border-border p-4">
          <div className="flex items-center gap-2">
            <MessageCircleQuestion className="size-4 text-accent" aria-hidden />
            <p className="text-sm font-medium text-fg">{t.ask.answerTitle}</p>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-line text-fg">{answer}</p>
        </div>
      )}

      <p className="text-sm leading-relaxed text-faint">{t.ask.disclaimer}</p>
    </div>
  );
}
