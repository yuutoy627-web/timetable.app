-- 既存のユーザーに対してプロフィールを作成するSQL
-- このSQLは、トリガーが作成される前にログインしたユーザーに対してプロフィールを作成します

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

