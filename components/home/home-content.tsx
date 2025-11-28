'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signInWithGoogle } from '@/lib/actions/auth'
import { Calendar, Users, Package, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface HomeContentProps {
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  } | null
}

export function HomeContent({ user }: HomeContentProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await signInWithGoogle()
      if (error) {
        console.error('Sign in error:', error)
      } else if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-lg mb-6">
            ようこそ、{user.user_metadata?.full_name || user.email}さん
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">ダッシュボードへ</Button>
            </Link>
            <Link href="/timelines/new">
              <Button size="lg" variant="outline">
                新規作成
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>タイムテーブル管理</CardTitle>
              <CardDescription>
                音響、会議、旅行など、あらゆるシーンのタイムテーブルを作成・管理
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>持ち物リスト</CardTitle>
              <CardDescription>
                必要な機材や持ち物を自動でリストアップ
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>グループ共有</CardTitle>
              <CardDescription>
                チームメンバーとタイムテーブルを共有・編集
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Share2 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>ジャンル別整理</CardTitle>
              <CardDescription>
                作成したタイムテーブルをジャンル別に整理して管理
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-lg mb-6">
          タイムテーブルと持ち物リストを一元管理できるツールです
        </p>
        <Button onClick={handleSignIn} size="lg" disabled={isLoading}>
          {isLoading ? '読み込み中...' : 'Googleでログインして始める'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        <Card>
          <CardHeader>
            <Calendar className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>タイムテーブル管理</CardTitle>
            <CardDescription>
              音響、会議、旅行など、あらゆるシーンのタイムテーブルを作成・管理
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Package className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>持ち物リスト</CardTitle>
            <CardDescription>
              必要な機材や持ち物を自動でリストアップ
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>グループ共有</CardTitle>
            <CardDescription>
              チームメンバーとタイムテーブルを共有・編集
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Share2 className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>ジャンル別整理</CardTitle>
            <CardDescription>
              作成したタイムテーブルをジャンル別に整理して管理
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}


