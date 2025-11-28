'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TimelineGenre } from '@/types/supabase'
import { Mic2, Users, Plane, Target, MoreHorizontal } from 'lucide-react'

interface GenreOption {
  value: TimelineGenre
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const genreOptions: GenreOption[] = [
  {
    value: 'pa',
    label: '音響(PA)',
    description: '音響機材のセットアップとタイムテーブル',
    icon: Mic2,
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  },
  {
    value: 'meeting',
    label: '会議',
    description: '会議や打ち合わせのスケジュール管理',
    icon: Users,
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  {
    value: 'travel',
    label: '旅行',
    description: '旅行のスケジュールと持ち物リスト',
    icon: Plane,
    color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  },
  {
    value: 'life_plan',
    label: 'ライフプラン',
    description: '人生設計や長期計画の管理',
    icon: Target,
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  },
  {
    value: 'other',
    label: 'その他',
    description: 'その他のタイムテーブル',
    icon: MoreHorizontal,
    color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  },
]

interface Step1GenreSelectionProps {
  selectedGenre: TimelineGenre | null
  onGenreSelect: (genre: TimelineGenre) => void
}

export function Step1GenreSelection({ selectedGenre, onGenreSelect }: Step1GenreSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">ジャンルを選択</h2>
        <p className="text-muted-foreground">
          タイムテーブルの種類を選択してください
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {genreOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedGenre === option.value

          return (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'ring-2 ring-primary'
                  : 'hover:border-primary/50'
              } ${option.color}`}
              onClick={() => onGenreSelect(option.value)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${option.color.split(' ')[0]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{option.label}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {option.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {selectedGenre && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => onGenreSelect(selectedGenre)}
            size="lg"
            className="min-w-[200px]"
          >
            次へ進む
          </Button>
        </div>
      )}
    </div>
  )
}


