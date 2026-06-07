import type { ReactNode } from "react";

type VideoSectionProps = {
  title: string;
  description: string;
  emptyMessage: string;
  children: ReactNode;
  hasItems: boolean;
};

export function VideoSection({
  title,
  description,
  emptyMessage,
  children,
  hasItems
}: VideoSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-accent">Collection</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-white">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-white/68">{description}</p>
        </div>
      </div>
      {hasItems ? (
        children
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-white/12 bg-white/6 px-5 py-10 text-center text-sm text-white/68 shadow-card backdrop-blur">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
