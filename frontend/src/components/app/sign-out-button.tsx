"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { getDictionary } from "@/lib/i18n";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = getDictionary();

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="secondary" size="sm" loading={loading} onClick={handleSignOut}>
      {t.auth.signOut}
    </Button>
  );
}
