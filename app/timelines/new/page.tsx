import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'
import { TimelineWizardContainer } from '@/components/timeline-wizard/timeline-wizard-container'

export default async function NewTimelinePage() {
  const user = await getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">新しいタイムテーブルを作成</h1>
          <p className="text-muted-foreground">
            ウィザード形式でタイムテーブルを作成します
          </p>
        </div>
        <TimelineWizardContainer />
      </div>
    </main>
  )
}


