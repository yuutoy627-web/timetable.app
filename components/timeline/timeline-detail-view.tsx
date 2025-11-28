'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TimelineWithRelations, TimelineGenre } from '@/types/supabase'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ArrowLeft, Calendar, MapPin, Package } from 'lucide-react'
import Link from 'next/link'
import { ShareButton } from './share-button'
import { toggleTimelinePublic } from '@/lib/actions/timeline'
import { useRouter } from 'next/navigation'
import { CalendarView } from './calendar-view'

const genreLabels: Record<TimelineGenre, string> = {
  pa: '音響(PA)',
  meeting: '会議',
  travel: '旅行',
  life_plan: 'ライフプラン',
  other: 'その他',
}

const genreColors: Record<TimelineGenre, string> = {
  pa: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  meeting: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  travel: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  life_plan: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  other: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800',
}

interface TimelineDetailViewProps {
  timeline: TimelineWithRelations
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  } | null
}

export function TimelineDetailView({ timeline, user }: TimelineDetailViewProps) {
  const router = useRouter()
  const isOwner = user && user.id === timeline.created_by

  const handleTogglePublic = async (isPublic: boolean) => {
    const { error } = await toggleTimelinePublic(timeline.id, isPublic)
    if (!error) {
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <Link href={user ? '/dashboard' : '/'}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {user ? 'ダッシュボードに戻る' : 'ホームに戻る'}
          </Button>
        </Link>
        {isOwner && (
          <ShareButton
            timelineId={timeline.id}
            isPublic={timeline.is_public}
            onTogglePublic={handleTogglePublic}
          />
        )}
      </div>

      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{timeline.title}</CardTitle>
              {timeline.description && (
                <p className="text-muted-foreground">{timeline.description}</p>
              )}
            </div>
            <Badge className={genreColors[timeline.genre]}>
              {genreLabels[timeline.genre]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeline.start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">開始日時</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(timeline.start_date), 'yyyy年MM月dd日 HH:mm', {
                      locale: ja,
                    })}
                  </div>
                </div>
              </div>
            )}
            {timeline.end_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">終了日時</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(timeline.end_date), 'yyyy年MM月dd日 HH:mm', {
                      locale: ja,
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* タイムライン（イベント） - カレンダー形式 */}
      {timeline.events && timeline.events.length > 0 && timeline.start_date && timeline.end_date && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              タイムライン
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarView
              events={timeline.events}
              startDate={timeline.start_date}
              endDate={timeline.end_date}
            />
          </CardContent>
        </Card>
      )}

      {/* リソース管理（カスタムフィールド） */}
      {timeline.metadata && typeof timeline.metadata === 'object' && (timeline.metadata as any).customFields && Array.isArray((timeline.metadata as any).customFields) && (timeline.metadata as any).customFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              📋 リソース管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(timeline.metadata as any).customFields.map((field: any) => {
                // 見出しの場合
                if (field.type === 'header') {
                  return (
                    <div key={field.id} className="font-bold text-base py-2 px-4 bg-gray-100 rounded-lg border-2 border-gray-300">
                      {field.label || '（見出し未設定）'}
                    </div>
                  )
                }
                
                // 通常フィールドの場合
                if (!field.label) return null
                
                // ステータスの表示
                const getStatusDisplay = () => {
                  switch (field.status) {
                    case 'acquired':
                      return { emoji: '🟢', text: '準備OK', color: 'text-green-600 bg-green-50' }
                    case 'confirmed':
                      return { emoji: '🟡', text: '手配中', color: 'text-yellow-600 bg-yellow-50' }
                    case 'pending':
                    default:
                      return { emoji: '🔴', text: '未確認', color: 'text-red-600 bg-red-50' }
                  }
                }
                const statusDisplay = getStatusDisplay()
                
                // 値の表示
                let valueDisplay = '（未入力）'
                if (field.value) {
                  if (field.type === 'datetime') {
                    valueDisplay = format(new Date(field.value), 'yyyy年MM月dd日 HH:mm', { locale: ja })
                  } else if (field.type === 'number' && field.unit) {
                    valueDisplay = `[${field.value}${field.unit}]`
                  } else if (field.type === 'boolean') {
                    valueDisplay = field.value === 'true' ? 'あり' : 'なし'
                  } else if (field.type === 'link') {
                    valueDisplay = field.value
                  } else if (field.type === 'file') {
                    valueDisplay = field.value
                  } else {
                    valueDisplay = field.value
                  }
                }
                
                return (
                  <div key={field.id} className="flex items-start gap-3 pl-4 border-l-4 border-primary/30 py-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{field.label}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {valueDisplay !== '（未入力）' && (
                          <span className="text-sm text-muted-foreground bg-gray-50 px-2 py-1 rounded">
                            {valueDisplay}
                          </span>
                        )}
                        {field.status && (
                          <span className={`text-xs font-medium px-2 py-1 rounded border ${statusDisplay.color}`}>
                            {statusDisplay.emoji} {statusDisplay.text}
                          </span>
                        )}
                        {field.assignee && (
                          <span className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded">
                            担当: {field.assignee}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 持ち物リスト */}
      {timeline.items && timeline.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              持ち物リスト
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timeline.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {item.quantity > 1 && (
                        <span className="text-sm text-muted-foreground">
                          × {item.quantity}
                          {item.unit && ` ${item.unit}`}
                        </span>
                      )}
                      {item.is_required && (
                        <Badge variant="destructive" className="text-xs">
                          必須
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    )}
                    {item.category && (
                      <div className="text-xs text-muted-foreground mt-1">
                        カテゴリ: {item.category}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

