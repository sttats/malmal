"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "signin" | "signup";

type AuthFormProps = {
  authError?: string;
  redirectTo: string;
  isConfigured: boolean;
};

export function AuthForm({ authError, redirectTo, isConfigured }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(authError ?? "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const isGoogleAuthEnabled =
    process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true" ||
    process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "1";

  useEffect(() => {
    setError(authError ?? "");
  }, [authError]);

  function getAuthErrorMessage(authError: unknown, fallbackMessage: string) {
    if (!(authError instanceof Error)) {
      return fallbackMessage;
    }

    if (authError.message.includes("Unsupported provider")) {
      return "Googleログインは現在未設定です。メールアドレスでログインするか、SupabaseでGoogle providerを有効化してください。";
    }

    return authError.message;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) {
      setError("Supabase Authの環境変数が未設定です。READMEの設定手順を確認してください。");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName
            },
            emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(
              redirectTo
            )}`
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        if (!data.session) {
          setMessage("確認メールを送信しました。メール認証後にログインしてください。");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          throw signInError;
        }
      }

      router.push(redirectTo);
      router.refresh();
    } catch (authError) {
      setError(getAuthErrorMessage(authError, "認証に失敗しました。"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    if (!isConfigured) {
      setError("Supabase Authの環境変数が未設定です。READMEの設定手順を確認してください。");
      return;
    }

    setError("");
    setMessage("");
    setIsGoogleSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(
            redirectTo
          )}`
        }
      });

      if (googleError) {
        throw googleError;
      }
    } catch (authError) {
      setError(getAuthErrorMessage(authError, "Googleログインに失敗しました。"));
      setIsGoogleSubmitting(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 text-white shadow-card backdrop-blur">
      <div className="mb-5 inline-flex rounded-full bg-white/8 p-1 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`rounded-full px-4 py-2 transition ${
            mode === "signin" ? "bg-white text-ink" : "text-white/62"
          }`}
        >
          ログイン
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-full px-4 py-2 transition ${
            mode === "signup" ? "bg-white text-ink" : "text-white/62"
          }`}
        >
          新規登録
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" ? (
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-white">表示名</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="malmal user"
              className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent"
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-white">メールアドレス</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-white">パスワード</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            type="password"
            placeholder="6文字以上"
            className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent"
          />
        </label>

        {error ? (
          <p className="rounded-2xl bg-red-500/12 px-4 py-3 text-sm text-red-200">{error}</p>
        ) : null}
        {message ? (
          <p className="rounded-2xl bg-emerald-500/12 px-4 py-3 text-sm text-emerald-200">{message}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || !isConfigured}
          className="w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "処理中..."
            : mode === "signin"
              ? "ログインする"
              : "アカウントを作成する"}
        </button>
      </form>

      {isGoogleAuthEnabled ? (
        <>
          <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
            <span className="h-px flex-1 bg-white/12" />
            <span>or</span>
            <span className="h-px flex-1 bg-white/12" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleSubmitting || !isConfigured}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/8 px-5 py-3 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-base">G</span>
            <span>{isGoogleSubmitting ? "Googleへ移動中..." : "Googleでログイン"}</span>
          </button>
        </>
      ) : null}
    </div>
  );
}
