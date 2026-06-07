import { NextResponse } from "next/server";

import { ensureProfile } from "@/lib/profile";
import { createSupabaseServerClient, getSupabaseUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { createVideo, listVideosByType } from "@/lib/videos";
import { getYouTubeThumbnailUrl, parseYouTubeUrl } from "@/lib/youtube";
import type { VideoType } from "@/types/database";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json([]);
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("videoType") as VideoType | null;
  const supabase = await createSupabaseServerClient();

  if (type === "normal" || type === "short") {
    const videos = await listVideosByType(supabase, type);
    return NextResponse.json(videos);
  }

  const [normalVideos, shortVideos] = await Promise.all([
    listVideosByType(supabase, "normal"),
    listVideosByType(supabase, "short")
  ]);

  return NextResponse.json([...normalVideos, ...shortVideos]);
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Supabase Authが未設定です。READMEの環境変数設定を確認してください。"
      },
      {
        status: 503
      }
    );
  }

  const supabase = await createSupabaseServerClient();
  const user = await getSupabaseUser(supabase);

  if (!user) {
    return NextResponse.json(
      {
        error: "ログイン後に投稿してください。"
      },
      {
        status: 401
      }
    );
  }

  const body = (await request.json()) as {
    url?: string;
    title?: string;
    description?: string;
    videoType?: VideoType;
  };

  if (!body.url || !body.title) {
    return NextResponse.json(
      {
        error: "URLとタイトルは必須です。"
      },
      {
        status: 400
      }
    );
  }

  try {
    const { provider, videoId, videoType } = parseYouTubeUrl(body.url);

    await ensureProfile(supabase, user);

    const video = await createVideo(supabase, {
      user_id: user.id,
      url: body.url,
      provider,
      video_id: videoId,
      title: body.title.trim(),
      description: body.description?.trim() || null,
      thumbnail_url: getYouTubeThumbnailUrl(videoId),
      video_type: videoType
    });

    return NextResponse.json({
      id: video.id
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "投稿に失敗しました。"
      },
      {
        status: 400
      }
    );
  }
}
