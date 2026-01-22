import { AuthButton } from '@/components/auth/auth-button'
import { getUser } from '@/lib/actions/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Settings } from 'lucide-react'

export async function Header() {
  let user = null
  try {
    user = await getUser()
  } catch (error) {
    console.error('Failed to get user in header:', error)
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="font-bold">Universal Timeline Maker</span>
          </Link>
          {user && (
            <nav className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  ダッシュボード
                </Button>
              </Link>
              <Link href="/timelines/new">
                <Button variant="ghost" size="sm">
                  新規作成
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  管理
                </Button>
              </Link>
            </nav>
          )}
        </div>
        <AuthButton user={user} />
      </div>
    </header>
  )
}

