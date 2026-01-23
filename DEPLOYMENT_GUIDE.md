# デプロイメントガイド

## リポジトリ情報

- **GitHubリポジトリ**: `https://github.com/yuutoy627-web/TTtaime.git`

## 1. ローカル環境の設定

### Step 1: 環境変数ファイルの作成

プロジェクトルートに`.env.local`ファイルを作成し、以下の内容を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**重要**: 
- `xxxxx`を実際のSupabaseプロジェクトのURLに置き換えてください
- `eyJ...`を実際のanon keyに置き換えてください
- Supabaseダッシュボード → Settings → API から取得できます

### Step 2: 開発サーバーの起動

```bash
npm run dev
```

## 2. Vercelへのデプロイ

### Step 1: Vercelアカウントの作成

1. [Vercel](https://vercel.com/)にアクセス
2. GitHubアカウントでログイン
3. 「Add New Project」をクリック

### Step 2: プロジェクトのインポート

1. GitHubリポジトリ `yuutoy627-web/TTtaime` を選択
2. 「Import」をクリック

### Step 3: 環境変数の設定

Vercelのプロジェクト設定画面で、以下の環境変数を設定：

1. **Settings** → **Environment Variables** を開く
2. 以下の3つの環境変数を追加：

   ```
   NEXT_PUBLIC_SUPABASE_URL
   ```
   - Value: 実際のSupabaseプロジェクトのURL（例：`https://xxxxx.supabase.co`）
   - Environment: Production, Preview, Development すべてにチェック

   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   - Value: 実際のSupabaseのanon key
   - Environment: Production, Preview, Development すべてにチェック

   ```
   NEXT_PUBLIC_SITE_URL
   ```
   - Value: デプロイ後のURL（例：`https://your-app-name.vercel.app`）
   - Environment: Production, Preview, Development すべてにチェック

3. 「Save」をクリック

### Step 4: デプロイ

1. 「Deploy」ボタンをクリック
2. デプロイが完了するまで待機（通常1-2分）
3. デプロイが完了すると、URLが表示されます

### Step 5: SupabaseのリダイレクトURL設定

デプロイ後、Supabaseの設定を更新する必要があります：

1. **Supabaseダッシュボード** → **Authentication** → **URL Configuration** を開く
2. **Redirect URLs**に以下を追加：
   ```
   https://your-app-name.vercel.app/auth/callback
   https://your-app-name.vercel.app/**
   ```
3. **Site URL**を更新：
   ```
   https://your-app-name.vercel.app
   ```
4. 「Save」をクリック

### Step 6: Google OAuthのリダイレクトURL設定

Google Cloud ConsoleでもリダイレクトURLを更新：

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. **APIs & Services** → **Credentials** を開く
3. 作成したOAuth 2.0 Client IDを選択
4. **Authorized redirect URIs**に以下を追加：
   ```
   https://your-app-name.vercel.app/auth/callback
   ```
5. 「Save」をクリック

## 3. その他のホスティングサービス

### Netlify

1. [Netlify](https://www.netlify.com/)でプロジェクトをインポート
2. **Site settings** → **Environment variables** で環境変数を設定
3. ビルドコマンド: `npm run build`
4. 公開ディレクトリ: `.next`

### Railway

1. [Railway](https://railway.app/)でプロジェクトをインポート
2. **Variables**タブで環境変数を設定
3. 自動的にデプロイされます

## 4. デプロイ後の確認事項

- [ ] アプリケーションが正常に表示される
- [ ] Googleログインが動作する
- [ ] データベース接続が正常に動作する
- [ ] 環境変数が正しく設定されている
- [ ] SupabaseのリダイレクトURLが更新されている
- [ ] Google OAuthのリダイレクトURLが更新されている

## 5. トラブルシューティング

### デプロイ後にエラーが発生する場合

1. **環境変数の確認**
   - Vercelのダッシュボードで環境変数が正しく設定されているか確認
   - 値に余分なスペースや引用符が入っていないか確認

2. **ビルドログの確認**
   - Vercelのデプロイログを確認
   - エラーメッセージを確認

3. **Supabaseの設定確認**
   - リダイレクトURLが正しく設定されているか確認
   - Site URLが正しく設定されているか確認

4. **Google OAuthの設定確認**
   - リダイレクトURLが正しく設定されているか確認
   - Client IDとClient Secretが正しいか確認

## 6. 環境変数の管理

### 開発環境（ローカル）

- `.env.local`ファイルで管理
- Gitにコミットしない（`.gitignore`に含まれている）

### 本番環境（Vercel）

- Vercelのダッシュボードで管理
- 環境ごと（Production, Preview, Development）に設定可能

### 環境変数の一覧

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトのURL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseの匿名キー | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_SITE_URL` | アプリケーションのURL | `http://localhost:3000`（開発）<br>`https://your-app.vercel.app`（本番） |

## 7. セキュリティに関する注意事項

- **絶対に環境変数をGitにコミットしない**
- `.env.local`ファイルは`.gitignore`に含まれていることを確認
- 本番環境の環境変数は、ホスティングサービスの設定画面でのみ管理
- Supabaseのanon keyは公開されても問題ありませんが、service role keyは絶対に公開しないでください
