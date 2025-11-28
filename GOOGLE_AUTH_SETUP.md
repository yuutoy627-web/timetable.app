# Google認証の設定方法

## エラーについて

「Unsupported provider: provider is not enabled」というエラーは、SupabaseでGoogle認証が有効になっていないことを示しています。

## 解決方法

### Step 1: SupabaseダッシュボードでGoogle認証を有効化

1. **Supabaseダッシュボードにアクセス**
   - [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - プロジェクトを開く

2. **Authentication設定を開く**
   - 左サイドバーで「Authentication」（👤アイコン）をクリック
   - または「Settings」→「Authentication」をクリック

3. **Providersを開く**
   - 「Providers」タブをクリック
   - または「Authentication」→「Providers」をクリック

4. **Googleを有効化**
   - プロバイダー一覧から「Google」を探す
   - 「Google」の右側にあるトグルスイッチを「ON」にする

### Step 2: Google Cloud ConsoleでOAuth認証情報を作成

Google認証を使用するには、Google Cloud ConsoleでOAuth認証情報を作成する必要があります。

#### 2-1. Google Cloud Consoleにアクセス

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. Googleアカウントでログイン

#### 2-2. プロジェクトを作成（または既存のプロジェクトを選択）

1. 画面上部のプロジェクト選択ドロップダウンをクリック
2. 「New Project」をクリック
3. プロジェクト名を入力（例：「Universal Timeline Maker」）
4. 「Create」をクリック

#### 2-3. OAuth同意画面を設定

1. 左メニューから「APIs & Services」→「OAuth consent screen」を選択
2. User Typeを選択：
   - **External**（一般公開）を選択
   - 「Create」をクリック
3. アプリ情報を入力：
   - **App name**: Universal Timeline Maker（任意）
   - **User support email**: あなたのメールアドレス
   - **Developer contact information**: あなたのメールアドレス
4. 「Save and Continue」をクリック
5. Scopes（スコープ）はデフォルトのまま「Save and Continue」
6. Test users（テストユーザー）はスキップして「Save and Continue」
7. 概要を確認して「Back to Dashboard」をクリック

#### 2-4. OAuth認証情報を作成

1. 左メニューから「APIs & Services」→「Credentials」を選択
2. 画面上部の「+ CREATE CREDENTIALS」をクリック
3. 「OAuth client ID」を選択
4. Application typeを選択：
   - **Web application**を選択
5. 名前を入力（例：「Supabase Auth」）
6. **Authorized redirect URIs**を追加：
   ```
   https://gqcgrrxjfrazkdugjege.supabase.co/auth/v1/callback
   ```
   **重要**: `gqcgrrxjfrazkdugjege`の部分をあなたのSupabaseプロジェクトのIDに置き換えてください
7. 「Create」をクリック
8. **Client ID**と**Client Secret**が表示されます
   - これらをコピーしてください（後で使います）

### Step 3: Supabaseに認証情報を設定

1. **Supabaseダッシュボードに戻る**
   - 「Authentication」→「Providers」→「Google」を開く

2. **認証情報を入力**
   - **Client ID (for OAuth)**: Google Cloud Consoleで取得したClient IDを貼り付け
   - **Client Secret (for OAuth)**: Google Cloud Consoleで取得したClient Secretを貼り付け

3. **保存**
   - 「Save」ボタンをクリック

### Step 4: リダイレクトURLの確認

Supabaseの「Authentication」→「URL Configuration」で以下を確認：

- **Site URL**: `http://localhost:3000`（開発環境の場合）
- **Redirect URLs**: 以下が含まれていることを確認
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/**`

### Step 5: アプリケーションを再起動

1. 開発サーバーを停止（`Ctrl + C`）
2. 再起動：

```bash
npm run dev
```

### Step 6: 動作確認

1. ブラウザで `http://localhost:3000` にアクセス
2. 「Googleでログイン」ボタンをクリック
3. Googleアカウントの選択画面が表示されれば成功

## トラブルシューティング

### エラー: "redirect_uri_mismatch"

**原因**: Google Cloud Consoleで設定したリダイレクトURIとSupabaseの設定が一致していない

**解決方法**:
1. Google Cloud Consoleの「Authorized redirect URIs」に以下を追加：
   ```
   https://[あなたのSupabaseプロジェクトID].supabase.co/auth/v1/callback
   ```
2. Supabaseの「Authentication」→「URL Configuration」でリダイレクトURLを確認

### エラー: "invalid_client"

**原因**: Client IDまたはClient Secretが間違っている

**解決方法**:
1. Google Cloud ConsoleでClient IDとClient Secretを再確認
2. Supabaseの設定画面で正しく入力されているか確認
3. 余分なスペースが入っていないか確認

### エラー: "access_denied"

**原因**: OAuth同意画面の設定が完了していない

**解決方法**:
1. Google Cloud Consoleで「OAuth consent screen」の設定を完了
2. すべてのステップ（App info, Scopes, Test users, Summary）を完了

## 本番環境へのデプロイ時

本番環境にデプロイする場合は、以下も設定してください：

1. **Google Cloud Console**:
   - 本番環境のリダイレクトURIを追加：
     ```
     https://your-app-domain.com/auth/callback
     ```

2. **Supabase**:
   - 「Authentication」→「URL Configuration」で：
     - **Site URL**: 本番環境のURL
     - **Redirect URLs**: 本番環境のリダイレクトURLを追加

## まとめ

1. SupabaseでGoogle認証を有効化
2. Google Cloud ConsoleでOAuth認証情報を作成
3. SupabaseにClient IDとClient Secretを設定
4. リダイレクトURLを正しく設定
5. アプリケーションを再起動

これでGoogle認証が動作するはずです！


