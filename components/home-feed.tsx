"use client";

import { useEffect, useState } from "react";

import { NormalVideoCard } from "@/components/normal-video-card";
import { ShortVideoCard } from "@/components/short-video-card";
import { VideoSection } from "@/components/video-section";
import type { VideoWithProfile } from "@/types/database";

type HomeFeedProps = {
  normalVideos: VideoWithProfile[];
  shortVideos: VideoWithProfile[];
};

function scrollToSection(sectionId: string) {
  if (typeof document === "undefined") {
    return;
  }

  const element = document.getElementById(sectionId);
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomeFeed({ normalVideos, shortVideos }: HomeFeedProps) {
  const [activeTab, setActiveTab] = useState<"normal" | "short">("normal");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const normalSection = document.getElementById("normal-section");
    const shortSection = document.getElementById("short-section");

    if (!normalSection || !shortSection) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        setActiveTab(visibleEntry.target.id === "short-section" ? "short" : "normal");
      },
      {
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-25% 0px -45% 0px"
      }
    );

    observer.observe(normalSection);
    observer.observe(shortSection);

    return () => observer.disconnect();
  }, []);

  function handleTabClick(type: "normal" | "short") {
    setActiveTab(type);
    scrollToSection(type === "normal" ? "normal-section" : "short-section");
  }

  function getTabClassName(type: "normal" | "short") {
    if (activeTab === type) {
      return "bg-accent text-white border border-accent";
    }

    return "border border-white bg-black text-white hover:bg-white/8";
  }

  return (
    <>
      <section className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-black shadow-card">
        <div className="rounded-[2.05rem] bg-white/[0.02] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Feed</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">新着リンク</h2>
          <p className="mt-2 text-sm leading-6 text-white">
            タブを押すと、その一覧までスクロールできます。通常動画とショート動画はどちらも表示されたままです。
          </p>
        </div>
      </section>

      <section className="sticky top-[8.5rem] z-20 -mt-1 pb-2 md:top-[7.75rem]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-card">
          <div className="flex gap-2 overflow-x-auto rounded-[1.8rem] bg-white/[0.02] px-3 py-3 no-scrollbar">
          <button
            type="button"
            onClick={() => handleTabClick("normal")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${getTabClassName("normal")}`}
          >
            通常
          </button>
          <button
            type="button"
            onClick={() => handleTabClick("short")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${getTabClassName("short")}`}
          >
            ショート
          </button>
          </div>
        </div>
      </section>

      <div id="normal-section" className="scroll-mt-56 md:scroll-mt-52">
        <VideoSection
          title="通常動画"
          description="サムネイルを大きく見せる YouTube 風のフィード。気になる1本を一覧で拾いやすくしています。"
          emptyMessage="まだ通常動画は投稿されていません。最初の1本を共有してみましょう。"
          hasItems={normalVideos.length > 0}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {normalVideos.map((video) => (
              <NormalVideoCard key={video.id} video={video} />
            ))}
          </div>
        </VideoSection>
      </div>

      <div id="short-section" className="scroll-mt-56 md:scroll-mt-52">
        <VideoSection
          title="ショート動画"
          description="ホームでは横並びのサムネイルで一覧表示。タップするとShortsビューアで再生できます。"
          emptyMessage="まだショート動画はありません。縦動画URLを投稿するとここに並びます。"
          hasItems={shortVideos.length > 0}
        >
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:px-0">
            {shortVideos.map((video) => (
              <ShortVideoCard key={video.id} video={video} />
            ))}
          </div>
        </VideoSection>
      </div>
    </>
  );
}
