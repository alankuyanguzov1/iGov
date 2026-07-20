import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { SignOutButton } from "@/components/app/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const t = getDictionary();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-bg">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-heading text-base font-bold tracking-tight text-fg">
            {t.common.brand}
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="max-w-48 truncate text-sm text-muted transition-colors hover:text-fg"
                >
                  {user.email}
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  {t.auth.toLogin}
                </Link>
                <ButtonLink href="/signup" size="sm">
                  {t.auth.toSignup}
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
