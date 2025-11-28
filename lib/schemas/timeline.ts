import { z } from 'zod'
import { TimelineGenre, PAMetadata, MeetingMetadata, TravelMetadata, LifePlanMetadata } from '@/types/supabase'

/**
 * ジャンル選択のスキーマ
 */
export const genreSelectionSchema = z.object({
  genre: z.enum(['pa', 'meeting', 'travel', 'life_plan', 'other'] as const),
})

export type GenreSelectionFormData = z.infer<typeof genreSelectionSchema>

/**
 * 音響(PA)ジャンル用の基本情報スキーマ
 */
export const paBasicInfoSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  start_date: z.string().min(1, '開始日時は必須です'),
  end_date: z.string().min(1, '終了日時は必須です'),
  venue_name: z.string().min(1, '会場名は必須です'),
  venue_address: z.string().optional(),
  load_in_time: z.string().min(1, '搬入時間は必須です'),
  rehearsal_start_time: z.string().min(1, 'リハーサル開始時間は必須です'),
  performance_start_time: z.string().min(1, '本番開始時間は必須です'),
  load_out_time: z.string().optional(),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  notes: z.string().optional(),
})

export type PABasicInfoFormData = z.infer<typeof paBasicInfoSchema>

/**
 * 会議ジャンル用の基本情報スキーマ
 */
export const meetingBasicInfoSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  start_date: z.string().min(1, '開始日時は必須です'),
  end_date: z.string().min(1, '終了日時は必須です'),
  meeting_room: z.string().optional(),
  building_name: z.string().optional(),
  floor: z.string().optional(),
  capacity: z.number().optional(),
  contact_person: z.string().optional(),
  contact_email: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type MeetingBasicInfoFormData = z.infer<typeof meetingBasicInfoSchema>

/**
 * 旅行ジャンル用の基本情報スキーマ
 */
export const travelBasicInfoSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  start_date: z.string().min(1, '出発日時は必須です'),
  end_date: z.string().min(1, '帰着日時は必須です'),
  destination: z.string().min(1, '目的地は必須です'),
  accommodation_name: z.string().optional(),
  accommodation_address: z.string().optional(),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  departure_method: z.string().optional(),
  departure_time: z.string().optional(),
  departure_location: z.string().optional(),
  return_method: z.string().optional(),
  return_time: z.string().optional(),
  return_location: z.string().optional(),
  emergency_contact: z.string().optional(),
  notes: z.string().optional(),
})

export type TravelBasicInfoFormData = z.infer<typeof travelBasicInfoSchema>

/**
 * ライフプランジャンル用の基本情報スキーマ
 */
export const lifePlanBasicInfoSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  start_date: z.string().min(1, '開始日時は必須です'),
  end_date: z.string().min(1, '終了日時は必須です'),
  category: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']).optional(),
  budget: z.number().optional(),
  notes: z.string().optional(),
})

export type LifePlanBasicInfoFormData = z.infer<typeof lifePlanBasicInfoSchema>

/**
 * その他ジャンル用の基本情報スキーマ
 */
export const otherBasicInfoSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().optional(),
  start_date: z.string().min(1, '開始日時は必須です'),
  end_date: z.string().min(1, '終了日時は必須です'),
  notes: z.string().optional(),
})

export type OtherBasicInfoFormData = z.infer<typeof otherBasicInfoSchema>

/**
 * ジャンルに応じた基本情報スキーマの型
 */
export type BasicInfoFormData =
  | (PABasicInfoFormData & { genre: 'pa' })
  | (MeetingBasicInfoFormData & { genre: 'meeting' })
  | (TravelBasicInfoFormData & { genre: 'travel' })
  | (LifePlanBasicInfoFormData & { genre: 'life_plan' })
  | (OtherBasicInfoFormData & { genre: 'other' })

/**
 * ジャンルに応じたスキーマを取得するヘルパー関数
 */
export function getBasicInfoSchema(genre: TimelineGenre) {
  switch (genre) {
    case 'pa':
      return paBasicInfoSchema
    case 'meeting':
      return meetingBasicInfoSchema
    case 'travel':
      return travelBasicInfoSchema
    case 'life_plan':
      return lifePlanBasicInfoSchema
    case 'other':
      return otherBasicInfoSchema
    default:
      return otherBasicInfoSchema
  }
}

