# Vercel環境変数の設定方法（緊急対応）

## 🚨 現在の問題

Googleログインでエラーが発生しています：
**「SupabaseのURLが設定されていません」**

これは、Vercelで環境変数が設定されていないことが原因です。

## ✅ 解決方法（5分で完了）

### Step 1: Supabaseの情報を取得

1. [Supabaseダッシュボード](https://supabase.com/dashboard)にアクセス
2. プロジェクトを選択
3. **「Settings」（⚙️）→「API」**を開く
4. 以下をコピー：
   - **Project URL**（例: `https://xxxxx.supabase.co`）
   - **anon public key**（`eyJ...`で始まる長い文字列）

### Step 2: Vercelで環境変数を設定

1. **Vercelダッシュボードにアクセス**
   - [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. **プロジェクトを選択**
   - `timetable-app-292x` または関連するプロジェクト

3. **「Settings」タブをクリック**

4. **「Environment Variables」をクリック**

5. **以下の3つの環境変数を追加**：

   #### 環境変数1: `NEXT_PUBLIC_SUPABASE_URL`
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: SupabaseのProject URL（例: `https://xxxxx.supabase.co`）
   - **Environment**: 
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
     - **すべてにチェックを入れる**

   #### 環境変数2: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Supabaseのanon public key（`eyJ...`で始まる）
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - **すべてにチェックを入れる**

   #### 環境変数3: `NEXT_PUBLIC_SITE_URL`
   - **Key**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: デプロイされたURL（例: `https://timetable-app-292x.vercel.app`）
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - **すべてにチェックを入れる**

6. **各環境変数を追加後、「Save」をクリック**

### Step 3: 再デプロイ

1. **「Deployments」タブをクリック**
2. **最新のデプロイの「...」メニューをクリック**
3. **「Redeploy」を選択**
4. **「Redeploy」ボタンをクリック**

### Step 4: 動作確認

1. **デプロイが完了するまで待機**（1-2分）
2. **デプロイされたURLにアクセス**
3. **「Googleでログイン」ボタンをクリック**
4. **Googleアカウントの選択画面が表示されれば成功！** ✅

## 📸 スクリーンショット付き手順

### Vercelでの環境変数設定画面

1. **Settings → Environment Variables** を開く
2. **「Add New」または「+」ボタンをクリック**
3. **KeyとValueを入力**
4. **Environmentにチェックを入れる**
5. **「Save」をクリック**

## ⚠️ 重要な注意事項

- **環境変数の値に余分なスペースを入れない**
- **引用符（`"`や`'`）で囲まない**
- **3つの環境変数すべてを設定する**
- **すべての環境（Production, Preview, Development）にチェックを入れる**
- **環境変数を追加した後、必ず「Redeploy」を実行する**

## 🔍 確認方法

環境変数が正しく設定されているか確認：

1. Vercelダッシュボード → Settings → Environment Variables
2. 3つの環境変数が表示されているか確認
3. 各環境変数のValueが正しいか確認

## 🆘 まだエラーが出る場合

1. **環境変数が正しく設定されているか再確認**
2. **「Redeploy」を実行したか確認**
3. **ブラウザのキャッシュをクリア**（Ctrl+Shift+R または Cmd+Shift+R）
4. **シークレットモードで試す**

## 📝 チェックリスト

- [ ] SupabaseのProject URLを取得した
- [ ] Supabaseのanon public keyを取得した
- [ ] Vercelで`NEXT_PUBLIC_SUPABASE_URL`を設定した
- [ ] Vercelで`NEXT_PUBLIC_SUPABASE_ANON_KEY`を設定した
- [ ] Vercelで`NEXT_PUBLIC_SITE_URL`を設定した
- [ ] すべての環境（Production, Preview, Development）にチェックを入れた
- [ ] 「Redeploy」を実行した
- [ ] デプロイが完了した
- [ ] Googleログインが動作する

## 🎉 完了！

環境変数を設定して再デプロイすれば、Googleログインが動作するはずです！

問題が解決しない場合は、エラーメッセージを共有してください。
