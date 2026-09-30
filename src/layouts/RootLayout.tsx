import React from 'react'
import { Outlet } from 'react-router-dom'
import { Topbar } from '../components/layout/Topbar'

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Topbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
