#!/bin/bash

# ポート3000を使用しているプロセスを停止
echo "ポート3000をクリア中..."
lsof -ti:3000 | xargs kill -9 2>/dev/null

# キャッシュをクリア
echo "キャッシュをクリア中..."
rm -rf .next

# 環境変数を確認
if [ ! -f .env.local ]; then
    echo "エラー: .env.localファイルが見つかりません"
    echo ".env.localファイルを作成して、環境変数を設定してください"
    exit 1
fi

echo "環境変数を確認中..."
if ! grep -q "NEXT_PUBLIC_SUPABASE_URL=https://" .env.local; then
    echo "警告: NEXT_PUBLIC_SUPABASE_URLが正しく設定されていない可能性があります"
fi

# 開発サーバーを起動
echo "開発サーバーを起動中..."
npm run dev


