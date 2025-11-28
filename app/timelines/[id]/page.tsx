import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'
import { getTimeline } from '@/lib/actions/timeline'
import { TimelineDetailView } from '@/components/timeline/timeline-detail-view'

export default async function TimelineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUser()

  // 認証不要でタイムラインを取得（公開されている場合は誰でも見れる）
  const { data: timeline, error } = await getTimeline(id, false)

  if (error || !timeline) {
    // 認証が必要な場合はログインページへ、それ以外は404
    if (error === '認証が必要です') {
      redirect('/')
    }
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <TimelineDetailView timeline={timeline} user={user} />
      </div>
    </main>
  )
}

