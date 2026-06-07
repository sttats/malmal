import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { AppHeader } from "@/components/app-header";
import { HomeFeed } from "@/components/home-feed";
import { createSupabaseServerClient, getSupabaseUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { listVideosByType } from "@/lib/videos";
import type { VideoWithProfile } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let user: User | null = null;
  let normalVideos: VideoWithProfile[] = [];
  let shortVideos: VideoWithProfile[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();

    [user, normalVideos, shortVideos] = await Promise.all([
      getSupabaseUser(supabase),
      listVideosByType(supabase, "normal", 12),
      listVideosByType(supabase, "short", 12)
    ]);
  }

  return (
    <div className="space-y-8">
      <AppHeader
        title="動画リンクを、気軽にシェア"
        subtitle="YouTubeのように眺めながら、好きな動画URLだけを投稿できるモバイルファーストなMVPです。"
        action={
          <Link
            href={user ? "/upload" : "/login?redirectTo=/upload"}
            className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-ink"
          >
            {user ? "投稿する" : "ログイン"}
          </Link>
        }
      />
      <HomeFeed normalVideos={normalVideos} shortVideos={shortVideos} />
    </div>
  );
}
