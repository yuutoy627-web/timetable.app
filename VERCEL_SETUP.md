# Vercelへのデプロイ手順（詳細版）

## 前提条件

- GitHubリポジトリが作成済み（`https://github.com/yuutoy627-web/TTtaime.git`）
- コードがGitHubにプッシュ済み

## Step 1: Vercelアカウントの作成

1. **Vercelのウェブサイトにアクセス**
   - [https://vercel.com](https://vercel.com) を開く

2. **「Sign Up」または「Log In」をクリック**
   - 初めての場合は「Sign Up」をクリック

3. **GitHubアカウントでログイン**
   - 「Continue with GitHub」をクリック
   - GitHubの認証画面で「Authorize Vercel」をクリック
   - これでVercelとGitHubが連携されます

## Step 2: プロジェクトのインポート

1. **Vercelダッシュボードに移動**
   - ログイン後、自動的にダッシュボードが表示されます
   - 表示されない場合は、左上の「Vercel」ロゴをクリック

2. **「Add New Project」をクリック**
   - ダッシュボードの中央上部に表示されています
   - または「New Project」ボタンをクリック

3. **GitHubリポジトリを選択**
   - 「Import Git Repository」セクションが表示されます
   - リポジトリ一覧から `yuutoy627-web/TTtaime` を探す
   - 見つからない場合は：
     - 「Configure GitHub App」をクリック
     - リポジトリへのアクセス権限を付与
     - 再度リポジトリ一覧を確認

4. **リポジトリを選択**
   - `yuutoy627-web/TTtaime` をクリック
   - 「Import」ボタンをクリック

## Step 3: プロジェクト設定

インポート後、プロジェクト設定画面が表示されます：

### 3-1. プロジェクト名の確認
- **Project Name**: `TTtaime` または任意の名前に変更可能
- そのままでも問題ありません

### 3-2. フレームワーク設定（自動検出）
- **Framework Preset**: Next.js が自動的に検出されます
- 変更する必要はありません

### 3-3. ルートディレクトリ
- **Root Directory**: `.` （プロジェクトルート）
- 変更する必要はありません

### 3-4. ビルド設定
- **Build Command**: `npm run build` （自動設定）
- **Output Directory**: `.next` （自動設定）
- **Install Command**: `npm install` （自動設定）
- 通常は変更する必要はありません

### 3-5. 環境変数の設定（重要！）

**ここが最も重要です！** 環境変数を設定しないと、アプリケーションが動作しません。

1. **「Environment Variables」セクションを開く**
   - 設定画面の下部にあります
   - 「+」ボタンまたは「Add」ボタンをクリック

2. **以下の3つの環境変数を追加**

   #### 環境変数1: `NEXT_PUBLIC_SUPABASE_URL`
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: 実際のSupabaseプロジェクトのURL
     - 例: `https://xxxxx.supabase.co`
     - Supabaseダッシュボード → Settings → API → Project URL から取得
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - すべてにチェックを入れる

   #### 環境変数2: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: 実際のSupabaseのanon key
     - 例: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     - Supabaseダッシュボード → Settings → API → anon public key から取得
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - すべてにチェックを入れる

   #### 環境変数3: `NEXT_PUBLIC_SITE_URL`
   - **Key**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: デプロイ後のURL（後で更新可能）
     - 最初は仮の値でOK: `https://tttaime.vercel.app`
     - デプロイ後、実際のURLに更新
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - すべてにチェックを入れる

3. **各環境変数を追加後、「Save」をクリック**

### 3-6. デプロイ

1. **設定が完了したら、「Deploy」ボタンをクリック**
   - 画面下部の大きな「Deploy」ボタン

2. **デプロイの進行を確認**
   - ビルドログが表示されます
   - 通常1-3分で完了します

3. **デプロイ完了**
   - 「Congratulations!」メッセージが表示されます
   - デプロイされたURLが表示されます（例: `https://tttaime.vercel.app`）

## Step 4: デプロイ後の設定

### 4-1. 実際のURLを確認

デプロイが完了したら、実際のURLを確認してください：
- 例: `https://tttaime.vercel.app`
- このURLはVercelダッシュボードのプロジェクトページに表示されています

### 4-2. 環境変数の更新

1. **Vercelダッシュボードでプロジェクトを開く**
2. **「Settings」タブをクリック**
3. **「Environment Variables」をクリック**
4. **`NEXT_PUBLIC_SITE_URL`を編集**
   - 実際のデプロイURLに更新
   - 例: `https://tttaime.vercel.app`
5. **「Save」をクリック**
6. **「Redeploy」をクリック**（変更を反映するため）

### 4-3. Supabaseの設定を更新

1. **Supabaseダッシュボードにアクセス**
   - [https://supabase.com/dashboard](https://supabase.com/dashboard)

2. **プロジェクトを選択**

3. **「Authentication」→「URL Configuration」を開く**

4. **Site URLを更新**
   - 現在: `http://localhost:3000`
   - 更新後: `https://tttaime.vercel.app`（実際のURLに置き換え）

5. **Redirect URLsに追加**
   - 「Add URL」をクリック
   - 以下を追加：
     ```
     https://tttaime.vercel.app/auth/callback
     https://tttaime.vercel.app/**
     ```
   - 実際のURLに置き換えてください

6. **「Save」をクリック**

### 4-4. Google OAuthの設定を更新

1. **Google Cloud Consoleにアクセス**
   - [https://console.cloud.google.com](https://console.cloud.google.com)

2. **「APIs & Services」→「Credentials」を開く**

3. **作成したOAuth 2.0 Client IDを選択**

4. **「Authorized redirect URIs」に追加**
   - 「+ ADD URI」をクリック
   - 以下を追加：
     ```
     https://tttaime.vercel.app/auth/callback
     ```
   - 実際のURLに置き換えてください

5. **「Save」をクリック**

## Step 5: 動作確認

1. **デプロイされたURLにアクセス**
   - 例: `https://tttaime.vercel.app`

2. **「Googleでログイン」ボタンをクリック**

3. **Googleアカウントの選択画面が表示されれば成功！**

## よくある問題と解決方法

### 問題1: リポジトリが見つからない

**解決方法**:
1. Vercelダッシュボードで「Settings」→「Git」を開く
2. 「Configure GitHub App」をクリック
3. リポジトリへのアクセス権限を付与
4. 再度「Add New Project」からインポート

### 問題2: ビルドエラーが発生する

**解決方法**:
1. Vercelのデプロイログを確認
2. エラーメッセージを確認
3. よくある原因：
   - 環境変数が設定されていない
   - 依存関係の問題
   - TypeScriptのエラー

### 問題3: デプロイ後、アプリが動作しない

**解決方法**:
1. 環境変数が正しく設定されているか確認
2. SupabaseのリダイレクトURLが更新されているか確認
3. Google OAuthのリダイレクトURLが更新されているか確認
4. ブラウザのコンソールでエラーを確認

### 問題4: Googleログインが動作しない

**解決方法**:
1. Supabaseの「Authentication」→「URL Configuration」を確認
2. Google Cloud ConsoleのリダイレクトURLを確認
3. 環境変数`NEXT_PUBLIC_SITE_URL`が正しいか確認
4. Vercelで環境変数を更新後、再デプロイ

## 今後の更新方法

コードを更新する場合：

1. **ローカルで変更をコミット**
   ```bash
   git add .
   git commit -m "変更内容"
   git push origin main
   ```

2. **Vercelが自動的にデプロイ**
   - GitHubにプッシュすると、自動的にVercelがデプロイを開始します
   - Vercelダッシュボードで進行状況を確認できます

3. **手動で再デプロイする場合**
   - Vercelダッシュボード → プロジェクト → 「Deployments」タブ
   - 該当するデプロイの「...」メニュー → 「Redeploy」

## まとめ

1. ✅ Vercelアカウントを作成（GitHubでログイン）
2. ✅ プロジェクトをインポート
3. ✅ 環境変数を設定（重要！）
4. ✅ デプロイ
5. ✅ SupabaseとGoogle OAuthの設定を更新
6. ✅ 動作確認

これで完了です！🎉
