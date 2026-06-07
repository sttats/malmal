import { AppHeader } from "@/components/app-header";
import { AuthForm } from "@/components/auth-form";
import { getSafeRedirectPath } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    authError?: string;
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { authError, redirectTo } = await searchParams;
  const safeRedirectTo = getSafeRedirectPath(redirectTo, "/mypage");
  const configured = isSupabaseConfigured();

  return (
    <div className="space-y-5">
      <AppHeader title="ログイン" subtitle="Supabase Authでログインして投稿やマイページを利用します。" />

      {!configured ? (
        <section className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900 shadow-card">
          `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が未設定です。READMEの手順どおりに
          Supabaseプロジェクトを作成し、環境変数を設定してください。
        </section>
      ) : null}

      <AuthForm authError={authError} redirectTo={safeRedirectTo} isConfigured={configured} />
    </div>
  );
}
