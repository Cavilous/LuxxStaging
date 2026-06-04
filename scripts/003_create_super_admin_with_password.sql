-- Create super admin user with password
-- Note: This should be run through Supabase's admin interface or using the admin API
-- For security, we'll create a temporary password that should be changed on first login

-- First, we need to create the auth user (this would typically be done via Supabase Admin API)
-- INSERT INTO auth.users (
--   id,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at,
--   raw_app_meta_data,
--   raw_user_meta_data,
--   is_super_admin,
--   role
-- ) VALUES (
--   gen_random_uuid(),
--   'luxxmiami@alhmedia.com',
--   crypt('LuxxMiami2024!', gen_salt('bf')), -- Temporary password: LuxxMiami2024!
--   NOW(),
--   NOW(),
--   NOW(),
--   '{"provider": "email", "providers": ["email"]}',
--   '{"email": "luxxmiami@alhmedia.com"}',
--   false,
--   'authenticated'
-- );

-- Create or update admin_users entry
INSERT INTO admin_users (
  id,
  email,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  -- We'll use a fixed UUID for the super admin for consistency
  '00000000-0000-0000-0000-000000000001',
  'luxxmiami@alhmedia.com',
  'super_admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  updated_at = NOW();

-- Log the admin user creation
INSERT INTO audit_logs (
  table_name,
  record_id,
  action,
  changes,
  admin_user_id,
  created_at
) VALUES (
  'admin_users',
  '00000000-0000-0000-0000-000000000001',
  'create',
  jsonb_build_object(
    'email', 'luxxmiami@alhmedia.com',
    'role', 'super_admin',
    'is_active', true,
    'note', 'Super admin created with temporary password'
  ),
  '00000000-0000-0000-0000-000000000001',
  NOW()
);
