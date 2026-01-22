-- 既存のユーザーに対してプロフィールを作成するPostgreSQL関数
-- この関数は、トリガーが作成される前にログインしたユーザーに対してプロフィールを作成します
-- 
-- 使用方法:
-- 1. SupabaseダッシュボードのSQL EditorでこのSQLを実行
-- 2. アプリケーションの管理ページから実行可能になります

CREATE OR REPLACE FUNCTION public.fix_existing_users_profiles()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  created_count INTEGER;
BEGIN
  -- 既存のauth.usersにプロフィールが存在しないユーザーに対してプロフィールを作成
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email, 'User'),
    u.raw_user_meta_data->>'avatar_url'
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  WHERE p.id IS NULL
  ON CONFLICT (id) DO NOTHING;
  
  GET DIAGNOSTICS created_count = ROW_COUNT;
  RETURN created_count;
END;
$$;

-- 関数の実行権限を付与
GRANT EXECUTE ON FUNCTION public.fix_existing_users_profiles() TO authenticated;






