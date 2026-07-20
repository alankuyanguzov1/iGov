"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Button, Checkbox, Progress } from "@/components/ui";
import { getDictionary } from "@/lib/i18n";
import {
  getBenefitState,
  getCurrentUserId,
  setCheckedDocuments,
  updateBenefitStatus,
} from "@/lib/user-benefits";

const STATUS_ORDER = ["saved", "collecting", "submitted", "received", "rejected"] as const;
type StatusKey = (typeof STATUS_ORDER)[number];

type BenefitTrackerProps = {
  slug: string;
  documents: string[];
};

export function BenefitTracker({ slug, documents }: BenefitTrackerProps) {
  const router = useRouter();
  const t = getDictionary();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusKey>("saved");

  useEffect(() => {
    void (async () => {
      const userId = await getCurrentUserId();
      setAuthed(userId !== null);
      if (userId) {
        const state = await getBenefitState(slug);
        if (state) {
          setChecked(state.checkedDocuments);
          if ((STATUS_ORDER as readonly string[]).includes(state.status)) {
            setStatus(state.status as StatusKey);
          }
        }
      }
    })();
  }, [slug]);

  async function toggleDocument(doc: string) {
    if (!authed) {
      router.push("/login");
      return;
    }
    const next = checked.includes(doc)
      ? checked.filter((d) => d !== doc)
      : [...checked, doc];
    setChecked(next);
    await setCheckedDocuments(slug, next);
  }

  async function changeStatus(next: StatusKey) {
    if (!authed) {
      router.push("/login");
      return;
    }
    setStatus(next);
    await updateBenefitStatus(slug, next);
  }

  const progress = documents.length > 0 ? (checked.length / documents.length) * 100 : 0;

  if (authed === null) {
    return (
      <ul className="flex flex-col gap-3">
        {documents.map((doc) => (
          <li key={doc} className="flex items-start gap-3 text-sm leading-relaxed text-fg">
            <FileText className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
            {doc}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {documents.map((doc) => (
          <Checkbox
            key={doc}
            label={doc}
            checked={checked.includes(doc)}
            onChange={() => void toggleDocument(doc)}
          />
        ))}
      </div>

      {authed ? (
        <>
          {documents.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted">
                {checked.length} / {documents.length} {t.tracker.docsProgress}
              </p>
              <Progress value={progress} label={`${checked.length} / ${documents.length}`} />
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-border pt-5">
            <p className="text-sm font-medium text-fg">{t.tracker.statusTitle}</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((key) => (
                <Button
                  key={key}
                  size="sm"
                  variant={status === key ? "primary" : "secondary"}
                  onClick={() => void changeStatus(key)}
                >
                  {t.tracker.statuses[key]}
                </Button>
              ))}
            </div>
            {status === "rejected" && (
              <p className="text-sm leading-relaxed text-muted">{t.tracker.rejectedHint}</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-start gap-3 border-t border-border pt-5">
          <p className="text-sm leading-relaxed text-muted">{t.tracker.authPrompt}</p>
          <Button size="sm" variant="secondary" onClick={() => router.push("/login")}>
            {t.tracker.authCta}
          </Button>
        </div>
      )}
    </div>
  );
}
