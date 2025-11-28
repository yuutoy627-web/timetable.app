'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Timeline, TimelineGenre } from '@/types/supabase'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Mic2, Users, Plane, Target, MoreHorizontal, Eye, Plus, Share2, Copy, Check, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { deleteTimeline } from '@/lib/actions/timeline'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const genreLabels: Record<TimelineGenre, string> = {
  pa: '音響(PA)',
  meeting: '会議',
  travel: '旅行',
  life_plan: 'ライフプラン',
  other: 'その他',
}

const genreIcons: Record<TimelineGenre, typeof Mic2> = {
  pa: Mic2,
  meeting: Users,
  travel: Plane,
  life_plan: Target,
  other: MoreHorizontal,
}

const genreColors: Record<TimelineGenre, string> = {
  pa: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  meeting: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  travel: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  life_plan: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  other: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800',
}

interface DashboardContentProps {
  timelines: Timeline[]
}

function ShareLinkButton({ timelineId }: { timelineId: string }) {
  const [copied, setCopied] = useState(false)

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/timelines/${timelineId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      disabled={copied}
      title="リンクをコピー"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </Button>
  )
}

export function DashboardContent({ timelines }: DashboardContentProps) {
  const router = useRouter()
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [timelineToDelete, setTimelineToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredTimelines =
    selectedGenre === 'all'
      ? timelines
      : timelines.filter((t) => t.genre === selectedGenre)

  const groupedByGenre = filteredTimelines.reduce(
    (acc, timeline) => {
      const genre = timeline.genre
      if (!acc[genre]) {
        acc[genre] = []
      }
      acc[genre].push(timeline)
      return acc
    },
    {} as Record<TimelineGenre, Timeline[]>
  )

  const handleDeleteClick = (timelineId: string) => {
    setTimelineToDelete(timelineId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!timelineToDelete) return

    setIsDeleting(true)
    try {
      const { error } = await deleteTimeline(timelineToDelete)
      if (error) {
        alert(`削除に失敗しました: ${error}`)
      } else {
        setDeleteDialogOpen(false)
        setTimelineToDelete(null)
        router.refresh()
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('削除に失敗しました')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* フィルターと新規作成ボタン */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="ジャンルでフィルター" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {Object.entries(genreLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Link href="/timelines/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </Link>
      </div>

      {/* タイムライン一覧 */}
      {filteredTimelines.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              {selectedGenre === 'all'
                ? 'タイムテーブルがまだ作成されていません'
                : 'このジャンルのタイムテーブルはありません'}
            </p>
            <Link href="/timelines/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                最初のタイムテーブルを作成
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByGenre).map(([genre, genreTimelines]) => {
            const Icon = genreIcons[genre as TimelineGenre]
            const color = genreColors[genre as TimelineGenre]

            return (
              <div key={genre} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${color.split(' ')[0]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {genreLabels[genre as TimelineGenre]} ({genreTimelines.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {genreTimelines.map((timeline) => (
                    <Card key={timeline.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-2">{timeline.title}</CardTitle>
                            {timeline.description && (
                              <CardDescription className="mt-1 line-clamp-2">
                                {timeline.description}
                              </CardDescription>
                            )}
                          </div>
                          <Badge className={color}>{genreLabels[timeline.genre]}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {timeline.start_date && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">開始:</span>{' '}
                            {format(new Date(timeline.start_date), 'yyyy年MM月dd日', {
                              locale: ja,
                            })}
                          </div>
                        )}
                        {timeline.end_date && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">終了:</span>{' '}
                            {format(new Date(timeline.end_date), 'yyyy年MM月dd日', {
                              locale: ja,
                            })}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          作成日:{' '}
                          {format(new Date(timeline.created_at), 'yyyy/MM/dd', { locale: ja })}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/timelines/${timeline.id}`} className="flex-1">
                            <Button variant="outline" className="w-full" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              詳細
                            </Button>
                          </Link>
                          <ShareLinkButton timelineId={timeline.id} />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(timeline.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="削除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>タイムテーブルを削除</DialogTitle>
            <DialogDescription>
              このタイムテーブルを削除してもよろしいですか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setTimelineToDelete(null)
              }}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? '削除中...' : '削除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

