import type { VideoType } from "@/types/database";

export type ParsedYouTubeUrl = {
  provider: "youtube";
  videoId: string;
  videoType: VideoType;
};

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com"
]);

function normalizeHost(hostname: string) {
  return hostname.toLowerCase();
}

function extractYouTubeVideoId(url: URL) {
  const host = normalizeHost(url.hostname);

  if (host === "youtu.be" || host === "www.youtu.be") {
    return url.pathname.replace(/^\/+/, "").split("/")[0] ?? null;
  }

  if (url.pathname === "/watch") {
    return url.searchParams.get("v");
  }

  if (url.pathname.startsWith("/shorts/")) {
    return url.pathname.split("/")[2] ?? null;
  }

  if (url.pathname.startsWith("/embed/")) {
    return url.pathname.split("/")[2] ?? null;
  }

  return null;
}

export function detectYouTubeVideoType(input: string): VideoType {
  try {
    const url = new URL(input);

    return url.pathname.startsWith("/shorts/") ? "short" : "normal";
  } catch {
    return "normal";
  }
}

export function parseYouTubeUrl(input: string): ParsedYouTubeUrl {
  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new Error("URLの形式が正しくありません。");
  }

  const host = normalizeHost(url.hostname);

  if (!YOUTUBE_HOSTS.has(host)) {
    throw new Error("現在のMVPではYouTube URLのみ対応しています。");
  }

  const videoId = extractYouTubeVideoId(url);

  if (!videoId) {
    throw new Error("YouTubeのvideo_idを抽出できませんでした。");
  }

  return {
    provider: "youtube",
    videoId,
    videoType: detectYouTubeVideoType(input)
  };
}

export function getYouTubeThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

type EmbedOptions = {
  autoplay?: boolean;
  controls?: boolean;
  mute?: boolean;
  playsinline?: boolean;
  rel?: boolean;
  enableJsApi?: boolean;
};

export function getYouTubeEmbedUrl(videoId: string, options?: EmbedOptions) {
  const params = new URLSearchParams();

  if (options?.autoplay) {
    params.set("autoplay", "1");
  }

  if (options?.controls === false) {
    params.set("controls", "0");
  }

  if (options?.mute) {
    params.set("mute", "1");
  }

  if (options?.playsinline !== false) {
    params.set("playsinline", "1");
  }

  if (options?.rel === false) {
    params.set("rel", "0");
  }

  if (options?.enableJsApi !== false) {
    params.set("enablejsapi", "1");
  }

  const query = params.toString();
  return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ""}`;
}

export function getVideoEmbedUrl(provider: string, videoId: string, options?: EmbedOptions) {
  if (provider === "youtube") {
    return getYouTubeEmbedUrl(videoId, options);
  }

  return "";
}
