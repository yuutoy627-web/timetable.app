# トラブルシューティング - 「毎回開けなくなる」問題

## よくある原因と解決方法

### 1. 環境変数が読み込まれていない

**症状**: 開発サーバーを起動してもエラーが表示される、またはページが表示されない

**原因**: `.env.local`ファイルが正しく読み込まれていない、または環境変数が変更された後にサーバーを再起動していない

**解決方法**:

```bash
# 1. 環境変数を確認
cat .env.local

# 2. 開発サーバーを完全に停止
# ターミナルで Ctrl + C

# 3. .nextフォルダを削除（キャッシュクリア）
rm -rf .next

# 4. 開発サーバーを再起動
npm run dev
```

### 2. ポートが使用中

**症状**: 「Port 3000 is already in use」というエラー

**解決方法**:

```bash
# ポート3000を使用しているプロセスを停止
lsof -ti:3000 | xargs kill -9

# または別のポートで起動
npm run dev -- -p 3001
```

### 3. キャッシュの問題

**症状**: コードを変更しても反映されない、または古いエラーが表示される

**解決方法**:

```bash
# .nextフォルダを削除
rm -rf .next

# node_modulesも再インストール（必要に応じて）
rm -rf node_modules
npm install

# 開発サーバーを再起動
npm run dev
```

### 4. 依存関係の問題

**症状**: モジュールが見つからないエラー

**解決方法**:

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# 開発サーバーを再起動
npm run dev
```

### 5. 環境変数の形式エラー

**症状**: 「Invalid supabaseUrl」などのエラー

**解決方法**:

`.env.local`ファイルを確認して、以下の点をチェック：

- 値に余分なスペースがないか
- 引用符（`"`や`'`）で囲んでいないか
- 改行が正しく入っているか
- 値が正しく設定されているか

正しい形式：

```env
NEXT_PUBLIC_SUPABASE_URL=https://gqcgrrxjfrazkdugjege.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 毎回確実に起動する方法

### 起動スクリプトの作成

プロジェクトルートに `start.sh` ファイルを作成：

```bash
#!/bin/bash

# ポート3000を使用しているプロセスを停止
lsof -ti:3000 | xargs kill -9 2>/dev/null

# キャッシュをクリア
rm -rf .next

# 環境変数を確認
if [ ! -f .env.local ]; then
    echo "エラー: .env.localファイルが見つかりません"
    exit 1
fi

# 開発サーバーを起動
npm run dev
```

実行権限を付与：

```bash
chmod +x start.sh
```

起動時：

```bash
./start.sh
```

### package.jsonにスクリプトを追加

`package.json`の`scripts`セクションに以下を追加：

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:clean": "rm -rf .next && next dev",
    "dev:reset": "rm -rf .next node_modules package-lock.json && npm install && next dev"
  }
}
```

使用例：

```bash
# キャッシュをクリアして起動
npm run dev:clean

# 完全にリセットして起動（時間がかかります）
npm run dev:reset
```

## チェックリスト

毎回起動する前に確認：

- [ ] `.env.local`ファイルが存在する
- [ ] 環境変数が正しく設定されている
- [ ] ポート3000が使用されていない
- [ ] `node_modules`がインストールされている
- [ ] 開発サーバーを再起動した

## よくあるエラーと解決方法

### エラー: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### エラー: "Invalid supabaseUrl"

`.env.local`ファイルを確認して、値が正しく設定されているか確認

### エラー: "Port 3000 is already in use"

```bash
lsof -ti:3000 | xargs kill -9
```

### エラー: "Your project's URL and Key are required"

`.env.local`ファイルが存在するか、環境変数が正しく設定されているか確認

## 推奨される起動手順

毎回以下の手順で起動すると、問題が起きにくくなります：

```bash
# 1. プロジェクトディレクトリに移動
cd /Users/sentinel/Documents/baibko-dhingu

# 2. 環境変数を確認
cat .env.local

# 3. ポートをクリア（必要に応じて）
lsof -ti:3000 | xargs kill -9 2>/dev/null

# 4. 開発サーバーを起動
npm run dev
```

## それでも解決しない場合

1. **ターミナルのエラーメッセージを確認**
   - エラーメッセージの全文をコピー

2. **ブラウザの開発者ツールを確認**
   - F12キーで開発者ツールを開く
   - Consoleタブでエラーを確認

3. **ログを確認**
   - ターミナルに表示されるエラーメッセージを確認

4. **環境を確認**
   - Node.jsのバージョン: `node --version`
   - npmのバージョン: `npm --version`


