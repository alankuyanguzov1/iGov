"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { getDictionary } from "@/lib/i18n";

export function DeleteAccountButton() {
  const router = useRouter();
  const t = getDictionary();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(t.account.deleteConfirm);
    if (!confirmed) return;

    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_my_account");
    if (!error) {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
      return;
    }
    setBusy(false);
  }

  return (
    <Button variant="secondary" size="sm" loading={busy} onClick={handleDelete}>
      <Trash2 className="size-4" aria-hidden />
      {t.account.deleteCta}
    </Button>
  );
}
