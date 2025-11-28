# Universal Timeline Maker

タイムテーブルと持ち物リストを一元管理できるWebアプリケーション

## 📖 セットアップガイド

**詳細なセットアップ手順は [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) を参照してください。**

簡単な手順:

### 1. Next.jsプロジェクトの初期化

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

### 2. 必要なパッケージのインストール

```bash
npm install react-hook-form zod @hookform/resolvers clsx tailwind-merge lucide-react
npm install -D @types/node @types/react @types/react-dom
```

### 3. Shadcn UIのセットアップ

```bash
npx shadcn@latest init
npx shadcn@latest add button card form input select
```

**注意**: `shadcn-ui`パッケージは非推奨です。必ず`shadcn`を使用してください。

### 4. Supabaseの設定

1. [Supabase](https://supabase.com/)でアカウントを作成し、新しいプロジェクトを作成
2. プロジェクトの「Settings」→「API」から以下を取得：
   - Project URL
   - anon/public key
3. プロジェクトルートに `.env.local` ファイルを作成：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Supabaseダッシュボードで「Authentication」→「Providers」からGoogle認証を有効化
5. `docs/schema.sql` の内容をSupabaseのSQL Editorで実行してデータベーススキーマを作成

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## 📝 クイックスタート

**実際にアプリケーションを使うための手順は [`QUICK_START.md`](./QUICK_START.md) をご覧ください。**

**詳細なセットアップ手順、トラブルシューティング、動作確認方法は [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) をご覧ください。**

## プロジェクト構造

```
baibko-dhingu/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ホームページ（ウィザード表示）
│   ├── layout.tsx         # ルートレイアウト
│   └── globals.css        # グローバルスタイル
├── components/
│   ├── timeline-wizard/   # タイムラインウィザードコンポーネント
│   │   ├── timeline-wizard.tsx
│   │   ├── step-1-genre-selection.tsx
│   │   └── step-2-basic-info.tsx
│   └── ui/                # Shadcn UIコンポーネント
├── lib/
│   ├── hooks/             # カスタムフック
│   │   └── use-timeline-wizard.ts
│   ├── schemas/           # Zodスキーマ
│   │   └── timeline.ts
│   └── utils.ts           # ユーティリティ関数
├── types/
│   └── supabase.ts        # Supabase型定義
└── docs/
    └── schema.sql         # データベーススキーマ
```

## 実装済み機能

- ✅ Google認証（Chromeログイン）
- ✅ Step 1: ジャンル選択（音響、会議、旅行、ライフプラン、その他）
- ✅ Step 2: 基本情報入力（ジャンル別の動的フォーム）
- ✅ Step 3: イベント追加
- ✅ Step 4: 確認と保存（Supabaseへの保存）
- ✅ ダッシュボード（ジャンル別タイムテーブル一覧）
- ✅ タイムテーブル詳細表示・出力機能

## 技術スタック

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: Shadcn UI, Tailwind CSS, Lucide React
- **Form Handling**: React Hook Form + Zod
- **Backend/DB**: Supabase (PostgreSQL)

