import { notFound } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { NormalVideoCard } from "@/components/normal-video-card";
import { ShortVideoCard } from "@/components/short-video-card";
import { ShortsCarousel } from "@/components/shorts-carousel";
import { VideoPlayer } from "@/components/video-player";
import { VideoSection } from "@/components/video-section";
import { formatDate } from "@/lib/format";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getVideoById, listVideosByType } from "@/lib/videos";

export const dynamic = "force-dynamic";

type VideoDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VideoDetailPage({ params }: VideoDetailPageProps) {
  if (!isSupabaseConfigured()) {
    notFound();
  }

  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const video = await getVideoById(supabase, id);

  if (!video) {
    notFound();
  }

  if (video.videoType === "short") {
    const shortVideos = await listVideosByType(supabase, "short", 24);
    const videosForViewer = shortVideos.some((shortVideo) => shortVideo.id === video.id)
      ? shortVideos
      : [video, ...shortVideos];

    return (
      <div className="space-y-5">
        <AppHeader title="Shorts" subtitle="タップした動画から自動再生し、左右スワイプで次の動画へ移動できます。" />
        <ShortsCarousel initialVideoId={video.id} videos={videosForViewer} />
      </div>
    );
  }

  const [normalVideos, shortVideos] = await Promise.all([
    listVideosByType(supabase, "normal", 10),
    listVideosByType(supabase, "short", 8)
  ]);

  const relatedVideos = normalVideos.filter((candidate) => candidate.id !== video.id).slice(0, 4);
  const recommendedShorts = shortVideos.slice(0, 6);

  return (
    <div className="space-y-6">
      <AppHeader title="動画詳細" subtitle="保存された動画URLをその場で再生できます。" />

      <VideoPlayer provider={video.provider} videoId={video.videoId} url={video.url} title={video.title} />

      <section className="rounded-[2rem] bg-white p-5 shadow-card">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">NORMAL</span>
          <p className="text-sm text-slate">{formatDate(video.createdAt)}</p>
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-ink">{video.title}</h1>
        <div className="mt-4 rounded-3xl bg-soft p-4">
          <p className="text-sm font-semibold text-ink">{video.profile.displayName ?? "Member"}</p>
          <p className="mt-1 text-sm text-slate">投稿者ID: {video.profile.userId}</p>
        </div>
        <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate">
          {video.description?.trim() ? video.description : "説明文はまだありません。"}
        </div>
      </section>

      <VideoSection
        title="関連動画"
        description="同じ一覧から、続けて見やすい通常動画をピックアップしています。"
        emptyMessage="関連動画はまだ十分に集まっていません。"
        hasItems={relatedVideos.length > 0}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {relatedVideos.map((relatedVideo) => (
            <NormalVideoCard key={relatedVideo.id} video={relatedVideo} />
          ))}
        </div>
      </VideoSection>

      <VideoSection
        title="おすすめ Shorts"
        description="次に軽く見られる縦動画もここから続けてチェックできます。"
        emptyMessage="おすすめできる Shorts はまだありません。"
        hasItems={recommendedShorts.length > 0}
      >
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:px-0">
          {recommendedShorts.map((shortVideo) => (
            <ShortVideoCard key={shortVideo.id} video={shortVideo} />
          ))}
        </div>
      </VideoSection>
    </div>
  );
}
