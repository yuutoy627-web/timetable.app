-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- ============================================
-- Users (profiles table - extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies (既存のポリシーを削除してから作成)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- Groups (for sharing timelines)
-- ============================================
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Groups policies (既存のポリシーを削除してから作成)
DROP POLICY IF EXISTS "Users can view groups they belong to" ON public.groups;
DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
DROP POLICY IF EXISTS "Group creators can update groups" ON public.groups;
DROP POLICY IF EXISTS "Group creators can delete groups" ON public.groups;

-- Groups policies (group_members参照なしの基本ポリシー)
CREATE POLICY "Users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update groups"
  ON public.groups FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Group creators can delete groups"
  ON public.groups FOR DELETE
  USING (created_by = auth.uid());

-- ============================================
-- Group Members (many-to-many relationship)
-- ============================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(group_id, user_id)
);

-- Enable RLS on group_members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Group members policies (既存のポリシーを削除してから作成)
DROP POLICY IF EXISTS "Users can view members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Group owners can add members" ON public.group_members;
DROP POLICY IF EXISTS "Group owners can update members" ON public.group_members;
DROP POLICY IF EXISTS "Group owners can remove members" ON public.group_members;

-- Group members policies
-- 注意: group_membersテーブル自体への参照は無限再帰を引き起こすため、groupsテーブルのcreated_byのみを使用
CREATE POLICY "Users can view members of their groups"
  ON public.group_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    group_id IN (
      SELECT id FROM public.groups
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Group owners can add members"
  ON public.group_members FOR INSERT
  WITH CHECK (
    group_id IN (
      SELECT id FROM public.groups
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Group owners can update members"
  ON public.group_members FOR UPDATE
  USING (
    group_id IN (
      SELECT id FROM public.groups
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Group owners can remove members"
  ON public.group_members FOR DELETE
  USING (
    group_id IN (
      SELECT id FROM public.groups
      WHERE created_by = auth.uid()
    )
  );

-- Groups policies (group_members参照ありのポリシー - group_members作成後に追加)
-- 注意: group_members参照を削除して無限再帰を回避
-- 既にDROP POLICYで削除済みなので、ここで作成
CREATE POLICY "Users can view groups they belong to"
  ON public.groups FOR SELECT
  USING (
    created_by = auth.uid()
    -- 注意: group_members参照を削除して無限再帰を回避
  );

-- ============================================
-- Timelines
-- ============================================
-- 既存のテーブルと型を削除してから作成
-- 注意: CASCADEで関連テーブルも削除されるため、先にテーブルを削除
DROP TABLE IF EXISTS public.timeline_items CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.timelines CASCADE;
DROP TYPE IF EXISTS timeline_genre CASCADE;

CREATE TYPE timeline_genre AS ENUM (
  'pa',           -- 音響(PA)
  'meeting',      -- 会議
  'travel',       -- 旅行
  'life_plan',    -- ライフプラン
  'other'         -- その他
);

CREATE TABLE public.timelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  genre timeline_genre NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb, -- ジャンル特有のデータ（会場名、搬入経路、宿泊先情報など）
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on timelines
ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;

-- Timelines policies (既存のポリシーを削除してから作成)
DROP POLICY IF EXISTS "Users can view their own timelines" ON public.timelines;
DROP POLICY IF EXISTS "Users can create timelines" ON public.timelines;
DROP POLICY IF EXISTS "Users can update their own timelines" ON public.timelines;
DROP POLICY IF EXISTS "Users can delete their own timelines" ON public.timelines;

-- Timelines policies
CREATE POLICY "Users can view their own timelines"
  ON public.timelines FOR SELECT
  USING (
    created_by = auth.uid() OR
    is_public = true
    -- 注意: group_members参照を削除して無限再帰を回避
  );

CREATE POLICY "Users can create timelines"
  ON public.timelines FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own timelines"
  ON public.timelines FOR UPDATE
  USING (
    created_by = auth.uid()
    -- 注意: group_members参照を削除して無限再帰を回避
    -- グループ機能が必要な場合は、別の方法で実装する必要があります
  );

CREATE POLICY "Users can delete their own timelines"
  ON public.timelines FOR DELETE
  USING (
    created_by = auth.uid() OR
    group_id IN (
      SELECT id FROM public.groups
      WHERE created_by = auth.uid()
    )
  );

-- ============================================
-- Timeline Events (時間枠とアクション)
-- ============================================
CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timeline_id UUID REFERENCES public.timelines(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0, -- 表示順序
  metadata JSONB DEFAULT '{}'::jsonb, -- イベント固有の追加データ
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Enable RLS on timeline_events
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

-- Timeline events policies (既存のポリシーを削除してから作成)
DROP POLICY IF EXISTS "Users can view events of accessible timelines" ON public.timeline_events;
DROP POLICY IF EXISTS "Users can create events in their timelines" ON public.timeline_events;
DROP POLICY IF EXISTS "Users can update events in their timelines" ON public.timeline_events;
DROP POLICY IF EXISTS "Users can delete events in their timelines" ON public.timeline_events;

-- Timeline events policies (timelineへのアクセス権限に依存)
-- 注意: group_members参照を削除して無限再帰を回避
CREATE POLICY "Users can view events of accessible timelines"
  ON public.timeline_events FOR SELECT
  USING (
    timeline_id IN (
      SELECT id FROM public.timelines
      WHERE created_by = auth.uid() OR is_public = true
    )
  );

CREATE POLICY "Users can create events in their timelines"
  ON public.timeline_events FOR INSERT
  WITH CHECK (
    timeline_id IN (
      SELECT id FROM public.timelines
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update events in their timelines"
  ON public.timeline_events FOR UPDATE
  USING (
    timeline_id IN (
      SELECT id FROM public.timelines
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete events in their timelines"
  ON public.timeline_events FOR DELETE
  USING (
    timeline_id IN (
      SELECT id FROM public.timelines
      WHERE created_by = auth.uid()
    )
  );

-- ============================================
-- Timeline Items (持ち物・機材リスト)
-- ============================================
CREATE TABLE public.timeline_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timeline_id UUID REFERENCES public.timelines(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  unit TEXT, -- 単位（本、個、セットなど）
  category TEXT, -- カテゴリ（機材、持ち物、書類など）
  is_required BOOLEAN DEFAULT true,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_index INTEGER DEFAULT 0, -- 表示順序
  metadata JSONB DEFAULT '{}'::jsonb, -- アイテム固有の追加データ（型番、サイズなど）
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on timeline_items
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;

-- Timeline items policies (既存のポリシーを削除してから作成)
DROP POLICY IF EXISTS "Users can view items of accessible timelines" ON public.timeline_items;
DROP POLICY IF EXISTS "Users can create items in their timelines" ON public.timeline_items;
DROP POLICY IF EXISTS "Users can update items in their timelines" ON public.timeline_items;
DROP POLICY IF EXISTS "Users can delete items in their timelines" ON public.timeline_items;

-- Timeline items policies (timelineへのアクセス権限に依存)
CREATE POLICY "Users can view items of accessible timelines"
  ON public.timeline_items FOR SELECT
  USING (
    timeline_id IN (
      SELECT id FROM public.timelines
      WHERE created_by = auth.uid() OR is_public = true
    )
  );

CREATE POLICY "Users can create items in their timelines"
  ON public.timeline_items FOR INSERT
  WITH CHECK (
    timeline_id IN (
      SELECT id FROM public.timelines
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update items in their timelines"
  ON public.timeline_items FOR UPDATE
  USING (
    timeline_id IN (
      SELECT id FROM public.timelines
      WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete items in their timelines"
  ON public.timeline_items FOR DELETE
  USING (
    timeline_id IN (
      SELECT id FROM public.timelines
      WHERE created_by = auth.uid()
    )
  );

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_timelines_created_by ON public.timelines(created_by);
CREATE INDEX IF NOT EXISTS idx_timelines_group_id ON public.timelines(group_id);
CREATE INDEX IF NOT EXISTS idx_timelines_genre ON public.timelines(genre);
CREATE INDEX IF NOT EXISTS idx_timelines_start_date ON public.timelines(start_date);
CREATE INDEX IF NOT EXISTS idx_timeline_events_timeline_id ON public.timeline_events(timeline_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_start_time ON public.timeline_events(start_time);
CREATE INDEX IF NOT EXISTS idx_timeline_items_timeline_id ON public.timeline_items(timeline_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);

-- ============================================
-- Functions for updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at (既存のトリガーを削除してから作成)
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS set_updated_at_groups ON public.groups;
DROP TRIGGER IF EXISTS set_updated_at_timelines ON public.timelines;
DROP TRIGGER IF EXISTS set_updated_at_timeline_events ON public.timeline_events;
DROP TRIGGER IF EXISTS set_updated_at_timeline_items ON public.timeline_items;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_groups
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_timelines
  BEFORE UPDATE ON public.timelines
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_timeline_events
  BEFORE UPDATE ON public.timeline_events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_timeline_items
  BEFORE UPDATE ON public.timeline_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Function to automatically create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation (既存のトリガーを削除してから作成)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

