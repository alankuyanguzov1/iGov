"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui";
import { removeBenefit, saveBenefit } from "@/lib/user-benefits";
import { getDictionary } from "@/lib/i18n";

type SaveBenefitButtonProps = {
  slug: string;
  authed: boolean;
  initialSaved: boolean;
};

export function SaveBenefitButton({ slug, authed, initialSaved }: SaveBenefitButtonProps) {
  const router = useRouter();
  const t = getDictionary();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!authed) {
      router.push("/signup");
      return;
    }
    setBusy(true);
    if (saved) {
      const ok = await removeBenefit(slug);
      if (ok) setSaved(false);
    } else {
      const ok = await saveBenefit(slug);
      if (ok) setSaved(true);
    }
    setBusy(false);
  }

  return (
    <Button
      variant={saved ? "secondary" : "ghost"}
      size="sm"
      loading={busy}
      onClick={handleClick}
    >
      {saved ? (
        <BookmarkCheck className="size-4 text-accent" aria-hidden />
      ) : (
        <Bookmark className="size-4" aria-hidden />
      )}
      {saved ? t.results.savedLabel : t.results.saveCta}
    </Button>
  );
}
