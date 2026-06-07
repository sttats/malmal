"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { detectYouTubeVideoType } from "@/lib/youtube";

type VideoTypeValue = "normal" | "short";

export function UploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [videoType, setVideoType] = useState<VideoTypeValue>("normal");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  useEffect(() => {
    setVideoType(detectYouTubeVideoType(url));
  }, [url]);

  async function handleGenerateTitle() {
    if (!url.trim()) {
      setError("先に動画URLを入力してください。");
      return;
    }

    setError("");
    setIsGeneratingTitle(true);

    try {
      const response = await fetch("/api/title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url
        })
      });

      const result = (await response.json()) as { error?: string; title?: string };

      if (!response.ok || !result.title) {
        throw new Error(result.error ?? "タイトル取得に失敗しました。");
      }

      setTitle(result.title);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "タイトル取得に失敗しました。");
    } finally {
      setIsGeneratingTitle(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          url,
          description
        })
      });

      const result = (await response.json()) as { error?: string; id?: string };

      if (!response.ok || !result.id) {
        throw new Error(result.error ?? "投稿に失敗しました。");
      }

      router.push(`/videos/${result.id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "投稿に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-[2rem] border border-white/10 bg-white/6 p-5 text-white shadow-card backdrop-blur"
    >
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-white">動画URL</span>
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none ring-0 transition placeholder:text-white/35 focus:border-accent"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-white">タイトル</span>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-white/58">YouTube の公開タイトルをそのまま取得できます。</p>
          <button
            type="button"
            onClick={handleGenerateTitle}
            disabled={isGeneratingTitle || !url.trim()}
            className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGeneratingTitle ? "取得中..." : "URLから取得"}
          </button>
        </div>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          maxLength={120}
          placeholder="動画の見どころをひとことで"
          className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-white">説明文</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={5}
          placeholder="なぜ共有したい動画か、メモを書けます"
          className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-white">動画タイプ</span>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">{videoType === "short" ? "short" : "normal"}</p>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${
                videoType === "short" ? "bg-accent text-white" : "bg-ink text-white"
              }`}
            >
              auto
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-white/58">
            YouTube URL に `shorts` が含まれる場合は自動で `short` として保存されます。
          </p>
        </div>
      </label>

      {error ? <p className="rounded-2xl bg-red-500/12 px-4 py-3 text-sm text-red-200">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}
