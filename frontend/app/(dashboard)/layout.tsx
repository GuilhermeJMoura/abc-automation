'use client'

import AppLayout from '@/components/layout/app-layout'
import QueryProvider from '@/providers/query-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <AppLayout>
        {children}
      </AppLayout>
    </QueryProvider>
  )
} 