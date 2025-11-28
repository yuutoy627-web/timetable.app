# Google認証の設定方法（日本語UI対応）

## 現在の状態

Google Cloud Consoleの「OAuth の概要」ページが表示されています。
「このプロジェクトのOAuth クライアントはまだ構成されていません。」というメッセージが表示されているので、OAuthクライアントを作成する必要があります。

## 手順

### Step 1: OAuth同意画面を設定

1. **左メニューから「APIとサービス」を選択**
   - または「APIs & Services」と表示されている場合もあります

2. **「OAuth同意画面」をクリック**
   - または「OAuth consent screen」と表示されている場合もあります

3. **ユーザータイプを選択**
   - 「外部」（External）を選択
   - 「作成」ボタンをクリック

4. **アプリ情報を入力**
   - **アプリ名**: Universal Timeline Maker（任意の名前でOK）
   - **ユーザーサポートメール**: あなたのメールアドレスを選択
   - **アプリのロゴ**: スキップ可能
   - **アプリのドメイン**: スキップ可能
   - **アプリのホームページ**: スキップ可能
   - **プライバシーポリシーリンク**: スキップ可能
   - **利用規約リンク**: スキップ可能
   - **承認済みドメイン**: スキップ可能
   - **開発者の連絡先情報**: あなたのメールアドレスを入力
   - 「保存して次へ」をクリック

5. **スコープ（スキップ可能）**
   - デフォルトのまま「保存して次へ」をクリック

6. **テストユーザー（スキップ可能）**
   - スキップして「保存して次へ」をクリック

7. **概要を確認**
   - 内容を確認して「ダッシュボードに戻る」をクリック

### Step 2: OAuthクライアントを作成

#### 方法1: 「OAuth クライアントを作成」ボタンから

1. **「OAuth の概要」ページで「OAuth クライアントを作成」ボタンをクリック**
   - 画面右上の「OAuth クライアントを作成」ボタン

#### 方法2: メニューから

1. **左メニューから「APIとサービス」→「認証情報」を選択**
   - または「APIs & Services」→「Credentials」

2. **画面上部の「+ 認証情報を作成」をクリック**
   - または「+ CREATE CREDENTIALS」

3. **「OAuth クライアント ID」を選択**
   - または「OAuth client ID」

### Step 3: OAuthクライアントの設定

1. **アプリケーションの種類を選択**
   - 「ウェブアプリケーション」を選択
   - または「Web application」

2. **名前を入力**
   - 例：「Supabase Auth」または「Universal Timeline Maker Auth」

3. **承認済みのリダイレクト URI を追加**
   - 「URI を追加」または「+ ADD URI」をクリック
   - 以下のURLを入力：
     ```
     https://gqcgrrxjfrazkdugjege.supabase.co/auth/v1/callback
     ```
   - **重要**: `gqcgrrxjfrazkdugjege`の部分は、あなたのSupabaseプロジェクトIDに置き換えてください

4. **「作成」ボタンをクリック**

5. **認証情報が表示されます**
   - **クライアント ID**（Client ID）をコピー
   - **クライアント シークレット**（Client Secret）をコピー
   - **重要**: クライアント シークレットはこの時だけ表示されます。後で確認できないので、必ずコピーしてください

### Step 4: Supabaseの設定画面に入力

1. **Supabaseダッシュボードに戻る**
   - 「Authentication」→「Providers」→「Google」の設定画面を開く

2. **認証情報を入力**
   - **Client IDs**: Google Cloud Consoleで取得したクライアント IDを貼り付け
   - **Client Secret (for OAuth)**: Google Cloud Consoleで取得したクライアント シークレットを貼り付け

3. **保存**
   - 右下の「Save」ボタンをクリック

### Step 5: 動作確認

1. **ブラウザでアプリケーションにアクセス**
   - `http://localhost:3000` を開く

2. **「Googleでログイン」ボタンをクリック**

3. **Googleアカウントの選択画面が表示されれば成功**
   - アカウントを選択してログインできるはずです

## 日本語UIでの用語対応表

| 英語 | 日本語 |
|------|--------|
| APIs & Services | APIとサービス |
| OAuth consent screen | OAuth同意画面 |
| Credentials | 認証情報 |
| Create credentials | 認証情報を作成 |
| OAuth client ID | OAuth クライアント ID |
| Web application | ウェブアプリケーション |
| Authorized redirect URIs | 承認済みのリダイレクト URI |
| Client ID | クライアント ID |
| Client Secret | クライアント シークレット |
| External | 外部 |
| Create | 作成 |
| Save and continue | 保存して次へ |
| Back to dashboard | ダッシュボードに戻る |

## トラブルシューティング

### エラー: "redirect_uri_mismatch"

**原因**: リダイレクトURIが一致していない

**解決方法**:
1. Google Cloud Consoleの「承認済みのリダイレクト URI」に以下を追加：
   ```
   https://[あなたのSupabaseプロジェクトID].supabase.co/auth/v1/callback
   ```
2. SupabaseのCallback URLと完全に一致しているか確認

### エラー: "invalid_client"

**原因**: クライアント IDまたはクライアント シークレットが間違っている

**解決方法**:
1. Google Cloud Consoleでクライアント IDとクライアント シークレットを再確認
2. Supabaseの設定画面で正しく入力されているか確認
3. 余分なスペースが入っていないか確認

### クライアント シークレットを忘れた場合

**解決方法**:
1. Google Cloud Consoleの「APIとサービス」→「認証情報」を開く
2. 作成したOAuth クライアント IDをクリック
3. クライアント シークレットの横にある「表示」アイコンをクリック
4. パスワードを入力して表示
5. 新しいクライアント シークレットをコピー

## まとめ

1. OAuth同意画面を設定（外部ユーザー）
2. OAuthクライアントを作成（ウェブアプリケーション）
3. リダイレクトURIを設定
4. クライアント IDとクライアント シークレットを取得
5. Supabaseの設定画面に入力
6. 動作確認

これでGoogle認証が動作するはずです！


