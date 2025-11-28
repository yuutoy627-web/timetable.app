'use client'

import { Button } from '@/components/ui/button'
import { signInWithGoogle, signOut } from '@/lib/actions/auth'
import { LogIn, LogOut, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AuthButtonProps {
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  } | null
}

export function AuthButton({ user }: AuthButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await signInWithGoogle()
      if (error) {
        console.error('Sign in error:', error)
      } else if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name || user.email || 'User'}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
          )}
          <span className="text-sm font-medium">
            {user.user_metadata?.full_name || user.email}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          ログアウト
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleSignIn} disabled={isLoading}>
      <LogIn className="mr-2 h-4 w-4" />
      Googleでログイン
    </Button>
  )
}


