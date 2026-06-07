import Link from "next/link";

import { getVideoEmbedUrl } from "@/lib/youtube";

type VideoPlayerProps = {
  provider: string;
  videoId: string;
  url: string;
  title: string;
};

export function VideoPlayer({ provider, videoId, url, title }: VideoPlayerProps) {
  const embedUrl = getVideoEmbedUrl(provider, videoId, {
    autoplay: true,
    mute: true,
    playsinline: true,
    rel: false
  });

  if (!embedUrl) {
    return (
      <div className="rounded-[2rem] bg-white p-6 shadow-card">
        <p className="text-sm text-slate">このプロバイダーの埋め込み表示にはまだ対応していません。</p>
        <Link
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
        >
          動画を開く
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-black shadow-card">
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
