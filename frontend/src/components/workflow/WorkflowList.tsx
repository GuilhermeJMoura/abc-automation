'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getAllWorkflows } from '@/services/api'
import type { WorkflowResponse } from '@/services/api'
import Link from 'next/link'

interface WorkflowListProps {
  onWorkflowSelect?: (workflow: WorkflowResponse) => void
}

export const WorkflowList: React.FC<WorkflowListProps> = ({ onWorkflowSelect }) => {
  const [workflows, setWorkflows] = useState<WorkflowResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAllWorkflows()
      setWorkflows(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar workflows')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadWorkflows()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando workflows...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 mb-2">{error}</p>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Meus Workflows</h2>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            🔄 Atualizar
          </Button>
          <Link href="/workflows/create">
            <Button>
              + Criar Novo
            </Button>
          </Link>
        </div>
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum workflow encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            Crie seu primeiro workflow para começar a automatizar suas tarefas.
          </p>
          <Link href="/workflows/create">
            <Button>
              Criar Primeiro Workflow
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onSelect={onWorkflowSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface WorkflowCardProps {
  workflow: WorkflowResponse
  onSelect?: (workflow: WorkflowResponse) => void
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, onSelect }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (active: boolean) => {
    return active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (active: boolean) => {
    return active ? '✅' : '⏸️'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg truncate">
          {workflow.name}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.active)}`}>
          {getStatusIcon(workflow.active)} {workflow.active ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Nós:</span> {workflow.nodes?.length || 0}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Criado:</span> {formatDate(workflow.createdAt)}
        </div>
        {workflow.updatedAt !== workflow.createdAt && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Atualizado:</span> {formatDate(workflow.updatedAt)}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Link href={`/workflows/${workflow.id}`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">
            Ver Detalhes
          </Button>
        </Link>
        {onSelect && (
          <Button
            onClick={() => onSelect(workflow)}
            size="sm"
            className="flex-1"
          >
            Selecionar
          </Button>
        )}
      </div>
    </div>
  )
}

export default WorkflowList 