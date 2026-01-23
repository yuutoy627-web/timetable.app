'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * 既存のユーザーに対してプロフィールを作成する
 * この関数は、トリガーが作成される前にログインしたユーザーに対してプロフィールを作成します
 * 
 * 注意: この機能を使用するには、データベースに fix_existing_users_profiles 関数を作成する必要があります。
 * docs/fix_existing_users_function.sql をSupabaseのSQL Editorで実行してください。
 */
export async function fixExistingUsers() {
  const supabase = await createClient()

  // ユーザー認証確認
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: '認証が必要です' }
  }

  try {
    // PostgreSQL関数を呼び出して既存ユーザーのプロフィールを作成
    const { data, error } = await supabase.rpc('fix_existing_users_profiles')

    if (error) {
      // 関数が存在しない場合のエラーメッセージ
      if (error.code === '42883' || error.message.includes('function') || error.message.includes('does not exist')) {
        return { 
          error: 'データベース関数が存在しません。docs/fix_existing_users_function.sql をSupabaseのSQL Editorで実行してください。',
          created: 0
        }
      }
      
      return { 
        error: `エラーが発生しました: ${error.message}`,
        created: 0
      }
    }

    return { 
      success: true, 
      message: `既存ユーザーのプロフィールを ${data || 0} 件作成しました`,
      created: data || 0
    }
  } catch (error) {
    console.error('Fix existing users error:', error)
    return { 
      error: `予期しないエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      created: 0
    }
  }
}
