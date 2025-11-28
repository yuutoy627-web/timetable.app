# 環境変数の設定方法

## エラーについて

「Your project's URL and Key are required to create a Supabase client!」というエラーは、Supabaseの環境変数が設定されていないことを示しています。

## 解決方法

### Step 1: Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセス
2. アカウントを作成（またはログイン）
3. 「New Project」をクリックして新しいプロジェクトを作成

### Step 2: SupabaseのURLとキーを取得

1. Supabaseダッシュボードでプロジェクトを開く
2. 左側のメニューから「Settings」（⚙️）をクリック
3. 「API」をクリック
4. 以下の情報をコピー：
   - **Project URL**: `https://xxxxx.supabase.co` の形式
   - **anon public key**: 長い文字列（`eyJ...`で始まる）

### Step 3: 環境変数ファイルの設定

プロジェクトルートに `.env.local` ファイルを作成（既に作成済みの場合は編集）：

```bash
# プロジェクトルートで実行
touch .env.local
```

`.env.local` ファイルに以下を記入：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**重要**: 
- `xxxxx` の部分を実際のSupabaseプロジェクトのURLに置き換えてください
- `eyJ...` の部分を実際のanon keyに置き換えてください

### Step 4: 開発サーバーの再起動

環境変数を変更した後は、**必ず開発サーバーを再起動**してください：

1. 現在の開発サーバーを停止（ターミナルで `Ctrl + C`）
2. 再度起動：

```bash
npm run dev
```

### Step 5: データベーススキーマの設定

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `docs/schema.sql` の内容をコピー
3. SQL Editorに貼り付けて実行（「Run」ボタンをクリック）

### Step 6: Google認証の設定

1. Supabaseダッシュボードで「Authentication」→「Providers」を開く
2. 「Google」を有効化
3. Google Cloud ConsoleでOAuth認証情報を設定
   - Client ID と Client Secret を取得
   - リダイレクトURL: `https://xxxxx.supabase.co/auth/v1/callback`
4. SupabaseにClient IDとClient Secretを入力

## 確認方法

環境変数が正しく設定されているか確認：

```bash
# ターミナルで確認（開発サーバー起動時）
# エラーが表示されなければOK
```

ブラウザで `http://localhost:3000` にアクセスして、エラーが表示されなければ成功です。

## トラブルシューティング

### エラーが続く場合

1. **ファイル名の確認**
   - `.env.local` という名前で、プロジェクトルート（`package.json`と同じ階層）に配置されているか確認

2. **値の確認**
   - URLとキーに余分なスペースや改行が入っていないか確認
   - 引用符（`"`や`'`）で囲まないでください

3. **サーバーの再起動**
   - 環境変数を変更した後は必ず開発サーバーを再起動

4. **ファイルの読み込み確認**
   - `.env.local` ファイルが `.gitignore` に含まれているか確認（含まれているはずです）

## 注意事項

- `.env.local` ファイルは**絶対にGitにコミットしないでください**
- 既に `.gitignore` に含まれているはずですが、確認してください
- 本番環境では、Vercelなどのホスティングサービスの環境変数設定から設定します


