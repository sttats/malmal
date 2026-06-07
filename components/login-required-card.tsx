import Link from "next/link";

type LoginRequiredCardProps = {
  redirectTo: string;
};

export function LoginRequiredCard({ redirectTo }: LoginRequiredCardProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-6 text-center shadow-card">
      <p className="text-lg font-bold text-ink">この機能はログイン後に使えます</p>
      <p className="mt-2 text-sm leading-6 text-slate">
        Supabase Authでログインすると、動画URLの投稿や自分の投稿一覧を管理できます。
      </p>
      <Link
        href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
        className="mt-5 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-ink"
      >
        ログイン画面へ
      </Link>
    </div>
  );
}
