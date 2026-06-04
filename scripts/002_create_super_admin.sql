-- Create super admin user for CMS
INSERT INTO admin_users (
  email,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
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
  (SELECT id FROM admin_users WHERE email = 'luxxmiami@alhmedia.com'),
  'create',
  jsonb_build_object(
    'email', 'luxxmiami@alhmedia.com',
    'role', 'super_admin',
    'is_active', true
  ),
  (SELECT id FROM admin_users WHERE email = 'luxxmiami@alhmedia.com'),
  NOW()
);
