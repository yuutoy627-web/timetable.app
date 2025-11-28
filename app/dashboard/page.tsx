import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'
import { getTimelines } from '@/lib/actions/timeline'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/')
  }

  const { data: timelines } = await getTimelines()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">ダッシュボード</h1>
          <p className="text-muted-foreground">
            作成したタイムテーブルを管理・確認できます
          </p>
        </div>
        <DashboardContent timelines={timelines || []} />
      </div>
    </main>
  )
}


