# デバッグ手順

## 現在の問題

「まだ開けない」という問題を解決するために、以下の手順で確認してください。

## Step 1: エラーメッセージの確認

### ターミナルで確認

開発サーバーを起動したターミナルで、エラーメッセージを確認してください。

よくあるエラー：

1. **"Invalid supabaseUrl"**
   - `.env.local`ファイルの値が正しくない
   - 解決: `.env.local`を確認して、値に余分なスペースがないか確認

2. **"Your project's URL and Key are required"**
   - 環境変数が読み込まれていない
   - 解決: 開発サーバーを再起動

3. **"Port 3000 is already in use"**
   - ポートが使用中
   - 解決: `lsof -ti:3000 | xargs kill -9`

### ブラウザで確認

1. ブラウザで `http://localhost:3000` を開く
2. F12キーで開発者ツールを開く
3. Consoleタブでエラーメッセージを確認
4. Networkタブでリクエストのエラーを確認

## Step 2: 環境変数の確認

```bash
# 環境変数が正しく設定されているか確認
cat .env.local

# 期待される出力:
# NEXT_PUBLIC_SUPABASE_URL=https://gqcgrrxjfrazkdugjege.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 3: 開発サーバーの状態確認

```bash
# ポート3000が使用されているか確認
lsof -ti:3000

# 使用されている場合は停止
lsof -ti:3000 | xargs kill -9
```

## Step 4: クリーンアップと再起動

```bash
# 1. キャッシュを削除
rm -rf .next

# 2. 開発サーバーを起動
npm run dev
```

## Step 5: エラーログの共有

以下の情報を共有していただけると、より具体的な解決策を提案できます：

1. **ターミナルのエラーメッセージ**（全文）
2. **ブラウザのConsoleエラー**（F12 → Consoleタブ）
3. **ブラウザに表示されているエラーページの内容**

## よくある問題と解決方法

### 問題1: 白い画面が表示される

**原因**: JavaScriptエラーまたは環境変数の問題

**解決方法**:
```bash
rm -rf .next
npm run dev
```

### 問題2: 404エラー

**原因**: ルーティングの問題

**解決方法**: `app/page.tsx`が存在するか確認

### 問題3: 認証エラー

**原因**: Supabaseの設定が完了していない

**解決方法**: 
- `.env.local`が正しく設定されているか確認
- SupabaseでGoogle認証が有効になっているか確認

## 緊急時の対処法

すべてがうまくいかない場合：

```bash
# 完全リセット
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```


