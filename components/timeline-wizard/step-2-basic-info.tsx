'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TimelineGenre } from '@/types/supabase'
import { Plus, X, Calendar, MapPin, Clock, User, Phone, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableFieldItem, FieldItem } from './sortable-field-item'
import type { FieldItem as FieldItemType } from './sortable-field-item'
import {
  getBasicInfoSchema,
  BasicInfoFormData,
  PABasicInfoFormData,
  MeetingBasicInfoFormData,
  TravelBasicInfoFormData,
  LifePlanBasicInfoFormData,
  OtherBasicInfoFormData,
} from '@/lib/schemas/timeline'

interface Step2BasicInfoProps {
  genre: TimelineGenre
  initialData?: BasicInfoFormData | null
  onSubmit: (data: BasicInfoFormData) => void
  onBack: () => void
}

export function Step2BasicInfo({ genre, initialData, onSubmit, onBack }: Step2BasicInfoProps) {
  const schema = getBasicInfoSchema(genre)
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || ({} as BasicInfoFormData),
  })

  const [customFields, setCustomFields] = useState<FieldItem[]>(
    (initialData as any)?.customFields || []
  )

  // DnDセンサーの設定（タッチデバイス対応）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleSubmit = (data: BasicInfoFormData) => {
    onSubmit({ ...data, genre, customFields } as any)
  }

  const addCustomField = (type: FieldItem['type'] = 'text') => {
    const newField: FieldItem = {
      id: Date.now().toString(),
      label: '',
      value: '',
      type,
    }
    setCustomFields([...customFields, newField])
  }

  // ジャンルに応じたプリセットを取得
  const getPresets = (): Array<{ label: string; field: FieldItem }> => {
    switch (genre) {
      case 'pa':
        return [
          {
            label: 'マイク本数',
            field: {
              id: Date.now().toString(),
              label: 'マイク本数',
              value: '',
              type: 'number',
              unit: '本',
              status: 'pending',
            },
          },
          {
            label: 'スピーカー',
            field: {
              id: Date.now().toString() + '_1',
              label: 'スピーカー',
              value: '',
              type: 'number',
              unit: '台',
              status: 'pending',
            },
          },
          {
            label: 'ケーブル',
            field: {
              id: Date.now().toString() + '_2',
              label: 'ケーブル',
              value: '',
              type: 'number',
              unit: '本',
              status: 'pending',
            },
          },
          {
            label: '電源容量',
            field: {
              id: Date.now().toString() + '_3',
              label: '電源容量',
              value: '',
              type: 'number',
              unit: 'A',
              status: 'pending',
            },
          },
        ]
      case 'travel':
        return [
          {
            label: 'パスポート',
            field: {
              id: Date.now().toString(),
              label: 'パスポート',
              value: '',
              type: 'boolean',
              status: 'pending',
            },
          },
          {
            label: '航空券',
            field: {
              id: Date.now().toString() + '_1',
              label: '航空券',
              value: '',
              type: 'text',
              status: 'pending',
            },
          },
          {
            label: 'ホテル予約',
            field: {
              id: Date.now().toString() + '_2',
              label: 'ホテル予約',
              value: '',
              type: 'text',
              status: 'pending',
            },
          },
          {
            label: '旅行保険',
            field: {
              id: Date.now().toString() + '_3',
              label: '旅行保険',
              value: '',
              type: 'boolean',
              status: 'pending',
            },
          },
        ]
      case 'meeting':
        return [
          {
            label: 'プロジェクター',
            field: {
              id: Date.now().toString(),
              label: 'プロジェクター',
              value: '',
              type: 'number',
              unit: '台',
              status: 'pending',
            },
          },
          {
            label: '資料',
            field: {
              id: Date.now().toString() + '_1',
              label: '資料',
              value: '',
              type: 'number',
              unit: '部',
              status: 'pending',
            },
          },
          {
            label: 'ホワイトボード',
            field: {
              id: Date.now().toString() + '_2',
              label: 'ホワイトボード',
              value: '',
              type: 'boolean',
              status: 'pending',
            },
          },
          {
            label: '会議室設備',
            field: {
              id: Date.now().toString() + '_3',
              label: '会議室設備',
              value: '',
              type: 'textarea',
              status: 'pending',
            },
          },
        ]
      case 'life_plan':
        return [
          {
            label: '予算',
            field: {
              id: Date.now().toString(),
              label: '予算',
              value: '',
              type: 'number',
              unit: '円',
              status: 'pending',
            },
          },
          {
            label: '優先度',
            field: {
              id: Date.now().toString() + '_1',
              label: '優先度',
              value: '',
              type: 'text',
              status: 'pending',
            },
          },
          {
            label: '期限',
            field: {
              id: Date.now().toString() + '_2',
              label: '期限',
              value: '',
              type: 'datetime',
              status: 'pending',
            },
          },
        ]
      default:
        return [
          {
            label: '項目1',
            field: {
              id: Date.now().toString(),
              label: '項目1',
              value: '',
              type: 'text',
              status: 'pending',
            },
          },
        ]
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setCustomFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id))
  }

  const updateCustomField = (id: string, updates: Partial<FieldItem>) => {
    setCustomFields(
      customFields.map((field) => (field.id === id ? { ...field, ...updates } : field))
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">基本情報を入力</h2>
        <p className="text-muted-foreground">
          タイムテーブルの基本情報を入力してください
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* 基本情報セクション */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      タイトル *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: 〇〇ライブ" className="text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>説明</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="タイムテーブルの説明を入力..."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        開始日時 *
                      </FormLabel>
                      <FormControl>
                        <Input type="datetime-local" className="text-base" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        終了日時 *
                      </FormLabel>
                      <FormControl>
                        <Input type="datetime-local" className="text-base" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ジャンル別フィールド */}
          {genre === 'pa' && <PABasicInfoFields form={form} />}
          {genre === 'meeting' && <MeetingBasicInfoFields form={form} />}
          {genre === 'travel' && <TravelBasicInfoFields form={form} />}
          {genre === 'life_plan' && <LifePlanBasicInfoFields form={form} />}

          {/* カスタムフィールド */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-lg">リソース管理</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    機材・備品・情報を管理し、ステータスと担当者を追跡できます
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCustomField('header')}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    見出し
                  </Button>
                  {getPresets().map((preset, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newField: FieldItemType = {
                          ...preset.field,
                          id: Date.now().toString() + '_' + index,
                        }
                        setCustomFields([...customFields, newField])
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {preset.label}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addCustomField('text')}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    フィールド
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {customFields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm mb-2">追加情報がありません</p>
                  <p className="text-xs">「見出しを追加」または「フィールドを追加」ボタンで項目を追加できます</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={customFields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {customFields.map((field) => (
                        <SortableFieldItem
                          key={field.id}
                          field={field}
                          onUpdate={updateCustomField}
                          onRemove={removeCustomField}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              戻る
            </Button>
            <Button type="submit" size="lg" className="min-w-[200px]">
              次へ進む
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

// 音響(PA)ジャンル用のフィールド
function PABasicInfoFields({ form }: { form: any }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            会場情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="venue_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>会場名 *</FormLabel>
                <FormControl>
                  <Input placeholder="例: 〇〇ホール" className="text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="venue_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>会場住所</FormLabel>
                <FormControl>
                  <Input placeholder="会場の住所を入力" className="text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            スケジュール
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="load_in_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>搬入時間 *</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rehearsal_start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>リハーサル開始時間 *</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="performance_start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>本番開始時間 *</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="load_out_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>搬出時間</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            連絡先情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    担当者名
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="担当者の名前" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    連絡先電話番号
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="090-1234-5678" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            備考
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="その他の注意事項やメモ"
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  )
}

// 会議ジャンル用のフィールド
function MeetingBasicInfoFields({ form }: { form: any }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            会議室情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="meeting_room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>会議室名</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 会議室A" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="building_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>建物名</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 〇〇ビル" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>階数</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 3F" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>定員</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="例: 20"
                      className="text-base"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            連絡先情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    担当者名
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="担当者の名前" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    連絡先メールアドレス
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            備考
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="その他の注意事項やメモ"
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  )
}

// 旅行ジャンル用のフィールド
function TravelBasicInfoFields({ form }: { form: any }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            目的地
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>目的地 *</FormLabel>
                <FormControl>
                  <Input placeholder="例: 東京" className="text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            宿泊情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="accommodation_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>宿泊施設名</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 〇〇ホテル" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accommodation_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>宿泊施設住所</FormLabel>
                  <FormControl>
                    <Input placeholder="住所を入力" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="check_in"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    チェックイン
                  </FormLabel>
                  <FormControl>
                    <Input type="datetime-local" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="check_out"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    チェックアウト
                  </FormLabel>
                  <FormControl>
                    <Input type="datetime-local" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            交通手段
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">出発</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="departure_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>交通手段</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 新幹線" className="text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departure_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      出発時刻
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className="text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departure_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>出発地</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 東京駅" className="text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">帰着</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="return_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>交通手段</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 新幹線" className="text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="return_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      帰着時刻
                    </FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className="text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="return_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>帰着地</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 東京駅" className="text-base" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5" />
            緊急連絡先
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="emergency_contact"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="緊急時の連絡先" className="text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            備考
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="その他の注意事項やメモ"
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  )
}

// ライフプランジャンル用のフィールド
function LifePlanBasicInfoFields({ form }: { form: any }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            プラン情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>カテゴリ</FormLabel>
                <FormControl>
                  <Input placeholder="例: 結婚、転職、引っ越し" className="text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>優先度</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="優先度を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="low">低</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>予算</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="例: 1000000"
                      className="text-base"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            備考
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="その他の注意事項やメモ"
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  )
}

