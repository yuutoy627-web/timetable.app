'use client'

import { useTimelineWizard } from '@/lib/hooks/use-timeline-wizard'
import { Step1GenreSelection } from './step-1-genre-selection'
import { Step2BasicInfo } from './step-2-basic-info'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BasicInfoFormData } from '@/lib/schemas/timeline'

export function TimelineWizard() {
  const {
    state,
    setGenre,
    setBasicInfo,
    goToStep,
    goToNextStep,
    goToPreviousStep,
  } = useTimelineWizard()

  const progress = ((state.step - 1) / 3) * 100

  const handleGenreSelect = (genre: typeof state.genre) => {
    if (genre) {
      setGenre(genre)
    }
  }

  const handleBasicInfoSubmit = (data: BasicInfoFormData) => {
    setBasicInfo(data)
    goToNextStep()
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="p-6 md:p-8">
        {/* プログレスバー */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>ステップ {state.step} / 4</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* ステップコンテンツ */}
        <div className="min-h-[400px]">
          {state.step === 1 && (
            <Step1GenreSelection
              selectedGenre={state.genre}
              onGenreSelect={handleGenreSelect}
            />
          )}

          {state.step === 2 && state.genre && (
            <Step2BasicInfo
              genre={state.genre}
              initialData={state.basicInfo}
              onSubmit={handleBasicInfoSubmit}
              onBack={goToPreviousStep}
            />
          )}

          {state.step === 3 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Step 3: イベント追加（実装予定）</p>
            </div>
          )}

          {state.step === 4 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Step 4: 確認と保存（実装予定）</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}


