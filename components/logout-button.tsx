"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type LogoutButtonProps = {
  isConfigured: boolean;
};

export function LogoutButton({ isConfigured }: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    if (!isConfigured) {
      return;
    }

    setIsPending(true);

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending || !isConfigured}
      className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/28 hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
