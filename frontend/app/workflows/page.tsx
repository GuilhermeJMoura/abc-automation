import React from 'react'
import WorkflowList from '@/components/workflow/WorkflowList'

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <WorkflowList />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Workflows | ABC Automation',
  description: 'Gerencie seus workflows automatizados',
} 