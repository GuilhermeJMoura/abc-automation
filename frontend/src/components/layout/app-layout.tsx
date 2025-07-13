'use client'

import { ReactNode } from 'react'
import Sidebar from './sidebar'
import TopBar from './topbar'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="bg-landing min-h-screen [&_*]:font-suisse">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <TopBar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 