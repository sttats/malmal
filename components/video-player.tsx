"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getVideoEmbedUrl } from "@/lib/youtube";

type VideoPlayerProps = {
  provider: string;
  videoId: string;
  url: string;
  title: string;
};

export function VideoPlayer({ provider, videoId, url, title }: VideoPlayerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;
  const embedUrl = useMemo(
    () =>
      getVideoEmbedUrl(provider, videoId, {
        autoplay: true,
        mute: true,
        playsinline: true,
        rel: false,
        origin
      }),
    [origin, provider, videoId]
  );

  const syncMuteState = useCallback(() => {
    const iframe = iframeRef.current;

    if (!iframe?.contentWindow || provider !== "youtube") {
      return;
    }

    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: isMuted ? "mute" : "unMute",
        args: []
      }),
      "*"
    );
  }, [isMuted, provider]);

  useEffect(() => {
    syncMuteState();
  }, [syncMuteState]);

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
      <div className="relative aspect-video">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title}
          className="h-full w-full"
          onLoad={syncMuteState}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          type="button"
          onClick={() => setIsMuted((currentValue) => !currentValue)}
          aria-label={isMuted ? "音声をオンにする" : "音声をオフにする"}
          className="absolute right-3 top-3 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/72 text-white shadow-lg backdrop-blur transition hover:bg-black/88"
        >
          {isMuted ? <MutedIcon /> : <VolumeIcon />}
        </button>
      </div>
    </div>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M14.5 5.5a1 1 0 0 1 1.7.7v11.6a1 1 0 0 1-1.7.7l-4.1-4.1H7.2a1 1 0 0 1-1-1V10.1a1 1 0 0 1 1-1h3.2l4.1-4.1Z" />
      <path d="M18.1 9.2a1 1 0 0 1 1.4 0 4.28 4.28 0 0 1 0 6.1 1 1 0 0 1-1.4-1.4 2.28 2.28 0 0 0 0-3.3 1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M14.5 5.5a1 1 0 0 1 1.7.7v11.6a1 1 0 0 1-1.7.7l-4.1-4.1H7.2a1 1 0 0 1-1-1V10.1a1 1 0 0 1 1-1h3.2l4.1-4.1Z" />
      <path d="m18.5 9.4 1.4 1.4-2 2 2 2-1.4 1.4-2-2-2 2-1.4-1.4 2-2-2-2 1.4-1.4 2 2 2-2Z" />
    </svg>
  );
}
