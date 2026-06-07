import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { VideoWithProfile } from "@/types/video";

type ShortVideoCardProps = {
  video: VideoWithProfile;
};

export function ShortVideoCard({ video }: ShortVideoCardProps) {
  return (
    <Link
      href={`/videos/${video.id}`}
      className="group relative flex min-w-[196px] max-w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-[1.9rem] bg-white shadow-card transition hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,15,16,0.18)]"
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-soft">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-soft to-black/15" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-[11px] font-black tracking-[0.14em] text-white shadow-lg">
          <span className="inline-block h-2 w-2 rounded-full bg-white" />
          SHORTS
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
          {video.provider}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h2 className="line-clamp-2 text-base font-black leading-6 drop-shadow-sm">{video.title}</h2>
          {video.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/82">{video.description}</p>
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
    </Link>
  );
}
