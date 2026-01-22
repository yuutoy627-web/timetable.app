import { redirect } from 'next/navigation'
import { getUser } from '@/lib/actions/auth'
import { AdminContent } from '@/components/admin/admin-content'

export default async function AdminPage() {
  const user = await getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">管理画面</h1>
          <p className="text-muted-foreground">
            データベース管理ツール
          </p>
        </div>
        <AdminContent />
      </div>
    </main>
  )
}










