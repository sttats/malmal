import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { LogoutButton } from "@/components/logout-button";
import { NormalVideoCard } from "@/components/normal-video-card";
import { formatDate } from "@/lib/format";
import { ensureProfile } from "@/lib/profile";
import { createSupabaseServerClient, getSupabaseUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { listVideosByUser } from "@/lib/videos";

export const dynamic = "force-dynamic";

export default async function MyPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login?redirectTo=/mypage");
  }

  const supabase = await createSupabaseServerClient();
  const user = await getSupabaseUser(supabase);

  if (!user) {
    redirect("/login?redirectTo=/mypage");
  }

  const profile = await ensureProfile(supabase, user);
  const videos = await listVideosByUser(supabase, user.id);

  return (
    <div className="space-y-5">
      <AppHeader
        title="マイページ"
        subtitle="ログイン中のプロフィールと自分の投稿一覧です。"
        action={<LogoutButton isConfigured={isSupabaseConfigured()} />}
      />

      <section className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-card backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Profile</p>
        <h2 className="mt-3 text-xl font-black text-white">{profile.display_name ?? "Member"}</h2>
        <p className="mt-1 text-sm text-white/68">{user.email}</p>
        <p className="mt-3 text-sm text-white/68">作成日: {formatDate(profile.created_at)}</p>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white">自分が投稿した動画</h2>
          <p className="mt-1 text-sm text-white/68">投稿済みの動画URLをここでまとめて確認できます。</p>
        </div>
        {videos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <NormalVideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-white/12 bg-white/6 px-5 py-10 text-center text-sm text-white/68 shadow-card backdrop-blur">
            まだ投稿はありません。下部ナビの「投稿」から最初の動画を追加できます。
          </div>
        )}
      </section>
    </div>
  );
}
