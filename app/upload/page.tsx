import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { UploadForm } from "@/components/upload-form";
import { createSupabaseServerClient, getSupabaseUser, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function UploadPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-5">
        <AppHeader
          title="動画を投稿"
          subtitle="Supabase Auth未設定のため、READMEの環境変数設定後に利用できます。"
        />
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900 shadow-card">
          `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定すると投稿機能を使えます。
        </div>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const user = await getSupabaseUser(supabase);

  if (!user) {
    redirect("/login?redirectTo=/upload");
  }

  return (
    <div className="space-y-5">
      <AppHeader
        title="動画を投稿"
        subtitle="URLからYouTubeのvideo_idとサムネイルを自動抽出して保存します。"
      />
      <UploadForm />
    </div>
  );
}