/**
 * 基本情報をメタデータに変換するヘルパー関数
 */
export function convertBasicInfoToMetadata(
  genre: TimelineGenre,
  data: BasicInfoFormData & { customFields?: Array<{ id: string; label: string; value: string; type: string }> }
): PAMetadata | MeetingMetadata | TravelMetadata | LifePlanMetadata | Record<string, unknown> {
  switch (genre) {
    case 'pa': {
      const paData = data as PABasicInfoFormData & { customFields?: Array<{ id: string; label: string; value: string; type: string; unit?: string; status?: string; assignee?: string }> }
      const metadata: any = {
        venue_name: paData.venue_name,
        venue_address: paData.venue_address,
        load_in_route: paData.load_in_time,
        contact_person: paData.contact_person,
        contact_phone: paData.contact_phone,
        notes: paData.notes,
      }
      // カスタムフィールドを追加
      if (paData.customFields && paData.customFields.length > 0) {
        metadata.customFields = paData.customFields.map((field) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          value: field.value,
          unit: field.unit,
          status: field.status,
          assignee: field.assignee,
        }))
      }
      return metadata as PAMetadata
    }
    case 'meeting': {
      const meetingData = data as MeetingBasicInfoFormData & { customFields?: Array<{ id: string; label: string; value: string; type: string; unit?: string; status?: string; assignee?: string }> }
      const metadata: any = {
        meeting_room: meetingData.meeting_room,
        building_name: meetingData.building_name,
        floor: meetingData.floor,
        capacity: meetingData.capacity,
        contact_person: meetingData.contact_person,
        contact_email: meetingData.contact_email,
        notes: meetingData.notes,
      }
      if (meetingData.customFields && meetingData.customFields.length > 0) {
        metadata.customFields = meetingData.customFields.map((field) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          value: field.value,
          unit: field.unit,
          status: field.status,
          assignee: field.assignee,
        }))
      }
      return metadata as MeetingMetadata
    }
    case 'travel': {
      const travelData = data as TravelBasicInfoFormData & { customFields?: Array<{ id: string; label: string; value: string; type: string; unit?: string; status?: string; assignee?: string }> }
      const metadata: any = {
        destination: travelData.destination,
        accommodation: {
          name: travelData.accommodation_name,
          address: travelData.accommodation_address,
          check_in: travelData.check_in,
          check_out: travelData.check_out,
        },
        transportation: {
          departure: {
            method: travelData.departure_method,
            time: travelData.departure_time,
            location: travelData.departure_location,
          },
          return: {
            method: travelData.return_method,
            time: travelData.return_time,
            location: travelData.return_location,
          },
        },
        emergency_contact: travelData.emergency_contact,
        notes: travelData.notes,
      }
      if (travelData.customFields && travelData.customFields.length > 0) {
        metadata.customFields = travelData.customFields.map((field) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          value: field.value,
          unit: field.unit,
          status: field.status,
          assignee: field.assignee,
        }))
      }
      return metadata as TravelMetadata
    }
    case 'life_plan': {
      const lifePlanData = data as LifePlanBasicInfoFormData & { customFields?: Array<{ id: string; label: string; value: string; type: string; unit?: string; status?: string; assignee?: string }> }
      const metadata: any = {
        category: lifePlanData.category,
        priority: lifePlanData.priority,
        budget: lifePlanData.budget,
        notes: lifePlanData.notes,
      }
      if (lifePlanData.customFields && lifePlanData.customFields.length > 0) {
        metadata.customFields = lifePlanData.customFields.map((field) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          value: field.value,
          unit: field.unit,
          status: field.status,
          assignee: field.assignee,
        }))
      }
      return metadata as LifePlanMetadata
    }
    default: {
      const otherData = data as OtherBasicInfoFormData & { customFields?: Array<{ id: string; label: string; value: string; type: string; unit?: string; status?: string; assignee?: string }> }
      const metadata: any = {
        notes: otherData.notes,
      }
      if (otherData.customFields && otherData.customFields.length > 0) {
        metadata.customFields = otherData.customFields.map((field) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          value: field.value,
          unit: field.unit,
          status: field.status,
          assignee: field.assignee,
        }))
      }
      return metadata
    }
  }
}

