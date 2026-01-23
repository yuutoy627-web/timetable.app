'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function signInWithGoogle() {
  // 環境変数の検証
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // 末尾のスラッシュを削除
  siteUrl = siteUrl.replace(/\/$/, '')

  // デバッグ用ログ（本番環境でも確認可能）
  console.log('Environment variables check:', {
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseAnonKey: !!supabaseAnonKey,
    hasSiteUrl: !!siteUrl,
    siteUrl: siteUrl,
  })

  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not set')
    return { 
      error: 'SupabaseのURLが設定されていません。Vercelダッシュボードの「Settings」→「Environment Variables」でNEXT_PUBLIC_SUPABASE_URLを設定し、再デプロイを実行してください。' 
    }
  }

  if (!supabaseAnonKey) {
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
    return { 
      error: 'Supabaseのキーが設定されていません。Vercelダッシュボードの「Settings」→「Environment Variables」でNEXT_PUBLIC_SUPABASE_ANON_KEYを設定し、再デプロイを実行してください。' 
    }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    })

    if (error) {
      console.error('OAuth error:', error)
      return { error: error.message }
    }

    if (!data?.url) {
      console.error('No URL returned from OAuth')
      return { 
        error: '認証URLの取得に失敗しました。Supabaseの設定を確認してください。' 
      }
    }

    // デバッグ用ログ（本番環境では削除推奨）
    console.log('OAuth redirect URL:', data.url)

    return { data }
  } catch (error) {
    console.error('Sign in error:', error)
    return { 
      error: error instanceof Error ? error.message : '認証中にエラーが発生しました。' 
    }
  }
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getUser() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error('Get user error:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

