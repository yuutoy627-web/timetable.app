'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { fixExistingUsers } from '@/lib/actions/admin'
import { AlertCircle, CheckCircle2, Loader2, Database, FileText, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

const SQL_FUNCTION_CONTENT = `-- 既存のユーザーに対してプロフィールを作成するPostgreSQL関数
-- この関数は、トリガーが作成される前にログインしたユーザーに対してプロフィールを作成します
-- 
-- 使用方法:
-- 1. SupabaseダッシュボードのSQL EditorでこのSQLを実行
-- 2. アプリケーションの管理ページから実行可能になります

CREATE OR REPLACE FUNCTION public.fix_existing_users_profiles()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  created_count INTEGER;
BEGIN
  -- 既存のauth.usersにプロフィールが存在しないユーザーに対してプロフィールを作成
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email, 'User'),
    u.raw_user_meta_data->>'avatar_url'
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  WHERE p.id IS NULL
  ON CONFLICT (id) DO NOTHING;
  
  GET DIAGNOSTICS created_count = ROW_COUNT;
  RETURN created_count;
END;
$$;

-- 関数の実行権限を付与
GRANT EXECUTE ON FUNCTION public.fix_existing_users_profiles() TO authenticated;`

export function AdminContent() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    created?: number
  } | null>(null)
  const [showSqlContent, setShowSqlContent] = useState(false)
  const [sqlCopied, setSqlCopied] = useState(false)

  const handleFixExistingUsers = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const response = await fixExistingUsers()
      setResult(response)
    } catch (error) {
      setResult({
        success: false,
        error: `予期しないエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
        created: 0
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SQL_FUNCTION_CONTENT)
      setSqlCopied(true)
      setTimeout(() => setSqlCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* 既存ユーザーのプロフィール作成 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>既存ユーザーのプロフィール作成</CardTitle>
          </div>
          <CardDescription>
            トリガーが作成される前にログインしたユーザーに対してプロフィールを作成します。
            <br />
            <span className="text-xs text-muted-foreground mt-2 block">
              注意: この機能を使用するには、データベースに fix_existing_users_profiles 関数を作成する必要があります。
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium mb-1">セットアップ手順:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>SupabaseダッシュボードのSQL Editorを開く</li>
                  <li>docs/fix_existing_users_function.sql の内容をコピー</li>
                  <li>SQL Editorに貼り付けて実行</li>
                  <li>このページから実行ボタンをクリック</li>
                </ol>
              </div>
            </div>
          </div>

          <Button
            onClick={handleFixExistingUsers}
            disabled={isRunning}
            className="w-full sm:w-auto"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                実行中...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                実行
              </>
            )}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.success
                  ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  {result.success ? (
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-100">
                        {result.message || '成功しました'}
                      </p>
                      {result.created !== undefined && (
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          作成されたプロフィール数: {result.created}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-100">
                        エラーが発生しました
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {result.error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SQLファイルの参照 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SQLファイル</CardTitle>
              <CardDescription>
                データベース関数の作成に使用するSQLファイル
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopySql}
                disabled={sqlCopied}
              >
                {sqlCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    コピーしました
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    コピー
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSqlContent(!showSqlContent)}
              >
                {showSqlContent ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    閉じる
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    開く
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showSqlContent && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-mono">docs/fix_existing_users_function.sql</span>
              </div>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  <code>{SQL_FUNCTION_CONTENT}</code>
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                このSQLをSupabaseのSQL Editorに貼り付けて実行すると、データベース関数が作成されます。
              </p>
            </div>
          </CardContent>
        )}
        {!showSqlContent && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">docs/fix_existing_users_function.sql</span>
              </div>
              <p className="text-sm text-muted-foreground">
                このファイルをSupabaseのSQL Editorで実行すると、データベース関数が作成されます。
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}










