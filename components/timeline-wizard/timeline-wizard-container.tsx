'use client'

import { useRouter } from 'next/navigation'
import { useTimelineWizard } from '@/lib/hooks/use-timeline-wizard'
import { Step1GenreSelection } from './step-1-genre-selection'
import { Step2BasicInfo } from './step-2-basic-info'
import { Step3Events } from './step-3-events'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BasicInfoFormData } from '@/lib/schemas/timeline'
import { createTimeline } from '@/lib/actions/timeline'
import { useState } from 'react'
import { convertBasicInfoToMetadata } from '@/lib/schemas/timeline'

export function TimelineWizardContainer() {
  const router = useRouter()
  const {
    state,
    setGenre,
    setBasicInfo,
    addEvent,
    updateEvent,
    removeEvent,
    addItem,
    updateItem,
    removeItem,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    reset,
  } = useTimelineWizard()

  const [isSaving, setIsSaving] = useState(false)

  const progress = ((state.step - 1) / 2) * 100

  const handleGenreSelect = (genre: typeof state.genre) => {
    if (genre) {
      setGenre(genre)
    }
  }

  const handleBasicInfoSubmit = (data: BasicInfoFormData) => {
    setBasicInfo(data)
    goToNextStep()
  }

  const handleSave = async () => {
    if (!state.genre || !state.basicInfo) {
      return
    }

    setIsSaving(true)

    try {
      const metadata = convertBasicInfoToMetadata(state.genre, state.basicInfo)

      const { data, error } = await createTimeline(
        {
          title: state.basicInfo.title,
          description: state.basicInfo.description || null,
          genre: state.genre,
          start_date: state.basicInfo.start_date || null,
          end_date: state.basicInfo.end_date || null,
          metadata,
          group_id: null,
          is_public: false,
        },
        state.basicInfo,
        state.events.map((e) => {
          // イベントのカスタムフィールドをmetadataに変換
          const eventMetadata: any = {}
          if (e.customFields && Array.isArray(e.customFields)) {
            e.customFields.forEach((field: any) => {
              if (field.label && field.value) {
                eventMetadata[field.label] = {
                  value: field.value,
                  type: field.type,
                  options: field.options,
                }
              }
            })
          }

          return {
            title: e.title,
            description: e.description || null,
            start_time: e.start_time,
            end_time: e.end_time,
            location: e.location || null,
            assignee_id: null,
            metadata: Object.keys(eventMetadata).length > 0 ? eventMetadata : {},
          }
        }),
        state.items.map((i) => ({
          name: i.name,
          description: i.description || null,
          quantity: i.quantity,
          unit: i.unit || null,
          category: i.category || null,
          is_required: i.is_required,
          assignee_id: null,
          metadata: {},
        }))
      )

      if (error) {
        console.error('Timeline creation error:', error)
        alert(`保存に失敗しました: ${error}`)
        setIsSaving(false)
        return
      }

      // 成功したらダッシュボードにリダイレクト
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('Save error:', error)
      const errorMessage = error?.message || error?.toString() || '保存中にエラーが発生しました'
      alert(`保存に失敗しました: ${errorMessage}`)
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="p-6 md:p-8">
        {/* プログレスバー */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>ステップ {state.step} / 3</span>
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

          {state.step === 3 && state.genre && state.basicInfo && (
            <Step3Events
              events={state.events}
              onAddEvent={addEvent}
              onUpdateEvent={updateEvent}
              onRemoveEvent={removeEvent}
              onBack={goToPreviousStep}
              onSave={handleSave}
              isSaving={isSaving}
              genre={state.genre}
              basicInfo={state.basicInfo}
              items={state.items}
            />
          )}
        </div>
      </Card>
    </div>
  )
}

