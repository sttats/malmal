import { NextResponse } from "next/server";

import { parseYouTubeUrl } from "@/lib/youtube";
import { generateVideoTitle } from "@/lib/title-generator";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    url?: string;
  };

  if (!body.url?.trim()) {
    return NextResponse.json(
      {
        error: "URLを入力してください。"
      },
      {
        status: 400
      }
    );
  }

  try {
    parseYouTubeUrl(body.url);
    const title = await generateVideoTitle(body.url);

    return NextResponse.json({
      title
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "タイトル取得に失敗しました。"
      },
      {
        status: 400
      }
    );
  }
}
