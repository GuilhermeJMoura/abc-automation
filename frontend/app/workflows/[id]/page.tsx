'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getWorkflow } from '@/services/api'
import type { WorkflowResponse } from '@/services/api'
import Link from 'next/link'

export default function WorkflowDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadWorkflow(id)
    }
  }, [id])

  const loadWorkflow = async (workflowId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getWorkflow(workflowId)
      setWorkflow(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar workflow')
    } finally {
      setIsLoading(false)
    }
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center p-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Carregando workflow...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 mb-2">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => loadWorkflow(id)} variant="outline" size="sm">
                Tentar novamente
              </Button>
              <Link href="/workflows">
                <Button variant="outline" size="sm">
                  Voltar para lista
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Workflow não encontrado
            </h3>
            <Link href="/workflows">
              <Button>
                Voltar para lista
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/workflows">
            <Button variant="outline" size="sm">
              ← Voltar para lista
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {workflow.name}
              </h1>
              <p className="text-gray-600">ID: {workflow.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(workflow.active)}`}>
              {getStatusIcon(workflow.active)} {workflow.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Informações Gerais</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Nós:</span> {workflow.nodes?.length || 0}
                </div>
                <div>
                  <span className="font-medium">Criado:</span> {formatDate(workflow.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Atualizado:</span> {formatDate(workflow.updatedAt)}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Ações</h3>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  {workflow.active ? '⏸️ Pausar' : '▶️ Ativar'} Workflow
                </Button>
                <Button className="w-full" variant="outline">
                  ✏️ Editar Workflow
                </Button>
                <Button className="w-full" variant="outline">
                  📊 Ver Execuções
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-4">Estrutura do Workflow</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Nós ({workflow.nodes?.length || 0})</h4>
              {workflow.nodes && workflow.nodes.length > 0 ? (
                <div className="space-y-2">
                  {workflow.nodes.map((node: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{node.name || `Nó ${index + 1}`}</p>
                          <p className="text-sm text-gray-600">{node.type}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {node.typeVersion || 'v1'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum nó encontrado</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Conexões</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {workflow.connections && Object.keys(workflow.connections).length > 0 ? (
                <pre className="text-sm text-gray-700 overflow-auto">
                  {JSON.stringify(workflow.connections, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma conexão encontrada</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 