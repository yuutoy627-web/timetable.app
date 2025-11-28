# データベーススキーマの設定方法

## エラーについて

「Could not find the table 'public.timelines' in the schema cache」というエラーは、データベーススキーマがまだ作成されていないことを示しています。

## 解決方法

### Step 1: Supabaseダッシュボードを開く

1. [Supabase](https://supabase.com/dashboard)にアクセス
2. プロジェクトを開く

### Step 2: SQL Editorを開く

1. 左サイドバーで「SQL Editor」をクリック
   - または「Database」→「SQL Editor」

### Step 3: スキーマを実行

1. 「New query」をクリック（新しいクエリを作成）
2. `docs/schema.sql` ファイルを開く
3. ファイルの内容をすべてコピー（`Ctrl + A` → `Ctrl + C`）
4. SQL Editorに貼り付け（`Ctrl + V`）
5. 「Run」ボタンをクリック（または `Ctrl + Enter`）

### Step 4: 実行結果を確認

**成功した場合**:
- 「Success. No rows returned」と表示されます
- または「Success」と表示されます

**エラーが出た場合**:
- エラーメッセージを確認
- よくあるエラーと解決方法を以下に記載

## よくあるエラーと解決方法

### エラー: "relation already exists"

**原因**: テーブルが既に存在している

**解決方法**:
- 既存のテーブルを削除してから再実行
- または、`CREATE TABLE IF NOT EXISTS` を使用しているので、このエラーは通常無視できます

### エラー: "permission denied"

**原因**: 権限の問題

**解決方法**:
- Supabaseのプロジェクトオーナーで実行しているか確認
- プロジェクトの設定を確認

### エラー: "extension does not exist"

**原因**: UUID拡張機能が有効になっていない

**解決方法**:
- SQL Editorで以下を実行：
  ```sql
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  ```
- その後、`schema.sql`を再実行

## 確認方法

スキーマが正しく作成されたか確認：

1. **Supabaseダッシュボードで確認**
   - 左サイドバーで「Database」→「Tables」をクリック
   - 以下のテーブルが表示されれば成功：
     - `profiles`
     - `groups`
     - `group_members`
     - `timelines`
     - `timeline_events`
     - `timeline_items`

2. **アプリケーションで確認**
   - ブラウザで `http://localhost:3000` にアクセス
   - タイムテーブルを作成してみる
   - エラーが表示されなければ成功

## 手順のまとめ

1. Supabaseダッシュボードを開く
2. 「SQL Editor」を開く
3. 「New query」をクリック
4. `docs/schema.sql` の内容をコピー＆ペースト
5. 「Run」ボタンをクリック
6. 「Success」と表示されれば完了

## 注意事項

- スキーマは一度実行すればOKです（再実行する必要はありません）
- 既存のデータがある場合は、スキーマを再実行するとデータが削除される可能性があります
- 本番環境では、必ずバックアップを取ってから実行してください


