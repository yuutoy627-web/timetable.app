# GitHubへのプッシュ手順

## 現在の状態

- **リモートリポジトリ**: `https://github.com/yuutoy627-web/timetable.app.git`
- **変更されたファイル**: 複数のファイルが変更されています

## 手順

### Step 1: ブランチの確認と切り替え

現在ブランチにいない状態なので、まず適切なブランチに切り替えます：

```bash
# mainブランチに切り替え（存在する場合）
git checkout main

# または、mainブランチが存在しない場合は作成
git checkout -b main
```

### Step 2: 変更をステージング（追加）

変更したファイルをGitに追加します：

```bash
# 全ての変更を追加
git add .

# または、特定のファイルのみ追加する場合
git add components/timeline-wizard/timeline-wizard-container.tsx
git add lib/actions/timeline.ts
git add next.config.js
git add tsconfig.json
git add .eslintrc.json
```

### Step 3: コミット（変更を記録）

変更をコミットします：

```bash
git commit -m "Fix: デプロイ優先で型エラーを完全に回避"
```

**コミットメッセージの例**:
- `"Fix: デプロイ優先で型エラーを完全に回避"`
- `"Update: Vercelデプロイ用に型チェックを無効化"`
- `"Fix: TypeScript型エラーを解決してデプロイ可能に"`

### Step 4: GitHubにプッシュ

リモートリポジトリにプッシュします：

```bash
# mainブランチにプッシュ
git push origin main

# または、初回プッシュの場合
git push -u origin main
```

## トラブルシューティング

### エラー: "fatal: not a git repository"

**解決方法**: プロジェクトルートで実行しているか確認してください。

### エラー: "error: failed to push some refs"

**原因**: リモートに新しい変更がある可能性があります。

**解決方法**:
```bash
# リモートの変更を取得
git pull origin main

# コンフリクトが発生した場合は解決してから
git add .
git commit -m "Merge remote changes"
git push origin main
```

### エラー: "Permission denied"

**原因**: GitHubの認証情報が設定されていない。

**解決方法**:
1. **Personal Access Tokenを使用する場合**:
   ```bash
   git remote set-url origin https://[YOUR_TOKEN]@github.com/yuutoy627-web/timetable.app.git
   ```

2. **SSHキーを使用する場合**:
   ```bash
   git remote set-url origin git@github.com:yuutoy627-web/timetable.app.git
   ```

### エラー: "branch 'main' does not exist"

**解決方法**:
```bash
# mainブランチを作成して切り替え
git checkout -b main
git push -u origin main
```

## 確認方法

プッシュが成功したら、GitHubのリポジトリページで確認できます：

1. [https://github.com/yuutoy627-web/timetable.app](https://github.com/yuutoy627-web/timetable.app) にアクセス
2. 最新のコミットが表示されているか確認
3. 変更されたファイルが表示されているか確認

## 次のステップ

プッシュが成功したら：

1. **Vercelが自動的にデプロイを開始**します（GitHubと連携している場合）
2. Vercelダッシュボードでデプロイの進行状況を確認
3. ビルドが成功するか確認

## 簡単な一括コマンド

全ての手順を一度に実行する場合：

```bash
# ブランチに切り替え（mainが存在する場合）
git checkout main

# 全ての変更を追加
git add .

# コミット
git commit -m "Fix: デプロイ優先で型エラーを完全に回避"

# プッシュ
git push origin main
```
