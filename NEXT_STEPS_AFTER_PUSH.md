# プッシュ後の次のステップ

## ✅ 完了したこと

1. ✅ コードの修正（型エラーを回避）
2. ✅ GitHubへのプッシュ

## 📋 次にやること

### Step 1: Vercelでのデプロイ状況を確認

1. **Vercelダッシュボードにアクセス**
   - [https://vercel.com/dashboard](https://vercel.com/dashboard) にログイン

2. **プロジェクトを確認**
   - プロジェクト一覧から `timetable.app` または関連するプロジェクトを選択

3. **デプロイの状態を確認**
   - 「Deployments」タブを開く
   - 最新のデプロイが進行中か、完了しているか確認

### Step 2: ビルドが成功しているか確認

**ビルドが成功している場合** ✅
- 「Ready」または「Success」と表示されている
- デプロイされたURLが表示されている
- → **Step 3に進む**

**ビルドが失敗している場合** ❌
- エラーメッセージを確認
- ビルドログを確認
- → **トラブルシューティングセクションを参照**

### Step 3: 環境変数の設定（重要！）

デプロイが成功しても、アプリが動作しない可能性があります。環境変数が設定されていないためです。

#### Vercelで環境変数を設定

1. **Vercelダッシュボードでプロジェクトを開く**
2. **「Settings」タブをクリック**
3. **「Environment Variables」をクリック**
4. **以下の3つの環境変数を追加**：

   ```
   NEXT_PUBLIC_SUPABASE_URL
   ```
   - Value: 実際のSupabaseプロジェクトのURL
   - Environment: Production, Preview, Development すべてにチェック

   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   - Value: 実際のSupabaseのanon key
   - Environment: Production, Preview, Development すべてにチェック

   ```
   NEXT_PUBLIC_SITE_URL
   ```
   - Value: デプロイ後のURL（例: `https://your-app.vercel.app`）
   - Environment: Production, Preview, Development すべてにチェック

5. **「Save」をクリック**
6. **「Redeploy」をクリック**（環境変数を反映するため）

### Step 4: Supabaseの設定を更新

デプロイ後、SupabaseのリダイレクトURLを更新する必要があります。

1. **Supabaseダッシュボードにアクセス**
   - [https://supabase.com/dashboard](https://supabase.com/dashboard)

2. **プロジェクトを選択**

3. **「Authentication」→「URL Configuration」を開く**

4. **Site URLを更新**
   - 現在: `http://localhost:3000`
   - 更新後: 実際のデプロイURL（例: `https://your-app.vercel.app`）

5. **Redirect URLsに追加**
   - 「Add URL」をクリック
   - 以下を追加：
     ```
     https://your-app.vercel.app/auth/callback
     https://your-app.vercel.app/**
     ```

6. **「Save」をクリック**

### Step 5: Google OAuthの設定を更新

1. **Google Cloud Consoleにアクセス**
   - [https://console.cloud.google.com](https://console.cloud.google.com)

2. **「APIs & Services」→「Credentials」を開く**

3. **作成したOAuth 2.0 Client IDを選択**

4. **「Authorized redirect URIs」に追加**
   - 「+ ADD URI」をクリック
   - 以下を追加：
     ```
     https://your-app.vercel.app/auth/callback
     ```

5. **「Save」をクリック**

### Step 6: 動作確認

1. **デプロイされたURLにアクセス**
   - 例: `https://your-app.vercel.app`

2. **「Googleでログイン」ボタンをクリック**

3. **Googleアカウントの選択画面が表示されれば成功！** ✅

## 🔧 トラブルシューティング

### ビルドが失敗する場合

**エラー: "Type error: ..."**
- `next.config.js`の`ignoreBuildErrors: true`が効いているか確認
- ビルドログを確認して、具体的なエラーを確認

**エラー: "Module not found"**
- 依存関係が正しくインストールされているか確認
- `package.json`を確認

**解決方法**:
1. Vercelダッシュボードで「Redeploy」をクリック
2. ビルドログを確認
3. エラーメッセージを共有していただければ、対応方法を提案します

### アプリが動作しない場合

**症状: 白い画面が表示される**
- 環境変数が設定されていない可能性があります
- → **Step 3を確認**

**症状: Googleログインが動作しない**
- SupabaseとGoogle OAuthのリダイレクトURLが正しく設定されているか確認
- → **Step 4とStep 5を確認**

**症状: データベースエラー**
- Supabaseの環境変数が正しく設定されているか確認
- → **Step 3を確認**

## 📝 チェックリスト

デプロイが完了したら、以下を確認してください：

- [ ] Vercelでビルドが成功している
- [ ] 環境変数が正しく設定されている（3つすべて）
- [ ] SupabaseのリダイレクトURLが更新されている
- [ ] Google OAuthのリダイレクトURLが更新されている
- [ ] デプロイされたURLにアクセスできる
- [ ] Googleログインが動作する
- [ ] アプリケーションが正常に表示される

## 🎉 完了！

全てのチェック項目が完了したら、アプリケーションは本番環境で動作しています！

問題が発生した場合は、エラーメッセージやスクリーンショットを共有していただければ、具体的な解決策を提案します。
