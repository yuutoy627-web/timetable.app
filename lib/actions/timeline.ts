'use server'

import { createClient } from '@/lib/supabase/server'
import { TimelineInsert, TimelineEventInsert, TimelineItemInsert } from '@/types/supabase'
import { convertBasicInfoToMetadata } from '@/lib/schemas/timeline'
import { revalidatePath } from 'next/cache'

export async function createTimeline(
  timeline: Omit<TimelineInsert, 'created_by' | 'metadata'>,
  basicInfo: any,
  events: Omit<TimelineEventInsert, 'timeline_id' | 'id'>[],
  items: Omit<TimelineItemInsert, 'timeline_id' | 'id'>[]
) {
  const supabase = await createClient()

  // ユーザー認証確認
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: '認証が必要です' }
  }

  // プロフィールが存在するか確認し、存在しない場合は作成
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    // プロフィールが存在しない場合は作成
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email || 'User',
        avatar_url: user.user_metadata?.avatar_url || null,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return { error: 'プロフィールの作成に失敗しました' }
    }
  }

  // メタデータの変換
  let metadata
  try {
    metadata = convertBasicInfoToMetadata(timeline.genre, basicInfo)
  } catch (error) {
    console.error('Metadata conversion error:', error)
    return { error: `メタデータの変換に失敗しました: ${error instanceof Error ? error.message : String(error)}`, data: null }
  }

  // タイムラインの作成
  const { data: timelineData, error: timelineError } = await supabase
    .from('timelines')
    .insert({
      ...timeline,
      created_by: user.id,
      metadata: metadata || {},
    })
    .select()
    .single()

  if (timelineError || !timelineData) {
    console.error('Timeline creation error:', timelineError)
    return { error: timelineError?.message || 'タイムラインの作成に失敗しました', data: null }
  }

  // イベントの作成
  if (events.length > 0) {
    const eventsToInsert: TimelineEventInsert[] = events.map((event, index) => {
      // カスタムフィールドをmetadataに変換
      const eventMetadata: any = {}
      if ((event as any).customFields && Array.isArray((event as any).customFields)) {
        (event as any).customFields.forEach((field: any) => {
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
        title: event.title,
        description: event.description || null,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location || null,
        timeline_id: timelineData.id,
        order_index: index,
        assignee_id: null,
        metadata: Object.keys(eventMetadata).length > 0 ? eventMetadata : {},
      }
    })

    const { error: eventsError } = await supabase
      .from('timeline_events')
      .insert(eventsToInsert)

    if (eventsError) {
      // タイムラインは作成済みなので、エラーを返すがタイムラインは残す
      console.error('Events creation error:', eventsError)
      return { error: `イベントの作成に失敗しました: ${eventsError.message}`, data: timelineData }
    }
  }

  // アイテムの作成
  if (items.length > 0) {
    const itemsToInsert: TimelineItemInsert[] = items.map((item, index) => ({
      ...item,
      timeline_id: timelineData.id,
      order_index: index,
    }))

    const { error: itemsError } = await supabase
      .from('timeline_items')
      .insert(itemsToInsert)

    if (itemsError) {
      console.error('Items creation error:', itemsError)
      // アイテムのエラーは警告のみ（タイムラインとイベントは作成済み）
    }
  }

  revalidatePath('/dashboard')
  return { data: timelineData, error: null }
}

export async function getTimelines(genre?: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: [], error: null }
  }

  let query = supabase
    .from('timelines')
    .select('*')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  if (genre) {
    query = query.eq('genre', genre)
  }

  const { data, error } = await query

  return { data: data || [], error }
}

export async function getTimeline(id: string, requireAuth = false) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 認証が必要な場合のみチェック
  if (requireAuth && !user) {
    return { data: null, error: '認証が必要です' }
  }

  // タイムラインを取得（公開されているか、作成者であるか、グループメンバーであるか）
  let query = supabase
    .from('timelines')
    .select('*')
    .eq('id', id)

  // 認証されていない場合は公開タイムラインのみ
  if (!user) {
    query = query.eq('is_public', true)
  } else {
    // 認証されている場合は、自分のもの、公開されているもの、グループのものを取得
    query = query.or(`created_by.eq.${user.id},is_public.eq.true`)
  }

  const { data: timeline, error: timelineError } = await query.single()

  if (timelineError || !timeline) {
    return { data: null, error: timelineError?.message || 'タイムラインが見つかりません' }
  }

  // イベントとアイテムを取得
  const { data: events } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('timeline_id', id)
    .order('order_index', { ascending: true })

  const { data: items } = await supabase
    .from('timeline_items')
    .select('*')
    .eq('timeline_id', id)
    .order('order_index', { ascending: true })

  return {
    data: {
      ...timeline,
      events: events || [],
      items: items || [],
    },
    error: null,
  }
}

export async function toggleTimelinePublic(id: string, isPublic: boolean) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: '認証が必要です' }
  }

  const { data, error } = await supabase
    .from('timelines')
    .update({ is_public: isPublic })
    .eq('id', id)
    .eq('created_by', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/timelines/${id}`)
  revalidatePath('/dashboard')
  return { data, error: null }
}

export async function deleteTimeline(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: '認証が必要です' }
  }

  // タイムラインが存在し、ユーザーが所有者であることを確認
  const { data: timeline, error: fetchError } = await supabase
    .from('timelines')
    .select('id, created_by')
    .eq('id', id)
    .single()

  if (fetchError || !timeline) {
    return { error: 'タイムラインが見つかりません' }
  }

  if (timeline.created_by !== user.id) {
    return { error: 'このタイムラインを削除する権限がありません' }
  }

  // タイムラインを削除（関連するイベントとアイテムはCASCADEで自動削除）
  const { error: deleteError } = await supabase
    .from('timelines')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return { error: deleteError.message || 'タイムラインの削除に失敗しました' }
  }

  revalidatePath('/dashboard')
  return { success: true, error: null }
}

