import { useState, useCallback } from 'react'
import { TimelineGenre } from '@/types/supabase'
import { BasicInfoFormData } from '@/lib/schemas/timeline'

export type WizardStep = 1 | 2 | 3

interface TimelineWizardState {
  step: WizardStep
  genre: TimelineGenre | null
  basicInfo: BasicInfoFormData | null
  events: Array<{
    id: string
    title: string
    description?: string
    start_time: string
    end_time: string
    location?: string
    customFields?: Array<{
      id: string
      label: string
      value: string
      type: 'text' | 'textarea' | 'datetime' | 'number' | 'select' | 'url' | 'email' | 'phone'
      options?: string[]
    }>
  }>
  items: Array<{
    id: string
    name: string
    description?: string
    quantity: number
    unit?: string
    category?: string
    is_required: boolean
  }>
}

const initialState: TimelineWizardState = {
  step: 1,
  genre: null,
  basicInfo: null,
  events: [],
  items: [],
}

export function useTimelineWizard() {
  const [state, setState] = useState<TimelineWizardState>(initialState)

  const setGenre = useCallback((genre: TimelineGenre) => {
    setState((prev) => ({
      ...prev,
      genre,
      step: 2,
    }))
  }, [])

  const setBasicInfo = useCallback((basicInfo: BasicInfoFormData) => {
    setState((prev) => ({
      ...prev,
      basicInfo,
      step: 3,
    }))
  }, [])

  const addEvent = useCallback(
    (event: TimelineWizardState['events'][0]) => {
      setState((prev) => ({
        ...prev,
        events: [...prev.events, event],
      }))
    },
    []
  )

  const updateEvent = useCallback(
    (id: string, event: Partial<TimelineWizardState['events'][0]>) => {
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
      }))
    },
    []
  )

  const removeEvent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }))
  }, [])

  const addItem = useCallback(
    (item: TimelineWizardState['items'][0]) => {
      setState((prev) => ({
        ...prev,
        items: [...prev.items, item],
      }))
    },
    []
  )

  const updateItem = useCallback(
    (id: string, item: Partial<TimelineWizardState['items'][0]>) => {
      setState((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i.id === id ? { ...i, ...item } : i)),
      }))
    },
    []
  )

  const removeItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }))
  }, [])

  const goToStep = useCallback((step: WizardStep) => {
    setState((prev) => ({
      ...prev,
      step,
    }))
  }, [])

  const goToNextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.min(3, prev.step + 1) as WizardStep,
    }))
  }, [])

  const goToPreviousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1) as WizardStep,
    }))
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return {
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
  }
}

