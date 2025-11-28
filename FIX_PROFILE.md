# プロフィール作成エラーの修正方法

## エラーについて

「insert or update on table "timelines" violates foreign key constraint "timelines_created_by_fkey"」というエラーは、`profiles`テーブルにユーザーのレコードが存在しないことを示しています。

## 解決方法

### 方法1: 既存ユーザーに対してプロフィールを作成（推奨）

1. Supabaseダッシュボードで「SQL Editor」を開く
2. 「New query」をクリック
3. `docs/fix_existing_users.sql` の内容をコピー
4. SQL Editorに貼り付けて実行

このSQLは、既存の`auth.users`にプロフィールが存在しないユーザーに対してプロフィールを自動作成します。

### 方法2: アプリケーション側で自動修正（既に実装済み）

アプリケーション側で、タイムテーブルを作成する際にプロフィールが存在しない場合は自動的に作成する処理を追加しました。

## 確認方法

1. Supabaseダッシュボードで「Database」→「Tables」→「profiles」を開く
2. ログインしているユーザーのIDが表示されているか確認
3. アプリケーションでタイムテーブルを作成してみる
4. エラーが表示されなければ成功です

## 今後の対策

新しいユーザーがログインした際には、`handle_new_user()`トリガーが自動的にプロフィールを作成します。

既存のユーザーに対しては、上記のSQLを実行してください。


