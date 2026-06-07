"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { formatDate } from "@/lib/format";
import { getVideoEmbedUrl } from "@/lib/youtube";
import type { VideoWithProfile } from "@/types/video";

type ShortsCarouselProps = {
  initialVideoId: string;
  videos: VideoWithProfile[];
};

function reorderVideos(videos: VideoWithProfile[], initialVideoId: string) {
  const currentIndex = videos.findIndex((video) => video.id === initialVideoId);

  if (currentIndex <= 0) {
    return videos;
  }

  return [...videos.slice(currentIndex), ...videos.slice(0, currentIndex)];
}

export function ShortsCarousel({ initialVideoId, videos }: ShortsCarouselProps) {
  const orderedVideos = useMemo(() => reorderVideos(videos, initialVideoId), [initialVideoId, videos]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.scrollLeft = 0;
  }, [orderedVideos]);

  useEffect(() => {
    const activeVideo = orderedVideos[activeIndex];

    if (!activeVideo || typeof window === "undefined") {
      return;
    }

    window.history.replaceState(window.history.state, "", `/videos/${activeVideo.id}`);
  }, [activeIndex, orderedVideos]);

  const syncMuteState = useCallback(() => {
    const iframe = activeIframeRef.current;
    const activeVideo = orderedVideos[activeIndex];

    if (!iframe?.contentWindow || activeVideo?.provider !== "youtube") {
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
  }, [activeIndex, isMuted, orderedVideos]);

  useEffect(() => {
    syncMuteState();
  }, [syncMuteState]);

  function handleScroll() {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const nextIndex = Math.round(container.scrollLeft / Math.max(container.clientWidth, 1));

    if (nextIndex !== activeIndex && nextIndex >= 0 && nextIndex < orderedVideos.length) {
      setActiveIndex(nextIndex);
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-[2rem] bg-[linear-gradient(180deg,#121212,#202020)] p-3 shadow-card">
        <div className="mb-3 flex items-center justify-between px-1 text-white">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/60">Shorts Viewer</p>
            <h2 className="mt-1 text-lg font-black">横にスワイプして次の動画へ</h2>
          </div>
          <p className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/85 backdrop-blur">
            {activeIndex + 1} / {orderedVideos.length}
          </p>
        </div>

        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar"
        >
          {orderedVideos.map((video, index) => {
            const isActive = index === activeIndex;
            const embedUrl = getVideoEmbedUrl(video.provider, video.videoId, {
              autoplay: isActive,
              controls: false,
              mute: isMuted,
              playsinline: true,
              rel: false,
              origin
            });

            return (
              <article key={video.id} className="w-full shrink-0 snap-center px-1">
                <div className="overflow-hidden rounded-[1.75rem] bg-black">
                  <div className="relative aspect-[9/16]">
                    {isActive ? (
                      <>
                        <iframe
                          ref={activeIframeRef}
                          src={embedUrl}
                          title={video.title}
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
                      </>
                    ) : (
                      <>
                        {video.thumbnailUrl ? (
                          <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                        <div className="absolute inset-0 grid place-items-center">
                          <div className="grid h-16 w-16 place-items-center rounded-full bg-white/15 text-white backdrop-blur">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-7 w-7 fill-current">
                              <path d="M8 6.5v11l9-5.5-9-5.5Z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[11px] font-black tracking-[0.14em] text-white shadow-lg">
                      SHORTS
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/55 to-transparent p-4 text-white">
                      <h3 className="line-clamp-2 text-base font-black leading-6">{video.title}</h3>
                      {video.description ? (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/80">{video.description}</p>
                      ) : null}
                      <div className="mt-3 flex items-center gap-2 text-xs text-white/85">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/18 font-black text-white backdrop-blur">
                          {(video.profile.displayName ?? "M").slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {video.profile.displayName ?? "Member"}
                          </p>
                          <p>{formatDate(video.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-[1.5rem] bg-white px-4 py-3 text-sm shadow-card">
        <p className="text-slate">左右へスワイプすると、次のショート動画へ切り替わります。</p>
        <Link
          href={orderedVideos[activeIndex]?.url ?? "/"}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white"
        >
          YouTubeで開く
        </Link>
      </div>
    </section>
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
