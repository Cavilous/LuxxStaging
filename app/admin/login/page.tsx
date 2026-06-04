"use client"

import dynamic from 'next/dynamic'

const AdminLoginContent = dynamic(
  () => import(/* webpackChunkName: "admin-login" */ './login-content'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    )
  }
)

export default function AdminLoginPage() {
  return <AdminLoginContent />
}