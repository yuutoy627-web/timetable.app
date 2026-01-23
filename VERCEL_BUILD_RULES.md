# Vercelデプロイ優先ルール

## 基本方針

このプロジェクトでは、「型の厳密さ」よりも「Vercelでのビルド成功（`npm run build`が通ること）」を最優先します。

## 設定内容

### 1. TypeScript設定 (`tsconfig.json`)

- `strict: false` - 厳密な型チェックを無効化
- `noImplicitAny: false` - 暗黙的なany型を許可
- `noUnusedLocals: false` - 未使用変数のエラーを無効化
- `noUnusedParameters: false` - 未使用パラメータのエラーを無効化

これにより、型エラーでビルドが失敗することを防ぎます。

### 2. Next.js設定 (`next.config.js`)

- `typescript.ignoreBuildErrors: true` - 型エラーがあってもビルドを続行
- `eslint.ignoreDuringBuilds: true` - ESLintエラーがあってもビルドを続行

### 3. ESLint設定 (`.eslintrc.json`)

- `@typescript-eslint/no-explicit-any: "off"` - any型の使用を許可
- `@typescript-eslint/no-unused-vars: "off"` - 未使用変数の警告を無効化
- `@typescript-eslint/ban-ts-comment: "off"` - ts-ignoreコメントを許可

## コーディングガイドライン

### 型エラーが発生した場合

1. **まず `any` 型を使用**
   ```typescript
   // ❌ 型エラーでビルドが失敗する
   const data: SomeComplexType = response;
   
   // ✅ ビルドが通る
   const data: any = response;
   ```

2. **`as any` キャストを使用**
   ```typescript
   // ❌ 型エラー
   const result = someFunction(value);
   
   // ✅ ビルドが通る
   const result = someFunction(value as any);
   ```

3. **`@ts-ignore` または `@ts-expect-error` を使用**
   ```typescript
   // @ts-ignore
   const result = problematicCode();
   ```

### Vercel Edge Runtime/Server Actions の制約

- Node.js専用モジュール（`fs`, `path`など）は使用しない
- ブラウザAPI（`window`, `document`など）はクライアントコンポーネントでのみ使用
- 大きな依存関係は避ける（バンドルサイズを考慮）

### ビルドエラーを避けるためのベストプラクティス

1. **未使用の変数・インポート**
   - 削除するか、`_`プレフィックスを付ける
   ```typescript
   const _unused = someValue; // 未使用でもエラーにならない
   ```

2. **型定義が複雑な場合**
   - シンプルな型や`any`を使用
   ```typescript
   // 複雑な型定義でエラーが出る場合
   type ComplexType = { ... };
   
   // シンプルに
   type SimpleType = any;
   ```

3. **外部ライブラリの型定義がない場合**
   - `any`型で対応
   ```typescript
   // @ts-ignore
   import SomeLibrary from 'some-library';
   const lib: any = SomeLibrary;
   ```

## ビルド確認

ローカルでビルドを確認：

```bash
npm run build
```

エラーが出ても、Vercelではビルドが成功するはずです（設定により型エラーは無視されます）。

## 注意事項

- この設定は「動く」「デプロイできる」ことを優先します
- 型安全性は犠牲になりますが、Vercelでのデプロイが確実に成功します
- 本番環境で動作確認を必ず行ってください
