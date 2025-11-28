'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TimelineEvent } from '@/types/supabase'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Calendar, MapPin, Clock, User, Phone, Mail, Link as LinkIcon, Hash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface EventDetailDialogProps {
  event: TimelineEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// カスタムフィールドの型
interface CustomField {
  label: string
  value: string
  type: string
  options?: string[]
}

// フィールドタイプのラベルを取得
function getFieldTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    text: 'テキスト',
    textarea: '長文',
    number: '数値',
    datetime: '日時',
    select: '選択',
    url: 'URL',
    email: 'メール',
    phone: '電話',
  }
  return labels[type] || type
}

// フィールドの値を表示用にフォーマット
function renderFieldValue(field: CustomField): string | JSX.Element {
  if (!field.value) return <span className="text-muted-foreground">（未入力）</span>

  switch (field.type) {
    case 'datetime':
      try {
        return format(new Date(field.value), 'yyyy年MM月dd日 HH:mm', { locale: ja })
      } catch {
        return field.value
      }
    case 'number':
      return Number(field.value).toLocaleString()
    case 'url':
      return (
        <a
          href={field.value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {field.value}
        </a>
      )
    case 'email':
      return (
        <a href={`mailto:${field.value}`} className="text-blue-600 hover:underline">
          {field.value}
        </a>
      )
    case 'phone':
      return (
        <a href={`tel:${field.value}`} className="text-blue-600 hover:underline">
          {field.value}
        </a>
      )
    default:
      return field.value
  }
}

// フィールドタイプに応じたアイコンを取得
function getFieldIcon(type: string) {
  switch (type) {
    case 'datetime':
      return <Clock className="h-4 w-4" />
    case 'number':
      return <Hash className="h-4 w-4" />
    case 'url':
      return <LinkIcon className="h-4 w-4" />
    case 'email':
      return <Mail className="h-4 w-4" />
    case 'phone':
      return <Phone className="h-4 w-4" />
    default:
      return null
  }
}

export function EventDetailDialog({ event, open, onOpenChange }: EventDetailDialogProps) {
  if (!event) return null

  // metadataからカスタムフィールドを取得
  const customFields: CustomField[] = []
  if (event.metadata && typeof event.metadata === 'object') {
    Object.entries(event.metadata as Record<string, any>).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'value' in value) {
        customFields.push({
          label: key,
          value: value.value,
          type: value.type || 'text',
          options: value.options,
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
          {event.description && (
            <DialogDescription className="text-base pt-2">
              {event.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* 基本情報 */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">開始時刻:</span>
                <span>
                  {format(new Date(event.start_time), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">終了時刻:</span>
                <span>
                  {format(new Date(event.end_time), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">場所:</span>
                  <span>{event.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">所要時間:</span>
                <span>
                  {Math.round(
                    (new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) /
                      (1000 * 60)
                  )}
                  分
                </span>
              </div>
            </CardContent>
          </Card>

          {/* カスタムフィールド */}
          {customFields.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">詳細情報</h3>
                <div className="space-y-3">
                  {customFields.map((field, index) => (
                    <div key={index} className="border-b last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getFieldIcon(field.type)}
                        <span className="font-medium text-sm">{field.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {getFieldTypeLabel(field.type)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground ml-6">
                        {renderFieldValue(field)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


