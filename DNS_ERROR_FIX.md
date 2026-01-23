# DNSエラーの解決方法

## エラーについて

Googleログイン時に「DNS_PROBE_FINISHED_NXDOMAIN」エラーが発生する場合、以下の原因が考えられます：

1. **環境変数`NEXT_PUBLIC_SUPABASE_URL`が間違っている**
2. **Supabaseプロジェクトが削除された、またはURLが変更された**
3. **環境変数が設定されていない**

## 解決方法

### Step 1: 環境変数の確認

プロジェクトルートに`.env.local`ファイルが存在するか確認してください：

```bash
# プロジェクトルートで実行
ls -la .env.local
```

ファイルが存在しない場合は、作成してください。

### Step 2: SupabaseプロジェクトのURLを確認

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にアクセス
2. プロジェクトを選択
3. 「Settings」（⚙️）→「API」を開く
4. **Project URL**をコピー（例：`https://xxxxx.supabase.co`）

**重要**: URLは`https://`で始まり、`.supabase.co`で終わる必要があります。

### Step 3: 環境変数を設定

`.env.local`ファイルを開き、以下の内容を確認・設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**重要**: 
- `xxxxx`の部分を実際のSupabaseプロジェクトのURLに置き換えてください
- `eyJ...`の部分を実際のanon keyに置き換えてください（Settings → APIから取得）

### Step 4: 開発サーバーの再起動

環境変数を変更した後は、**必ず開発サーバーを再起動**してください：

1. 現在の開発サーバーを停止（ターミナルで `Ctrl + C`）
2. 再度起動：

```bash
npm run dev
```

### Step 5: 環境変数が正しく読み込まれているか確認

ブラウザの開発者ツール（F12）を開き、コンソールタブで以下のコマンドを実行：

```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

**注意**: これはクライアント側での確認方法です。サーバー側の環境変数は、ブラウザのコンソールでは確認できません。

### Step 6: Supabaseプロジェクトの状態を確認

1. Supabaseダッシュボードでプロジェクトがアクティブか確認
2. プロジェクトが一時停止していないか確認
3. プロジェクトのURLが変更されていないか確認

## よくある問題

### 問題1: 環境変数が読み込まれない

**原因**: Next.jsは起動時に環境変数を読み込みます。環境変数を変更した後、サーバーを再起動していない可能性があります。

**解決方法**: 開発サーバーを再起動してください。

### 問題2: 間違ったSupabaseプロジェクトのURLが設定されている

**原因**: 古いプロジェクトのURLが設定されている、またはタイプミスがある。

**解決方法**: 
1. Supabaseダッシュボードで正しいURLを確認
2. `.env.local`ファイルの`NEXT_PUBLIC_SUPABASE_URL`を更新
3. 開発サーバーを再起動

### 問題3: Supabaseプロジェクトが削除された

**原因**: Supabaseプロジェクトが削除された、または一時停止している。

**解決方法**: 
1. Supabaseダッシュボードでプロジェクトの状態を確認
2. プロジェクトが削除されている場合は、新しいプロジェクトを作成
3. 新しいプロジェクトのURLとキーを`.env.local`に設定

## 確認チェックリスト

- [ ] `.env.local`ファイルが存在する
- [ ] `NEXT_PUBLIC_SUPABASE_URL`が正しく設定されている（`https://`で始まり、`.supabase.co`で終わる）
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`が正しく設定されている
- [ ] `NEXT_PUBLIC_SITE_URL`が設定されている（開発環境では`http://localhost:3000`）
- [ ] 開発サーバーを再起動した
- [ ] Supabaseプロジェクトがアクティブである
- [ ] SupabaseダッシュボードでGoogle認証が有効になっている

## 追加のトラブルシューティング

問題が解決しない場合は、以下を確認してください：

1. **ブラウザのキャッシュをクリア**
2. **シークレットモードで試す**
3. **ネットワーク接続を確認**
4. **Supabaseのステータスページを確認**: [https://status.supabase.com/](https://status.supabase.com/)
