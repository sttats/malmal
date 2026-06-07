# malmal

Next.js + TypeScript + Tailwind CSS + Supabase Auth + Supabase Postgres + Docker で作った、動画リンク共有WebアプリのMVPです。動画ファイル本体は保存せず、YouTube の URL とメタ情報だけを保存します。

## 技術スタック

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security
- Docker / Docker Compose
- ESLint / Prettier

## 画面一覧

- `/` ホーム
- `/videos/[id]` 動画詳細
- `/upload` 投稿
- `/mypage` マイページ
- `/login` ログイン

## 主な機能

- 未ログインでもホームと詳細は閲覧可能
- Supabase Auth によるメールログイン / 新規登録 / ログアウト
- Google ログイン導線
- `.env.local` を Docker 起動時にも読み込む構成
- YouTube URL から `video_id` を抽出して保存
- 通常動画とショート動画の分離表示
- モバイルファーストの YouTube 風カード UI
- Supabase Postgres + RLS によるアクセス制御

## ディレクトリ構成

```text
.
├── app
│   ├── api/auth/callback
│   ├── api/videos
│   ├── login
│   ├── mypage
│   ├── upload
│   └── videos/[id]
├── components
├── lib
│   ├── auth.ts
│   ├── profile.ts
│   ├── videos.ts
│   ├── youtube.ts
│   └── supabase
│       ├── client.ts
│       └── server.ts
├── supabase
│   └── init.sql
├── types
│   ├── database.ts
│   └── video.ts
├── Dockerfile
└── docker-compose.yml
```

## Supabase プロジェクト作成手順

1. [Supabase](https://supabase.com/) で新しいプロジェクトを作成します。
2. `Authentication > Providers` で Email を有効にします。
3. Google ログインを使う場合は Google provider も有効にし、OAuth Client を設定します。
4. `Project Settings > API` から以下を取得します。
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## 環境変数設定

`.env.example` を元に `.env.local` を作成してください。

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false
```

または、Supabase の publishable key を使う場合は以下でも動作します。

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-key
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false
```

Google ログインを有効にする場合だけ `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true` に変更してください。

## SQL 実行手順

`supabase/init.sql` の内容を Supabase の `SQL Editor` に貼り付けて実行してください。

実行される内容:

- `profiles` テーブル作成
- `videos` テーブル作成
- `video_type` 制約追加
- `updated_at` 自動更新トリガー作成
- RLS 有効化
- `profiles` / `videos` 用ポリシー作成

## RLS ポリシー概要

### profiles

- 全ユーザーが `select` 可能
- 認証済みユーザーは自分のプロフィールのみ `insert` / `update` 可能

### videos

- 全ユーザーが `select` 可能
- 認証済みユーザーは自分の動画のみ `insert` 可能
- 認証済みユーザーは自分の動画のみ `update` / `delete` 可能

## Docker で起動する

```bash
docker compose up --build
```

起動後:

- App: [http://localhost:3000](http://localhost:3000)

Supabase 本体は Docker に含めていません。クラウド版 Supabase を利用します。
`docker-compose.yml` は `.env.local` をそのまま読み込むので、ローカル起動と Docker 起動で同じ環境変数を使えます。

## ローカルで直接起動する

```bash
npm install
npm run dev
```

## Vercel で公開する

1. GitHub などにこのリポジトリを push します。
2. Vercel で `New Project` からこのリポジトリを import します。
3. Framework Preset は `Next.js` のままで問題ありません。
4. Vercel の `Environment Variables` に以下を登録します。

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
```

または publishable key を使う場合:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-key
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true
```

5. `Deploy` を実行します。

このアプリは Next.js の標準構成なので、Vercel で追加の `vercel.json` は不要です。

## Supabase を本番 URL に合わせる

Vercel で最初のデプロイができたら、Supabase 側の URL 設定も更新してください。

### Authentication > URL Configuration

- `Site URL`
  - 本番 URL を設定
  - 例: `https://your-app.vercel.app`
- `Redirect URLs`
  - `http://localhost:3000/**`
  - `https://your-app.vercel.app/**`
  - Vercel Preview も使う場合は `https://*-your-team-slug.vercel.app/**`

### Google ログインを使う場合

Supabase の Google provider に加えて、Google Cloud 側の OAuth Client も確認します。

- `Authorized redirect URI`
  - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`

注意:

- アプリ側の OAuth 復帰先は `/api/auth/callback` です。
- ただし Google Cloud に登録する redirect URI は `Vercel の URL` ではなく `Supabase の callback URL` です。
- Supabase の `Redirect URLs` には `Vercel の URL` を追加します。

## デプロイ後の確認

1. ホームが表示できる
2. `/login` でメールログインできる
3. Google ログインが有効なら認証後に `/mypage` に戻る
4. `/upload` で投稿できる
5. 投稿した動画がホームと詳細に表示される

参考:

- [Vercel Next.js overview](https://vercel.com/docs/concepts/next.js/overview)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Supabase Google Login](https://supabase.com/docs/guides/auth/social-login/auth-google)

## 実装メモ

- `lib/supabase/client.ts`
  - クライアントコンポーネント用 Supabase クライアント
- `lib/supabase/server.ts`
  - App Router のサーバーコンポーネント / Route Handler / Middleware 用 Supabase クライアント
- `lib/youtube.ts`
  - YouTube URL 解析
  - `video_id` 抽出
  - サムネイル URL 生成
  - 埋め込み URL 生成
- `lib/videos.ts`
  - Supabase SDK による動画取得 / 投稿処理
- `lib/profile.ts`
  - プロフィールの upsert と取得
