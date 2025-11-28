'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, Upload, Link as LinkIcon, Check, X as XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type FieldItem = {
  id: string
  type: 'text' | 'textarea' | 'datetime' | 'number' | 'header' | 'file' | 'link' | 'boolean'
  label: string
  value: string
  unit?: string
  status?: 'pending' | 'confirmed' | 'acquired'
  assignee?: string
}

interface SortableFieldItemProps {
  field: FieldItem
  onUpdate: (id: string, updates: Partial<FieldItem>) => void
  onRemove: (id: string) => void
}

export function SortableFieldItem({ field, onUpdate, onRemove }: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // 見出しタイプの場合
  if (field.type === 'header') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg border-2 border-gray-300"
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="h-5 w-5 text-gray-500" />
        </div>
        <Input
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
          placeholder="見出し（例: --- 音響機材 ---）"
          className="flex-1 font-bold text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(field.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // ステータスインジケーターの色を取得
  const getStatusColor = () => {
    switch (field.status) {
      case 'acquired':
        return 'bg-green-500'
      case 'confirmed':
        return 'bg-yellow-500'
      case 'pending':
      default:
        return 'bg-red-500'
    }
  }

  // ステータスをトグル
  const toggleStatus = () => {
    const statusOrder: Array<'pending' | 'confirmed' | 'acquired'> = ['pending', 'confirmed', 'acquired']
    const currentIndex = statusOrder.indexOf(field.status || 'pending')
    const nextIndex = (currentIndex + 1) % statusOrder.length
    onUpdate(field.id, { status: statusOrder[nextIndex] })
  }

  // 単位のオプション
  const unitOptions = ['個', '本', 'm', 'A', 'W', 'kg', '円', '台', 'セット', '枚']

  // 通常のフィールド
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-2 items-start p-4 border rounded-lg bg-white relative"
    >
      {/* ステータスインジケーター（左端） */}
      <button
        type="button"
        onClick={toggleStatus}
        className={cn(
          'w-4 h-4 rounded-full mt-1 flex-shrink-0 transition-all hover:scale-110 cursor-pointer',
          getStatusColor()
        )}
        title={
          field.status === 'acquired'
            ? '取得済み（クリックで変更）'
            : field.status === 'confirmed'
            ? '確認済み（クリックで変更）'
            : '未確認（クリックで変更）'
        }
      />

      {/* ドラッグハンドル */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none pt-1"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      <div className="flex-1 space-y-2">
        <Input
          placeholder="フィールド名（例: 電源容量、ステージサイズなど）"
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: e.target.value })}
          className="text-sm"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Select
            value={field.type}
            onValueChange={(value: FieldItem['type']) => {
              // タイプ変更時に値をリセット
              const resetValue = value === 'boolean' ? 'false' : value === 'number' ? '0' : ''
              onUpdate(field.id, { type: value, value: resetValue })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">テキスト</SelectItem>
              <SelectItem value="textarea">長文テキスト</SelectItem>
              <SelectItem value="number">数値</SelectItem>
              <SelectItem value="datetime">日時</SelectItem>
              <SelectItem value="boolean">有無（Yes/No）</SelectItem>
              <SelectItem value="link">参考URL</SelectItem>
              <SelectItem value="file">ファイル</SelectItem>
            </SelectContent>
          </Select>
          {field.type === 'number' && (
            <Select
              value={field.unit || '個'}
              onValueChange={(value) => onUpdate(field.id, { unit: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {field.type === 'textarea' ? (
          <Textarea
            placeholder="値を入力"
            value={field.value}
            onChange={(e) => onUpdate(field.id, { value: e.target.value })}
            className="resize-none min-h-[80px]"
          />
        ) : field.type === 'datetime' ? (
          <Input
            type="datetime-local"
            value={field.value}
            onChange={(e) => onUpdate(field.id, { value: e.target.value })}
          />
        ) : field.type === 'number' ? (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="数値を入力"
              value={field.value}
              onChange={(e) => onUpdate(field.id, { value: e.target.value })}
              className="flex-1"
            />
            {field.unit && (
              <div className="flex items-center px-3 bg-gray-100 rounded border text-sm">
                {field.unit}
              </div>
            )}
          </div>
        ) : field.type === 'boolean' ? (
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant={field.value === 'true' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate(field.id, { value: 'true' })}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              あり
            </Button>
            <Button
              type="button"
              variant={field.value === 'false' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate(field.id, { value: 'false' })}
              className="gap-2"
            >
              <XIcon className="h-4 w-4" />
              なし
            </Button>
          </div>
        ) : field.type === 'link' ? (
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://..."
              value={field.value}
              onChange={(e) => onUpdate(field.id, { value: e.target.value })}
              className="flex-1"
            />
            {field.value && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(field.value, '_blank')}
                className="gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                開く
              </Button>
            )}
          </div>
        ) : field.type === 'file' ? (
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-muted-foreground mb-2">
              ファイルアップロード（モック）
            </p>
            <Input
              type="text"
              placeholder="ファイル名を入力（例: 会場図面.pdf）"
              value={field.value}
              onChange={(e) => onUpdate(field.id, { value: e.target.value })}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              ※ 実際のファイルアップロード機能は今後実装予定
            </p>
          </div>
        ) : (
          <Input
            placeholder="値を入力"
            value={field.value}
            onChange={(e) => onUpdate(field.id, { value: e.target.value })}
          />
        )}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="担当者名（例: 田中）"
            value={field.assignee || ''}
            onChange={(e) => onUpdate(field.id, { assignee: e.target.value })}
            className="text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {field.status && (
            <Badge
              variant={
                field.status === 'acquired'
                  ? 'default'
                  : field.status === 'confirmed'
                  ? 'secondary'
                  : 'outline'
              }
              className="text-xs"
            >
              {field.status === 'acquired'
                ? '🟢 準備OK'
                : field.status === 'confirmed'
                ? '🟡 手配中'
                : '🔴 未確認'}
            </Badge>
          )}
          {field.assignee && (
            <span className="text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded">
              担当: {field.assignee}
            </span>
          )}
          {field.type === 'number' && field.value && field.unit && (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              [{field.value}{field.unit}]
            </span>
          )}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(field.id)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

