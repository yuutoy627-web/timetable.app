'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { TimelineGenre } from '@/types/supabase'
import { BasicInfoFormData } from '@/lib/schemas/timeline'
import { Loader2 } from 'lucide-react'

interface Event {
  id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
}

interface Item {
  id: string
  name: string
  description?: string
  quantity: number
  unit?: string
  category?: string
  is_required: boolean
}

interface Step4PreviewProps {
  genre: TimelineGenre
  basicInfo: BasicInfoFormData
  events: Event[]
  items: Item[]
  onBack: () => void
  onSave: () => Promise<void>
  isSaving: boolean
}

const genreLabels: Record<TimelineGenre, string> = {
  pa: '音響(PA)',
  meeting: '会議',
  travel: '旅行',
  life_plan: 'ライフプラン',
  other: 'その他',
}

export function Step4Preview({
  genre,
  basicInfo,
  events,
  items,
  onBack,
  onSave,
  isSaving,
}: Step4PreviewProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">確認と保存</h2>
        <p className="text-muted-foreground">
          内容を確認して保存してください
        </p>
      </div>

      <div className="space-y-6">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">ジャンル:</span>{' '}
              {genreLabels[genre]}
            </div>
            <div>
              <span className="font-medium">タイトル:</span> {basicInfo.title}
            </div>
            {basicInfo.description && (
              <div>
                <span className="font-medium">説明:</span>{' '}
                {basicInfo.description}
              </div>
            )}
            <div>
              <span className="font-medium">開始日時:</span>{' '}
              {basicInfo.start_date
                ? format(new Date(basicInfo.start_date), 'yyyy年MM月dd日 HH:mm')
                : '-'}
            </div>
            <div>
              <span className="font-medium">終了日時:</span>{' '}
              {basicInfo.end_date
                ? format(new Date(basicInfo.end_date), 'yyyy年MM月dd日 HH:mm')
                : '-'}
            </div>
            {/* リソース管理（カスタムフィールド）の表示 */}
            {(basicInfo as any)?.customFields && (basicInfo as any).customFields.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="font-semibold mb-4 text-lg">📋 リソース管理</div>
                <div className="space-y-4">
                  {(basicInfo as any).customFields.map((field: any, index: number) => {
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
                          return { emoji: '🟢', text: '準備OK', color: 'text-green-600' }
                        case 'confirmed':
                          return { emoji: '🟡', text: '手配中', color: 'text-yellow-600' }
                        case 'pending':
                        default:
                          return { emoji: '🔴', text: '未確認', color: 'text-red-600' }
                      }
                    }
                    const statusDisplay = getStatusDisplay()
                    
                    // 値の表示
                    let valueDisplay = '（未入力）'
                    if (field.value) {
                      if (field.type === 'datetime') {
                        valueDisplay = format(new Date(field.value), 'yyyy年MM月dd日 HH:mm')
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
                              <span className={`text-xs font-medium ${statusDisplay.color} bg-white px-2 py-1 rounded border`}>
                                {statusDisplay.emoji} {statusDisplay.text}
                              </span>
                            )}
                            {field.assignee && (
                              <span className="text-xs text-muted-foreground">
                                担当: {field.assignee}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* イベント */}
        {events.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>イベント ({events.length}件)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border-l-4 border-primary pl-4 py-2"
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.description && (
                      <div className="text-sm text-muted-foreground">
                        {event.description}
                      </div>
                    )}
                    <div className="text-sm mt-1">
                      {format(new Date(event.start_time), 'MM/dd HH:mm')} -{' '}
                      {format(new Date(event.end_time), 'MM/dd HH:mm')}
                      {event.location && ` @ ${event.location}`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 持ち物リスト */}
        {items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>持ち物リスト ({items.length}件)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.quantity > 1 && (
                        <span className="text-muted-foreground ml-2">
                          × {item.quantity}
                          {item.unit && ` ${item.unit}`}
                        </span>
                      )}
                      {item.description && (
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      )}
                    </div>
                    {item.is_required && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                        必須
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSaving}>
          戻る
        </Button>
        <Button
          type="button"
          onClick={onSave}
          size="lg"
          className="min-w-[200px]"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            '保存する'
          )}
        </Button>
      </div>
    </div>
  )
}

