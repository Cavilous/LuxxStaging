-- ============================================================
-- LUXX MIAMI - PRODUCTION ADMIN USER SETUP
-- ============================================================
-- Run this SQL script in your production database to create the admin user.
--
-- BEFORE RUNNING: Generate a bcrypt hash for your chosen password
-- using your application or a trusted tool, then replace the
-- placeholder below with the resulting hash.
--
--   Email: support@alhmedia.com
--
-- ⚠️  NEVER commit plaintext passwords to this file.
-- ⚠️  CHANGE THE PASSWORD AFTER FIRST LOGIN!
-- ============================================================

INSERT INTO admin_users (
  id,
  email,
  password_hash,
  name,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'support@alhmedia.com',
  '__REPLACE_WITH_BCRYPT_HASH__',
  'Super Admin',
  'super_admin',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Log the creation
INSERT INTO audit_logs (
  id,
  table_name,
  record_id,
  action,
  changes,
  admin_user_id,
  created_at
) 
SELECT 
  gen_random_uuid(),
  'admin_users',
  id,
  'create',
  jsonb_build_object(
    'email', 'support@alhmedia.com',
    'role', 'super_admin',
    'note', 'Admin user created for production deployment'
  ),
  id,
  NOW()
FROM admin_users
WHERE email = 'support@alhmedia.com';

-- ============================================================
-- ✅ Script complete! You can now login at /admin/login
-- ============================================================
