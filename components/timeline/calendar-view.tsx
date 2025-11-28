'use client'

import { format, startOfDay, endOfDay, differenceInDays, eachDayOfInterval, isSameDay, getHours, getMinutes, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns'
import { ja } from 'date-fns/locale'
import { TimelineEvent } from '@/types/supabase'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin, Clock, User, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EventDetailDialog } from './event-detail-dialog'

interface CalendarViewProps {
  events: TimelineEvent[]
  startDate: string
  endDate: string
}

// イベントの色を決定する関数
function getEventColor(index: number): string {
  const colors = [
    'bg-blue-500 hover:bg-blue-600',
    'bg-green-500 hover:bg-green-600',
    'bg-purple-500 hover:bg-purple-600',
    'bg-orange-500 hover:bg-orange-600',
    'bg-pink-500 hover:bg-pink-600',
    'bg-teal-500 hover:bg-teal-600',
    'bg-indigo-500 hover:bg-indigo-600',
    'bg-yellow-500 hover:bg-yellow-600',
  ]
  return colors[index % colors.length]
}

// 時間を分に変換
function timeToMinutes(date: Date): number {
  return getHours(date) * 60 + getMinutes(date)
}

// 分を時間文字列に変換
function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

export function CalendarView({ events, startDate, endDate }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [currentDate, setCurrentDate] = useState(new Date(startDate))
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        イベントがありません
      </div>
    )
  }

  const timelineStart = startOfDay(new Date(startDate))
  const timelineEnd = endOfDay(new Date(endDate))

  // 表示する日付の範囲を決定
  let displayStart: Date
  let displayEnd: Date
  let days: Date[]

  if (viewMode === 'month') {
    displayStart = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), { locale: ja })
    displayEnd = endOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), { locale: ja })
    days = eachDayOfInterval({ start: displayStart, end: displayEnd })
  } else if (viewMode === 'week') {
    displayStart = startOfWeek(currentDate, { locale: ja })
    displayEnd = endOfWeek(currentDate, { locale: ja })
    days = eachDayOfInterval({ start: displayStart, end: displayEnd })
  } else {
    days = [currentDate]
  }

  // 各日のイベントをグループ化
  const eventsByDay = days.reduce((acc, day) => {
    const dayKey = format(day, 'yyyy-MM-dd')
    acc[dayKey] = events.filter((event) => {
      const eventStart = new Date(event.start_time)
      const eventEnd = new Date(event.end_time)
      return isSameDay(eventStart, day) || isSameDay(eventEnd, day) || 
             (eventStart <= day && eventEnd >= day)
    })
    return acc
  }, {} as Record<string, TimelineEvent[]>)

  // 週/月のナビゲーション
  const handlePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1))
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000))
    }
  }

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1))
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="w-full space-y-4">
      {/* ヘッダーコントロール */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            今日
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-4 font-semibold text-lg">
            {viewMode === 'month' && format(currentDate, 'yyyy年MM月', { locale: ja })}
            {viewMode === 'week' && `${format(displayStart, 'yyyy年MM月dd日', { locale: ja })} - ${format(displayEnd, 'MM月dd日', { locale: ja })}`}
            {viewMode === 'day' && format(currentDate, 'yyyy年MM月dd日', { locale: ja })}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            月
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            週
          </Button>
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            日
          </Button>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <Card>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* 曜日ヘッダー */}
            {viewMode !== 'day' && (
              <div className="grid grid-cols-7 border-b">
                {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                  <div
                    key={index}
                    className={`p-2 text-center font-semibold text-sm ${
                      index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : ''
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            )}

            {/* 日付グリッド */}
            <div className={viewMode === 'day' ? 'grid grid-cols-1' : 'grid grid-cols-7'}>
              {days.map((day, dayIndex) => {
                const dayKey = format(day, 'yyyy-MM-dd')
                const dayEvents = eventsByDay[dayKey] || []
                const isToday = isSameDay(day, new Date())
                const isCurrentMonth = day.getMonth() === currentDate.getMonth()

                return (
                  <div
                    key={dayIndex}
                    className={`min-h-[120px] border-r border-b p-2 ${
                      !isCurrentMonth && viewMode === 'month' ? 'bg-gray-50' : ''
                    } ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    {/* 日付 */}
                    <div className={`text-sm font-medium mb-2 ${
                      isToday ? 'text-blue-600' : isCurrentMonth || viewMode !== 'month' ? '' : 'text-gray-400'
                    }`}>
                      {format(day, 'd', { locale: ja })}
                    </div>

                    {/* イベントリスト */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, viewMode === 'day' ? 20 : 3).map((event, eventIndex) => {
                        const eventStart = new Date(event.start_time)
                        const eventEnd = new Date(event.end_time)
                        const isSameDayEvent = isSameDay(eventStart, day)
                        const color = getEventColor(events.indexOf(event))

                        return (
                          <div
                            key={event.id}
                            className={`${color} text-white text-xs p-1.5 rounded cursor-pointer transition-all hover:shadow-md flex items-center justify-between gap-2`}
                            onClick={() => {
                              setSelectedEvent(event)
                              setDetailDialogOpen(true)
                            }}
                            title="クリックして詳細を表示"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{event.title}</div>
                              {isSameDayEvent && (
                                <div className="text-xs opacity-90 mt-0.5">
                                  {format(eventStart, 'HH:mm', { locale: ja })} - {format(eventEnd, 'HH:mm', { locale: ja })}
                                </div>
                              )}
                            </div>
                            <Eye className="h-3 w-3 opacity-70 flex-shrink-0" />
                          </div>
                        )
                      })}
                      {dayEvents.length > (viewMode === 'day' ? 20 : 3) && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents.length - (viewMode === 'day' ? 20 : 3)}件
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* イベント詳細リスト（日表示の場合） */}
      {viewMode === 'day' && (
        <Card>
          <div className="p-4">
            <h3 className="font-semibold mb-4">イベント詳細</h3>
            <div className="space-y-4">
              {eventsByDay[format(currentDate, 'yyyy-MM-dd')]?.map((event, index) => {
                const eventStart = new Date(event.start_time)
                const eventEnd = new Date(event.end_time)
                const color = getEventColor(events.indexOf(event))

                // metadataからカスタムフィールドを取得
                const customFieldsCount = event.metadata && typeof event.metadata === 'object'
                  ? Object.keys(event.metadata as Record<string, any>).filter(
                      (key) => event.metadata && typeof event.metadata === 'object' && 
                      (event.metadata as Record<string, any>)[key]?.value
                    ).length
                  : 0

                return (
                  <div
                    key={event.id}
                    className={`${color} text-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                    onClick={() => {
                      setSelectedEvent(event)
                      setDetailDialogOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{event.title}</h4>
                      <div className="text-sm opacity-90">
                        {format(eventStart, 'yyyy/MM/dd HH:mm', { locale: ja })} - {format(eventEnd, 'yyyy/MM/dd HH:mm', { locale: ja })}
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-sm opacity-90 mb-2">{event.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm opacity-90 mb-2">
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.round((eventEnd.getTime() - eventStart.getTime()) / (1000 * 60))}分
                      </div>
                    </div>
                    {customFieldsCount > 0 && (
                      <div className="text-xs opacity-75 flex items-center gap-1 mt-2 pt-2 border-t border-white/20">
                        <Eye className="h-3 w-3" />
                        {customFieldsCount}件の詳細情報があります（クリックして表示）
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      )}

      {/* イベント詳細ダイアログ */}
      <EventDetailDialog
        event={selectedEvent}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  )
}

