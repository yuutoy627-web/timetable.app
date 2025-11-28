import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'
import { HomeContent } from '@/components/home/home-content'

export default async function Home() {
  let user = null
  try {
    user = await getUser()
  } catch (error) {
    console.error('Failed to get user:', error)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Universal Timeline Maker</h1>
          <p className="text-muted-foreground">
            タイムテーブルと持ち物リストを一元管理
          </p>
        </div>
        <HomeContent user={user} />
      </div>
    </main>
  )
}

