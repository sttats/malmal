import Link from "next/link";

import { AppHeader } from "@/components/app-header";

export default function NotFound() {
  return (
    <div className="space-y-5">
      <AppHeader title="見つかりません" subtitle="指定された動画は存在しないか、削除された可能性があります。" />
      <div className="rounded-[2rem] bg-white p-6 shadow-card">
        <p className="text-sm text-slate">ホームに戻って別の動画を探してみてください。</p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  );
}
