'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'

interface EventCustomField {
  id: string
  label: string
  value: string
  type: 'text' | 'textarea' | 'datetime' | 'number' | 'select' | 'url' | 'email' | 'phone'
  options?: string[] // selectタイプの場合の選択肢
}

interface Event {
  id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  customFields?: EventCustomField[]
}

interface Step3EventsProps {
  events: Event[]
  onAddEvent: (event: Event) => void
  onUpdateEvent: (id: string, event: Partial<Event>) => void
  onRemoveEvent: (id: string) => void
  onBack: () => void
  onSave: () => Promise<void>
  isSaving: boolean
  genre: string
  basicInfo: any
  items: Array<{
    id: string
    name: string
    description?: string
    quantity: number
    unit?: string
    category?: string
    is_required: boolean
  }>
}

export function Step3Events({
  events,
  onAddEvent,
  onUpdateEvent,
  onRemoveEvent,
  onBack,
  onSave,
  isSaving,
  genre,
  basicInfo,
  items,
}: Step3EventsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    customFields: [],
  })

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start_time || !newEvent.end_time) {
      return
    }

    onAddEvent({
      ...newEvent,
      id: Date.now().toString(),
    })

    setNewEvent({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      location: '',
      customFields: [],
    })
    setIsAdding(false)
  }

  const toggleEventExpand = (eventId: string) => {
    const newExpanded = new Set(expandedEvents)
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId)
    } else {
      newExpanded.add(eventId)
    }
    setExpandedEvents(newExpanded)
  }

  const addCustomFieldToEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) return

    const newField: EventCustomField = {
      id: Date.now().toString(),
      label: '',
      value: '',
      type: 'text',
    }

    const updatedEvent = {
      ...event,
      customFields: [...(event.customFields || []), newField],
    }

    onUpdateEvent(eventId, updatedEvent)
  }

  const removeCustomFieldFromEvent = (eventId: string, fieldId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) return

    const updatedEvent = {
      ...event,
      customFields: (event.customFields || []).filter((f) => f.id !== fieldId),
    }

    onUpdateEvent(eventId, updatedEvent)
  }

  const updateCustomFieldInEvent = (
    eventId: string,
    fieldId: string,
    updates: Partial<EventCustomField>
  ) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) return

    const updatedEvent = {
      ...event,
      customFields: (event.customFields || []).map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    }

    onUpdateEvent(eventId, updatedEvent)
  }

  const addCustomFieldToNewEvent = () => {
    const newField: EventCustomField = {
      id: Date.now().toString(),
      label: '',
      value: '',
      type: 'text',
    }
    setNewEvent({
      ...newEvent,
      customFields: [...(newEvent.customFields || []), newField],
    })
  }

  const removeCustomFieldFromNewEvent = (fieldId: string) => {
    setNewEvent({
      ...newEvent,
      customFields: (newEvent.customFields || []).filter((f) => f.id !== fieldId),
    })
  }

  const updateCustomFieldInNewEvent = (fieldId: string, updates: Partial<EventCustomField>) => {
    setNewEvent({
      ...newEvent,
      customFields: (newEvent.customFields || []).map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">イベントを追加</h2>
        <p className="text-muted-foreground">
          タイムライン内のイベントや時間枠を追加してください
        </p>
      </div>

      {/* イベントリスト */}
      <div className="space-y-4">
        {events.map((event) => {
          const isExpanded = expandedEvents.has(event.id)
          const isEditing = editingEventId === event.id

          return (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleEventExpand(event.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveEvent(event.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="font-medium">開始:</span>{' '}
                    {event.start_time
                      ? format(new Date(event.start_time), 'yyyy/MM/dd HH:mm')
                      : '-'}
                  </div>
                  <div>
                    <span className="font-medium">終了:</span>{' '}
                    {event.end_time
                      ? format(new Date(event.end_time), 'yyyy/MM/dd HH:mm')
                      : '-'}
                  </div>
                  {event.location && (
                    <div className="md:col-span-2">
                      <span className="font-medium">場所:</span> {event.location}
                    </div>
                  )}
                </div>

                {/* カスタムフィールド表示/編集 */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">詳細情報</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addCustomFieldToEvent(event.id)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        フィールドを追加
                      </Button>
                    </div>

                    {event.customFields && event.customFields.length > 0 ? (
                      <div className="space-y-3">
                        {event.customFields.map((field) => (
                          <div
                            key={field.id}
                            className="flex gap-2 items-start p-3 border rounded-lg bg-gray-50"
                          >
                            <div className="flex-1 space-y-2">
                              <Input
                                placeholder="フィールド名"
                                value={field.label}
                                onChange={(e) =>
                                  updateCustomFieldInEvent(event.id, field.id, {
                                    label: e.target.value,
                                  })
                                }
                                className="text-sm"
                              />
                              <Select
                                value={field.type}
                                onValueChange={(value: EventCustomField['type']) =>
                                  updateCustomFieldInEvent(event.id, field.id, { type: value })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">テキスト</SelectItem>
                                  <SelectItem value="textarea">長文テキスト</SelectItem>
                                  <SelectItem value="number">数値</SelectItem>
                                  <SelectItem value="datetime">日時</SelectItem>
                                  <SelectItem value="select">選択肢</SelectItem>
                                  <SelectItem value="url">URL</SelectItem>
                                  <SelectItem value="email">メールアドレス</SelectItem>
                                  <SelectItem value="phone">電話番号</SelectItem>
                                </SelectContent>
                              </Select>
                              {field.type === 'select' && (
                                <Input
                                  placeholder="選択肢をカンマ区切りで入力"
                                  value={field.options?.join(',') || ''}
                                  onChange={(e) =>
                                    updateCustomFieldInEvent(event.id, field.id, {
                                      options: e.target.value.split(',').map((s) => s.trim()),
                                    })
                                  }
                                  className="text-sm"
                                />
                              )}
                              {field.type === 'textarea' ? (
                                <Textarea
                                  placeholder="値を入力"
                                  value={field.value}
                                  onChange={(e) =>
                                    updateCustomFieldInEvent(event.id, field.id, {
                                      value: e.target.value,
                                    })
                                  }
                                  className="resize-none min-h-[80px]"
                                />
                              ) : field.type === 'datetime' ? (
                                <Input
                                  type="datetime-local"
                                  value={field.value}
                                  onChange={(e) =>
                                    updateCustomFieldInEvent(event.id, field.id, {
                                      value: e.target.value,
                                    })
                                  }
                                />
                              ) : field.type === 'number' ? (
                                <Input
                                  type="number"
                                  placeholder="値を入力"
                                  value={field.value}
                                  onChange={(e) =>
                                    updateCustomFieldInEvent(event.id, field.id, {
                                      value: e.target.value,
                                    })
                                  }
                                />
                              ) : field.type === 'select' ? (
                                <Select
                                  value={field.value}
                                  onValueChange={(value) =>
                                    updateCustomFieldInEvent(event.id, field.id, { value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="選択してください" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((option, idx) => (
                                      <SelectItem key={idx} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : 'text'}
                                  placeholder="値を入力"
                                  value={field.value}
                                  onChange={(e) =>
                                    updateCustomFieldInEvent(event.id, field.id, {
                                      value: e.target.value,
                                    })
                                  }
                                />
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCustomFieldFromEvent(event.id, field.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        詳細情報がありません。「フィールドを追加」ボタンで追加できます
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {/* 新規イベント追加フォーム */}
        {isAdding ? (
          <Card className="border-dashed border-2">
            <CardHeader>
              <CardTitle className="text-lg">新しいイベント</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">タイトル *</label>
                <Input
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="例: リハーサル開始"
                  className="text-base"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">説明</label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                  placeholder="イベントの詳細"
                  className="resize-none min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">開始時刻 *</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.start_time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, start_time: e.target.value })
                    }
                    className="text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">終了時刻 *</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.end_time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, end_time: e.target.value })
                    }
                    className="text-base"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">場所</label>
                <Input
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  placeholder="例: メインステージ"
                  className="text-base"
                />
              </div>

              {/* カスタムフィールド */}
              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">詳細情報</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomFieldToNewEvent}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    フィールドを追加
                  </Button>
                </div>

                {newEvent.customFields && newEvent.customFields.length > 0 && (
                  <div className="space-y-3">
                    {newEvent.customFields.map((field) => (
                      <div
                        key={field.id}
                        className="flex gap-2 items-start p-3 border rounded-lg bg-gray-50"
                      >
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="フィールド名（例: 担当者、機材、備考など）"
                            value={field.label}
                            onChange={(e) =>
                              updateCustomFieldInNewEvent(field.id, { label: e.target.value })
                            }
                            className="text-sm"
                          />
                          <Select
                            value={field.type}
                            onValueChange={(value: EventCustomField['type']) =>
                              updateCustomFieldInNewEvent(field.id, { type: value })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">テキスト</SelectItem>
                              <SelectItem value="textarea">長文テキスト</SelectItem>
                              <SelectItem value="number">数値</SelectItem>
                              <SelectItem value="datetime">日時</SelectItem>
                              <SelectItem value="select">選択肢</SelectItem>
                              <SelectItem value="url">URL</SelectItem>
                              <SelectItem value="email">メールアドレス</SelectItem>
                              <SelectItem value="phone">電話番号</SelectItem>
                            </SelectContent>
                          </Select>
                          {field.type === 'select' && (
                            <Input
                              placeholder="選択肢をカンマ区切りで入力（例: 選択肢1,選択肢2,選択肢3）"
                              value={field.options?.join(',') || ''}
                              onChange={(e) =>
                                updateCustomFieldInNewEvent(field.id, {
                                  options: e.target.value.split(',').map((s) => s.trim()),
                                })
                              }
                              className="text-sm"
                            />
                          )}
                          {field.type === 'textarea' ? (
                            <Textarea
                              placeholder="値を入力"
                              value={field.value}
                              onChange={(e) =>
                                updateCustomFieldInNewEvent(field.id, { value: e.target.value })
                              }
                              className="resize-none min-h-[80px]"
                            />
                          ) : field.type === 'datetime' ? (
                            <Input
                              type="datetime-local"
                              value={field.value}
                              onChange={(e) =>
                                updateCustomFieldInNewEvent(field.id, { value: e.target.value })
                              }
                            />
                          ) : field.type === 'number' ? (
                            <Input
                              type="number"
                              placeholder="値を入力"
                              value={field.value}
                              onChange={(e) =>
                                updateCustomFieldInNewEvent(field.id, { value: e.target.value })
                              }
                            />
                          ) : field.type === 'select' ? (
                            <Select
                              value={field.value}
                              onValueChange={(value) =>
                                updateCustomFieldInNewEvent(field.id, { value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="選択してください" />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((option, idx) => (
                                  <SelectItem key={idx} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : 'text'}
                              placeholder="値を入力"
                              value={field.value}
                              onChange={(e) =>
                                updateCustomFieldInNewEvent(field.id, { value: e.target.value })
                              }
                            />
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomFieldFromNewEvent(field.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddEvent} size="sm">
                  追加
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false)
                    setNewEvent({
                      title: '',
                      description: '',
                      start_time: '',
                      end_time: '',
                      location: '',
                      customFields: [],
                    })
                  }}
                >
                  キャンセル
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsAdding(true)}
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            イベントを追加
          </Button>
        )}
      </div>

      {/* 確認セクション */}
      <div className="mt-8 pt-8 border-t">
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-xl font-bold">確認と保存</h3>
          <p className="text-sm text-muted-foreground">
            内容を確認して保存してください
          </p>
        </div>

        {/* プレビュー */}
        <div className="space-y-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">タイトル:</span> {basicInfo?.title || '-'}
              </div>
              {basicInfo?.description && (
                <div>
                  <span className="font-medium">説明:</span> {basicInfo.description}
                </div>
              )}
              <div>
                <span className="font-medium">開始日時:</span>{' '}
                {basicInfo?.start_date
                  ? format(new Date(basicInfo.start_date), 'yyyy年MM月dd日 HH:mm')
                  : '-'}
              </div>
              <div>
                <span className="font-medium">終了日時:</span>{' '}
                {basicInfo?.end_date
                  ? format(new Date(basicInfo.end_date), 'yyyy年MM月dd日 HH:mm')
                  : '-'}
              </div>
            </CardContent>
          </Card>

          {events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">イベント ({events.length}件)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="text-sm border-l-4 border-primary pl-3 py-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground">
                        {format(new Date(event.start_time), 'MM/dd HH:mm')} -{' '}
                        {format(new Date(event.end_time), 'MM/dd HH:mm')}
                      </div>
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-sm text-muted-foreground text-center pt-2">
                      他 {events.length - 3} 件...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSaving}>
          戻る
        </Button>
        <Button
          type="button"
          onClick={async () => {
            if (events.length === 0) {
              alert('少なくとも1つのイベントを追加してください。')
              return
            }
            await onSave()
          }}
          size="lg"
          className="min-w-[200px]"
          disabled={events.length === 0 || isSaving}
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

// フィールドタイプのラベルを取得
function getFieldTypeLabel(type: EventCustomField['type']): string {
  const labels: Record<EventCustomField['type'], string> = {
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
function renderFieldValue(field: EventCustomField): string {
  if (!field.value) return '（未入力）'

  switch (field.type) {
    case 'datetime':
      try {
        return format(new Date(field.value), 'yyyy年MM月dd日 HH:mm')
      } catch {
        return field.value
      }
    case 'number':
      return Number(field.value).toLocaleString()
    case 'url':
      return field.value
    case 'email':
      return field.value
    case 'phone':
      return field.value
    default:
      return field.value
  }
}

