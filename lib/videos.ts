import type { PostgrestError } from "@supabase/supabase-js";

import type { AppSupabaseClient } from "@/lib/supabase/server";
import type { ProfileRow, VideoInsert, VideoRow, VideoType, VideoWithProfile } from "@/types/database";

const VIDEO_COLUMNS = [
  "id",
  "user_id",
  "url",
  "provider",
  "video_id",
  "title",
  "description",
  "thumbnail_url",
  "video_type",
  "created_at",
  "updated_at"
].join(", ");

function throwIfError(error: PostgrestError | null) {
  if (error) {
    throw new Error(error.message);
  }
}

function mapVideo(video: VideoRow, profiles: Map<string, ProfileRow>): VideoWithProfile {
  const profile = profiles.get(video.user_id);

  return {
    id: video.id,
    userId: video.user_id,
    url: video.url,
    provider: video.provider,
    videoId: video.video_id,
    title: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail_url,
    videoType: video.video_type,
    createdAt: video.created_at,
    updatedAt: video.updated_at,
    profile: {
      userId: profile?.user_id ?? video.user_id,
      displayName: profile?.display_name ?? null,
      avatarUrl: profile?.avatar_url ?? null
    }
  };
}

async function loadProfiles(supabase: AppSupabaseClient, userIds: string[]) {
  if (userIds.length === 0) {
    return new Map<string, ProfileRow>();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, user_id, display_name, avatar_url, created_at, updated_at")
    .in("user_id", userIds);

  throwIfError(error);

  const profiles = (data ?? []) as ProfileRow[];
  return new Map(profiles.map((profile) => [profile.user_id, profile]));
}

async function withProfiles(supabase: AppSupabaseClient, videos: VideoRow[]) {
  const userIds = [...new Set(videos.map((video) => video.user_id))];
  const profiles = await loadProfiles(supabase, userIds);
  return videos.map((video) => mapVideo(video, profiles));
}

export async function listVideosByType(supabase: AppSupabaseClient, videoType: VideoType, limit = 12) {
  const { data, error } = await supabase
    .from("videos")
    .select(VIDEO_COLUMNS)
    .eq("video_type", videoType)
    .order("created_at", { ascending: false })
    .limit(limit);

  throwIfError(error);

  const videos = (data ?? []) as VideoRow[];
  return withProfiles(supabase, videos);
}

export async function listVideosByUser(supabase: AppSupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("videos")
    .select(VIDEO_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  throwIfError(error);

  const videos = (data ?? []) as VideoRow[];
  return withProfiles(supabase, videos);
}

export async function getVideoById(supabase: AppSupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("videos")
    .select(VIDEO_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  throwIfError(error);

  const videoRow = data as VideoRow | null;

  if (!videoRow) {
    return null;
  }

  const [video] = await withProfiles(supabase, [videoRow]);
  return video;
}

export async function createVideo(
  supabase: AppSupabaseClient,
  input: VideoInsert
): Promise<VideoRow> {
  const { data, error } = await supabase
    .from("videos")
    .insert(input as never)
    .select(VIDEO_COLUMNS)
    .single();

  throwIfError(error);

  const insertedVideo = data as VideoRow | null;

  if (!insertedVideo) {
    throw new Error("投稿データの保存結果を取得できませんでした。");
  }

  return insertedVideo;
}
