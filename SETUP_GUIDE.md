# Universal Timeline Maker - セットアップガイド

このガイドでは、プロジェクトをセットアップして実際に動作を確認するまでの手順を詳しく説明します。

## 📋 前提条件

- Node.js 18以上がインストールされていること
- npm、yarn、またはpnpmが利用可能であること
- ターミナル（コマンドライン）が使用できること

### Node.jsのバージョン確認

ターミナルで以下を実行して、Node.jsがインストールされているか確認：

```bash
node --version
```

**期待される出力**: `v18.x.x` 以上

もしインストールされていない場合：
- [Node.js公式サイト](https://nodejs.org/ja/) からダウンロード
- 「推奨版（LTS）」を選択してダウンロード
- インストーラーを実行（デフォルト設定でOK）

---

## 🚀 セットアップ手順

### Step 1: プロジェクトディレクトリに移動

ターミナルを開いて、プロジェクトディレクトリに移動します：

```bash
cd /Users/sentinel/Documents/baibko-dhingu
```

**確認方法**: `pwd` コマンドで現在のディレクトリを確認できます

---

### Step 2: Next.jsプロジェクトの初期化

#### 2-1. 初期化コマンドの実行

以下のコマンドを実行します：

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

**説明**:
- `npx create-next-app@latest`: Next.jsの最新版を使用
- `.`: 現在のディレクトリに作成
- `--typescript`: TypeScriptを有効化
- `--tailwind`: Tailwind CSSを有効化
- `--app`: App Routerを使用
- `--no-src-dir`: srcディレクトリを作成しない
- `--import-alias "@/*"`: `@/` エイリアスを設定
- `--yes`: すべての質問に自動で「はい」と回答

**実行時間**: 1〜3分程度

**注意**: 既存のファイルがある場合、上書き確認が出る可能性があります。その場合は `y` を入力してEnter

#### 2-2. 初期化の確認

以下のファイルが作成されているか確認：

```bash
ls -la
```

**期待されるファイル**:
- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `next.config.js`
- `app/` ディレクトリ（既存のものと統合される）

---

### Step 3: 必要なパッケージのインストール

#### 3-1. React Hook FormとZodのインストール

```bash
npm install react-hook-form zod @hookform/resolvers
```

**説明**:
- `react-hook-form`: フォーム管理ライブラリ
- `zod`: バリデーションライブラリ
- `@hookform/resolvers`: React Hook FormとZodを連携

#### 3-2. ユーティリティライブラリのインストール

```bash
npm install clsx tailwind-merge
```

**説明**:
- `clsx`: クラス名の条件付き結合
- `tailwind-merge`: Tailwindクラスのマージ

#### 3-3. アイコンライブラリのインストール

```bash
npm install lucide-react
```

**説明**: Lucide React - アイコンライブラリ

#### 3-4. 型定義のインストール（開発用）

```bash
npm install -D @types/node @types/react @types/react-dom
```

**説明**: TypeScriptの型定義ファイル

#### 3-5. インストール確認

```bash
npm list --depth=0
```

**期待されるパッケージ**:
- react-hook-form
- zod
- @hookform/resolvers
- clsx
- tailwind-merge
- lucide-react

---

### Step 4: Shadcn UIのセットアップ

#### 4-1. Shadcn UIの初期化

```bash
npx shadcn@latest init
```

**注意**: `shadcn-ui`パッケージは非推奨です。必ず`shadcn`を使用してください。

**対話的な質問と回答**:

1. **Which style would you like to use?**
   - デフォルトを選択（Enterキーを押す）

2. **Which color would you like to use as base color?**
   - `slate` を選択（デフォルトでOK、Enterキーを押す）

3. **Where is your global CSS file?**
   - `app/globals.css` と表示されているはず（Enterキーを押す）

4. **Would you like to use CSS variables for colors?**
   - `yes` を選択（`y` と入力してEnter）

5. **Are you using a custom tailwind prefix?**
   - `no` を選択（Enterキーを押す）

6. **Where is your tailwind.config.js located?**
   - `tailwind.config.ts` と表示されているはず（Enterキーを押す）

7. **Configure the import alias for components?**
   - `@/components` と表示されているはず（Enterキーを押す）

8. **Configure the import alias for utils?**
   - `@/lib/utils` と表示されているはず（Enterキーを押す）

**完了メッセージ**: `✅ Done!` と表示されれば成功

#### 4-2. 必要なShadcn UIコンポーネントの追加

以下のコマンドを**順番に**実行します：

```bash
npx shadcn@latest add button
```

**確認メッセージ**: `✅ Added: components/ui/button.tsx`

```bash
npx shadcn@latest add card
```

**確認メッセージ**: `✅ Added: components/ui/card.tsx`

```bash
npx shadcn@latest add form
```

**確認メッセージ**: `✅ Added: components/ui/form.tsx`

```bash
npx shadcn@latest add input
```

**確認メッセージ**: `✅ Added: components/ui/input.tsx`

```bash
npx shadcn@latest add select
```

**確認メッセージ**: `✅ Added: components/ui/select.tsx`

**注意**: 各コマンド実行時に、Radix UIなどの依存パッケージが自動的にインストールされます

---

### Step 5: プロジェクト構造の確認

以下のディレクトリ構造になっているか確認：

```bash
tree -L 3 -I 'node_modules'
```

**期待される構造**:
```
baibko-dhingu/
├── app/
│   ├── page.tsx          ✅ 既に作成済み
│   ├── layout.tsx        ✅ 既に作成済み
│   └── globals.css       ✅ 既に作成済み
├── components/
│   ├── timeline-wizard/  ✅ 既に作成済み
│   │   ├── timeline-wizard.tsx
│   │   ├── step-1-genre-selection.tsx
│   │   └── step-2-basic-info.tsx
│   └── ui/               ✅ Shadcn UIコンポーネント
│       ├── button.tsx
│       ├── card.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── textarea.tsx  ✅ 既に作成済み
│       └── progress.tsx  ✅ 既に作成済み
├── lib/
│   ├── hooks/            ✅ 既に作成済み
│   ├── schemas/          ✅ 既に作成済み
│   └── utils.ts          ✅ 既に作成済み
└── types/                ✅ 既に作成済み
```

---

### Step 6: 開発サーバーの起動

#### 6-1. サーバー起動

```bash
npm run dev
```

**期待される出力**:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.XXs
```

**注意**: 初回起動時は少し時間がかかります（30秒〜1分程度）

#### 6-2. ブラウザで確認

1. ブラウザを開く（Chrome、Firefox、Safariなど）
2. アドレスバーに以下を入力：
   ```
   http://localhost:3000
   ```
3. Enterキーを押す

**期待される表示**:
- 「Universal Timeline Maker」というタイトル
- 「タイムテーブルと持ち物リストを一元管理」という説明
- ウィザード形式のUI（カード形式のジャンル選択画面）

---

### Step 7: 動作確認

#### 7-1. Step 1: ジャンル選択の確認

1. **画面の確認**:
   - プログレスバーが表示されている（0%）
   - 「ステップ 1 / 4」と表示されている
   - 5つのジャンルカードが表示されている：
     - 音響(PA) - 紫色
     - 会議 - 青色
     - 旅行 - 緑色
     - ライフプラン - オレンジ色
     - その他 - グレー

2. **ジャンル選択のテスト**:
   - 「音響(PA)」のカードを**クリック**
   - カードが選択状態になる（リングが表示される）
   - 「次へ進む」ボタンが表示される
   - 「次へ進む」ボタンを**クリック**

#### 7-2. Step 2: 基本情報入力の確認

1. **画面遷移の確認**:
   - プログレスバーが約33%になる
   - 「ステップ 2 / 4」と表示される
   - フォームが表示される

2. **音響(PA)用のフォーム項目確認**:
   - タイトル *（必須）
   - 説明
   - 開始日時 *（必須）
   - 終了日時 *（必須）
   - 会場名 *（必須）
   - 会場住所
   - 搬入時間 *（必須）
   - リハーサル開始時間 *（必須）
   - 本番開始時間 *（必須）
   - 搬出時間
   - 担当者名
   - 連絡先電話番号
   - 備考

3. **フォーム入力のテスト**:
   - 「タイトル」に「テストライブ」と入力
   - 「開始日時」を選択（カレンダーアイコンをクリック）
   - 「終了日時」を選択
   - 「会場名」に「テストホール」と入力
   - 「搬入時間」を選択
   - 「リハーサル開始時間」を選択
   - 「本番開始時間」を選択
   - 「次へ進む」ボタンを**クリック**

4. **バリデーションの確認**:
   - 必須項目を空のまま「次へ進む」をクリック
   - エラーメッセージが表示されることを確認

5. **戻るボタンのテスト**:
   - 「戻る」ボタンを**クリック**
   - Step 1に戻ることを確認
   - 再度「音響(PA)」を選択してStep 2に進む

#### 7-3. 他のジャンルの確認

1. **会議ジャンルの確認**:
   - Step 1に戻る（「戻る」ボタン）
   - 「会議」カードを**クリック**
   - 「次へ進む」を**クリック**
   - 会議用のフォーム項目が表示されることを確認：
     - 会議室名
     - 建物名
     - 階数
     - 定員
     - 担当者名
     - 連絡先メールアドレス

2. **旅行ジャンルの確認**:
   - 同様に「旅行」を選択
   - 旅行用のフォーム項目が表示されることを確認：
     - 目的地
     - 宿泊情報（施設名、住所、チェックイン/アウト）
     - 交通手段（出発/帰着）

---

## 🔧 トラブルシューティング

### エラー: "Cannot find module '@/components/ui/button'"

**原因**: Shadcn UIコンポーネントがインストールされていない

**解決方法**:
```bash
npx shadcn@latest add button card form input select
```

**注意**: `shadcn-ui`ではなく`shadcn`を使用してください。

### エラー: "Module not found: Can't resolve 'react-hook-form'"

**原因**: 必要なパッケージがインストールされていない

**解決方法**:
```bash
npm install react-hook-form zod @hookform/resolvers clsx tailwind-merge lucide-react
```

### エラー: "Port 3000 is already in use"

**原因**: 既に別のプロセスがポート3000を使用している

**解決方法1**: 既存のプロセスを停止
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**解決方法2**: 別のポートを使用
```bash
npm run dev -- -p 3001
```
その後、`http://localhost:3001` にアクセス

### エラー: "Type error: Property 'genre' does not exist"

**原因**: TypeScriptの型定義が正しく読み込まれていない

**解決方法**: 開発サーバーを再起動
```bash
# Ctrl + C で停止
npm run dev
```

### 画面が真っ白になる

**原因**: コンポーネントのインポートエラー

**解決方法**:
1. ターミナルでエラーメッセージを確認
2. ブラウザの開発者ツール（F12）でコンソールエラーを確認
3. 不足しているコンポーネントをインストール

---

## 📝 次のステップ

現在実装済み:
- ✅ Step 1: ジャンル選択
- ✅ Step 2: 基本情報入力

実装予定:
- ⏳ Step 3: イベント追加
- ⏳ Step 4: 確認と保存（Supabaseへの保存）

---

## 🆘 サポート

問題が解決しない場合:
1. ターミナルのエラーメッセージを確認
2. ブラウザの開発者ツール（F12）でコンソールエラーを確認
3. `package.json` の依存関係を確認

---

## 📚 参考リンク

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Shadcn UI公式サイト](https://ui.shadcn.com/)
- [React Hook Form公式ドキュメント](https://react-hook-form.com/)
- [Zod公式ドキュメント](https://zod.dev/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)

