'use client'

import { format, startOfDay, endOfDay, differenceInDays } from 'date-fns'
import { ja } from 'date-fns/locale'
import { TimelineEvent } from '@/types/supabase'

interface GanttChartProps {
  events: TimelineEvent[]
  startDate: string
  endDate: string
}

// イベントの色を決定する関数
function getEventColor(index: number): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-yellow-500',
  ]
  return colors[index % colors.length]
}

export function GanttChart({ events, startDate, endDate }: GanttChartProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        イベントがありません
      </div>
    )
  }

  const timelineStart = startOfDay(new Date(startDate))
  const timelineEnd = endOfDay(new Date(endDate))
  const totalDays = differenceInDays(timelineEnd, timelineStart) + 1

  // 月ごとにグループ化
  const months: { month: string; days: number }[] = []
  let currentDate = timelineStart
  while (currentDate <= timelineEnd) {
    const monthKey = format(currentDate, 'yyyy年MM月', { locale: ja })
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    // タイムラインの範囲内の月の日数を計算
    const monthStartInRange = monthStart < timelineStart ? timelineStart : monthStart
    const monthEndInRange = monthEnd > timelineEnd ? timelineEnd : monthEnd
    const daysInMonth = differenceInDays(monthEndInRange, monthStartInRange) + 1

    if (daysInMonth > 0) {
      months.push({
        month: monthKey,
        days: daysInMonth,
      })
    }
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
  }

  // イベントの位置と幅を計算
  const eventPositions = events.map((event) => {
    const eventStart = new Date(event.start_time)
    const eventEnd = new Date(event.end_time)
    
    // タイムライン範囲内に収める
    const adjustedStart = eventStart < timelineStart ? timelineStart : eventStart
    const adjustedEnd = eventEnd > timelineEnd ? timelineEnd : eventEnd

    const startOffset = differenceInDays(adjustedStart, timelineStart)
    const duration = differenceInDays(adjustedEnd, adjustedStart) + 1
    const widthPercent = (duration / totalDays) * 100
    const leftPercent = (startOffset / totalDays) * 100

    return {
      event,
      leftPercent: Math.max(0, leftPercent),
      widthPercent: Math.min(100, widthPercent),
      duration,
    }
  })

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* ヘッダー: 月 */}
        <div className="flex border-b-2 border-gray-300">
          {months.map((month, index) => (
            <div
              key={index}
              className="border-r border-gray-200 text-center py-2 font-semibold bg-gray-50"
              style={{ width: `${(month.days / totalDays) * 100}%` }}
            >
              {month.month}
            </div>
          ))}
        </div>

        {/* ガントチャート本体 */}
        <div className="relative mt-4">
          {eventPositions.map(({ event, leftPercent, widthPercent, duration }, index) => {
            const color = getEventColor(index)
            
            return (
              <div key={event.id} className="mb-4">
                {/* イベント名 */}
                <div className="flex items-center mb-2">
                  <div className="w-48 text-sm font-medium truncate pr-4">
                    {event.title}
                  </div>
                  <div className="flex-1 relative h-8 bg-gray-100 rounded">
                    {/* イベントバー */}
                    <div
                      className={`absolute ${color} h-full rounded flex items-center justify-center text-white text-xs font-medium shadow-sm hover:shadow-md transition-shadow`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        minWidth: '20px',
                      }}
                      title={`${format(new Date(event.start_time), 'yyyy/MM/dd HH:mm', { locale: ja })} - ${format(new Date(event.end_time), 'yyyy/MM/dd HH:mm', { locale: ja })}`}
                    >
                      {duration > 0 && widthPercent > 5 && (
                        <span className="px-2 truncate">{event.title}</span>
                      )}
                    </div>
                  </div>
                </div>
                {/* イベント詳細 */}
                {event.description && (
                  <div className="ml-48 text-xs text-muted-foreground mb-2">
                    {event.description}
                  </div>
                )}
                {event.location && (
                  <div className="ml-48 text-xs text-muted-foreground">
                    場所: {event.location}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

