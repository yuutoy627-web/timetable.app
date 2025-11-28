/**
 * Supabase Database Types
 * Generated types for the Universal Timeline Maker database schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type TimelineGenre = 'pa' | 'meeting' | 'travel' | 'life_plan' | 'other'

export type GroupMemberRole = 'owner' | 'admin' | 'member'

// ============================================
// Database Table Types
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: GroupMemberRole
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: GroupMemberRole
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: GroupMemberRole
          joined_at?: string
        }
      }
      timelines: {
        Row: {
          id: string
          title: string
          description: string | null
          genre: TimelineGenre
          start_date: string | null
          end_date: string | null
          metadata: Json
          created_by: string
          group_id: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          genre: TimelineGenre
          start_date?: string | null
          end_date?: string | null
          metadata?: Json
          created_by: string
          group_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          genre?: TimelineGenre
          start_date?: string | null
          end_date?: string | null
          metadata?: Json
          created_by?: string
          group_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      timeline_events: {
        Row: {
          id: string
          timeline_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          assignee_id: string | null
          order_index: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          timeline_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          location?: string | null
          assignee_id?: string | null
          order_index?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          timeline_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          location?: string | null
          assignee_id?: string | null
          order_index?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      timeline_items: {
        Row: {
          id: string
          timeline_id: string
          name: string
          description: string | null
          quantity: number
          unit: string | null
          category: string | null
          is_required: boolean
          assignee_id: string | null
          order_index: number
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          timeline_id: string
          name: string
          description?: string | null
          quantity?: number
          unit?: string | null
          category?: string | null
          is_required?: boolean
          assignee_id?: string | null
          order_index?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          timeline_id?: string
          name?: string
          description?: string | null
          quantity?: number
          unit?: string | null
          category?: string | null
          is_required?: boolean
          assignee_id?: string | null
          order_index?: number
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      timeline_genre: TimelineGenre
    }
  }
}

// ============================================
// Helper Types
// ============================================

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Group = Database['public']['Tables']['groups']['Row']
export type GroupInsert = Database['public']['Tables']['groups']['Insert']
export type GroupUpdate = Database['public']['Tables']['groups']['Update']

export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type GroupMemberInsert = Database['public']['Tables']['group_members']['Insert']
export type GroupMemberUpdate = Database['public']['Tables']['group_members']['Update']

export type Timeline = Database['public']['Tables']['timelines']['Row']
export type TimelineInsert = Database['public']['Tables']['timelines']['Insert']
export type TimelineUpdate = Database['public']['Tables']['timelines']['Update']

export type TimelineEvent = Database['public']['Tables']['timeline_events']['Row']
export type TimelineEventInsert = Database['public']['Tables']['timeline_events']['Insert']
export type TimelineEventUpdate = Database['public']['Tables']['timeline_events']['Update']

export type TimelineItem = Database['public']['Tables']['timeline_items']['Row']
export type TimelineItemInsert = Database['public']['Tables']['timeline_items']['Insert']
export type TimelineItemUpdate = Database['public']['Tables']['timeline_items']['Update']

// ============================================
// Genre-specific Metadata Types
// ============================================

/**
 * 音響(PA)ジャンル用のメタデータ
 */
export interface PAMetadata {
  venue_name?: string
  venue_address?: string
  load_in_route?: string
  load_out_route?: string
  contact_person?: string
  contact_phone?: string
  power_supply?: string
  stage_dimensions?: {
    width?: number
    depth?: number
    height?: number
  }
  notes?: string
}

/**
 * 会議ジャンル用のメタデータ
 */
export interface MeetingMetadata {
  meeting_room?: string
  building_name?: string
  floor?: string
  capacity?: number
  equipment_available?: string[]
  catering?: boolean
  contact_person?: string
  contact_email?: string
  notes?: string
}

/**
 * 旅行ジャンル用のメタデータ
 */
export interface TravelMetadata {
  destination?: string
  accommodation?: {
    name?: string
    address?: string
    check_in?: string
    check_out?: string
    contact?: string
  }
  transportation?: {
    departure?: {
      method?: string
      time?: string
      location?: string
    }
    return?: {
      method?: string
      time?: string
      location?: string
    }
  }
  emergency_contact?: string
  notes?: string
}

/**
 * ライフプランジャンル用のメタデータ
 */
export interface LifePlanMetadata {
  category?: string
  priority?: 'high' | 'medium' | 'low'
  related_people?: string[]
  budget?: number
  notes?: string
}

/**
 * タイムラインのメタデータの型（ジャンルに応じて）
 */
export type TimelineMetadata = 
  | PAMetadata 
  | MeetingMetadata 
  | TravelMetadata 
  | LifePlanMetadata 
  | Record<string, unknown>

// ============================================
// Extended Types with Relations
// ============================================

/**
 * タイムラインと関連データを含む拡張型
 */
export interface TimelineWithRelations extends Timeline {
  events?: TimelineEvent[]
  items?: TimelineItem[]
  created_by_profile?: Profile
  group?: Group | null
}

/**
 * タイムラインイベントと関連データを含む拡張型
 */
export interface TimelineEventWithRelations extends TimelineEvent {
  assignee?: Profile | null
  timeline?: Timeline
}

/**
 * タイムラインアイテムと関連データを含む拡張型
 */
export interface TimelineItemWithRelations extends TimelineItem {
  assignee?: Profile | null
  timeline?: Timeline
}

/**
 * グループとメンバーを含む拡張型
 */
export interface GroupWithMembers extends Group {
  members?: (GroupMember & { profile?: Profile })[]
  created_by_profile?: Profile
}

