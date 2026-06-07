import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { VideoWithProfile } from "@/types/video";

type NormalVideoCardProps = {
  video: VideoWithProfile;
};

export function NormalVideoCard({ video }: NormalVideoCardProps) {
  return (
    <Link
      href={`/videos/${video.id}`}
      className="group block overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/6 shadow-card backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
    >
      <div className="relative aspect-video overflow-hidden bg-white/8">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-soft to-black/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-1 text-[11px] font-black tracking-[0.16em] text-ink">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          YOUTUBE
        </div>
        <div className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-black/75 text-white backdrop-blur transition group-hover:scale-105">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-0.5 h-5 w-5 fill-current">
            <path d="M8 6.5v11l9-5.5-9-5.5Z" />
          </svg>
        </div>
        <span className="absolute bottom-3 left-3 rounded-full bg-black/85 px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-white">
          VIDEO
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#101010] text-sm font-black text-white shadow-sm">
            {(video.profile.displayName ?? "M").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-[15px] font-extrabold leading-6 text-white">{video.title}</h2>
            {video.description ? (
              <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/68">{video.description}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-white/58">
              <span className="truncate text-sm font-semibold text-white">
                {video.profile.displayName ?? "Member"}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/35" />
              <span>{formatDate(video.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
