type OEmbedResponse = {
  title?: string;
};

export async function generateVideoTitle(url: string) {
  const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error("YouTubeタイトルの取得に失敗しました。URLを確認してください。");
  }

  const data = (await response.json()) as OEmbedResponse;
  const title = data.title?.trim();

  if (!title) {
    throw new Error("YouTubeタイトルを取得できませんでした。");
  }

  return title;
}
