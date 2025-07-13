import React from 'react'
import WorkflowCreator from '@/components/workflow/WorkflowCreator'

export default function CreateWorkflowPage() {
  const handleWorkflowCreated = (workflow: any) => {
    console.log('Workflow criado:', workflow)
    // Aqui você pode adicionar lógica adicional, como notificações
  }

  const handleError = (error: string) => {
    console.error('Erro na criação do workflow:', error)
    // Aqui você pode adicionar lógica de logging ou notificações
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <WorkflowCreator 
          onWorkflowCreated={handleWorkflowCreated}
          onError={handleError}
        />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Criar Workflow | ABC Automation',
  description: 'Crie workflows automatizados com a ajuda de nossos agents inteligentes',
} 