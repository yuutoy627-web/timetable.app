'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonProps {
  timelineId: string
  isPublic: boolean
  onTogglePublic: (isPublic: boolean) => Promise<void>
}

export function ShareButton({ timelineId, isPublic, onTogglePublic }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const shareUrl = `${window.location.origin}/timelines/${timelineId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleTogglePublic = async () => {
    setIsUpdating(true)
    try {
      await onTogglePublic(!isPublic)
    } catch (error) {
      console.error('Failed to update:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          共有
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>タイムテーブルを共有</DialogTitle>
          <DialogDescription>
            リンクを共有して、他の人にタイムテーブルを見てもらえます
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">共有リンク</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={copied}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600">コピーしました！</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">公開設定</label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">
                  {isPublic ? '公開中' : '非公開'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isPublic
                    ? 'リンクを知っている人は誰でも閲覧できます'
                    : 'あなただけが閲覧できます'}
                </div>
              </div>
              <Button
                variant={isPublic ? 'destructive' : 'default'}
                size="sm"
                onClick={handleTogglePublic}
                disabled={isUpdating}
              >
                {isUpdating
                  ? '更新中...'
                  : isPublic
                  ? '非公開にする'
                  : '公開する'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


