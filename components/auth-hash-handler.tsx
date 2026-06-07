"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function normalizeHashError(message: string) {
  if (message.includes("Unable to exchange external code")) {
    return "Google認証のコード交換に失敗しました。SupabaseのGoogle provider設定、Client ID / Secret、Redirect URLを確認してください。";
  }

  return message;
}

export function AuthHashHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash.startsWith("#")) {
      return;
    }

    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const authError = hashParams.get("error");
    const authErrorDescription = hashParams.get("error_description");

    if (!authError) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("redirectTo", window.location.pathname || "/mypage");
    params.set("authError", normalizeHashError(decodeURIComponent(authErrorDescription ?? authError)));
    window.location.hash = "";
    router.replace(`/login?${params.toString()}`);
  }, [router]);

  return null;
}
