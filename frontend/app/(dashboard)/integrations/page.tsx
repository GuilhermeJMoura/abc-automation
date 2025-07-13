'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useIntegrations, useCreateIntegration } from '@/hooks/use-api'

interface IntegrationFormData {
  name: string
  provider: string
  type: 'OAuth' | 'API Key'
  apiKey?: string
  clientId?: string
  clientSecret?: string
}

export default function IntegrationsPage() {
  const { data: integrations, isLoading } = useIntegrations()
  const createIntegration = useCreateIntegration()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<IntegrationFormData>({
    name: '',
    provider: '',
    type: 'API Key'
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'disconnected':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-landing-text" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado'
      case 'error': return 'Erro'
      case 'disconnected': return 'Desconectado'
      default: return 'Desconhecido'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createIntegration.mutateAsync(formData)
      setShowModal(false)
      setFormData({ name: '', provider: '', type: 'API Key' })
    } catch (error) {
      console.error('Error creating integration:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-landing-title">Integrações</h2>
          <p className="text-landing-text mt-1">Gerencie suas credenciais e conexões com APIs externas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-landing-highlight text-black px-4 py-2 rounded-lg font-medium hover:bg-landing-highlight/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nova Integração
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-landing-tertiary border border-landing-border rounded-xl backdrop-blur-md overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-landing-border rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-1/3 h-4 bg-landing-border rounded"></div>
                    <div className="w-1/4 h-3 bg-landing-border rounded"></div>
                  </div>
                  <div className="w-20 h-4 bg-landing-border rounded"></div>
                  <div className="w-16 h-8 bg-landing-border rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-landing-border">
              <tr>
                <th className="text-left p-4 text-landing-title font-semibold">Nome</th>
                <th className="text-left p-4 text-landing-title font-semibold">Provedor</th>
                <th className="text-left p-4 text-landing-title font-semibold">Tipo</th>
                <th className="text-left p-4 text-landing-title font-semibold">Status</th>
                <th className="text-left p-4 text-landing-title font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {integrations?.map((integration) => (
                <tr key={integration.id} className="border-b border-landing-border/50">
                  <td className="p-4">
                    <div className="font-medium text-landing-title">{integration.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-landing-border rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-landing-highlight">
                          {integration.provider.charAt(0)}
                        </span>
                      </div>
                      <span className="text-landing-text">{integration.provider}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-landing-text">{integration.type}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(integration.status)}
                      <span className="text-sm text-landing-text">
                        {getStatusText(integration.status)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-landing-text hover:text-landing-highlight transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-landing-text hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-landing-tertiary border border-landing-border rounded-xl p-6 w-full max-w-md mx-4 backdrop-blur-md">
            <h3 className="text-xl font-semibold text-landing-title mb-4">Nova Integração</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-landing-title mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-landing-border border border-landing-border rounded-lg text-landing-title focus:outline-none focus:border-landing-highlight/50"
                  placeholder="Nome da integração"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-landing-title mb-2">Provedor</label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-3 py-2 bg-landing-border border border-landing-border rounded-lg text-landing-title focus:outline-none focus:border-landing-highlight/50"
                  placeholder="Ex: BTG, B3, CVM"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-landing-title mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'OAuth' | 'API Key' })}
                  className="w-full px-3 py-2 bg-landing-border border border-landing-border rounded-lg text-landing-title focus:outline-none focus:border-landing-highlight/50"
                >
                  <option value="API Key">API Key</option>
                  <option value="OAuth">OAuth</option>
                </select>
              </div>

              {formData.type === 'API Key' && (
                <div>
                  <label className="block text-sm font-medium text-landing-title mb-2">API Key</label>
                  <input
                    type="password"
                    value={formData.apiKey || ''}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full px-3 py-2 bg-landing-border border border-landing-border rounded-lg text-landing-title focus:outline-none focus:border-landing-highlight/50"
                    placeholder="Sua API key"
                  />
                </div>
              )}

              {formData.type === 'OAuth' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-landing-title mb-2">Client ID</label>
                    <input
                      type="text"
                      value={formData.clientId || ''}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="w-full px-3 py-2 bg-landing-border border border-landing-border rounded-lg text-landing-title focus:outline-none focus:border-landing-highlight/50"
                      placeholder="Client ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-landing-title mb-2">Client Secret</label>
                    <input
                      type="password"
                      value={formData.clientSecret || ''}
                      onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                      className="w-full px-3 py-2 bg-landing-border border border-landing-border rounded-lg text-landing-title focus:outline-none focus:border-landing-highlight/50"
                      placeholder="Client Secret"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 px-4 border border-landing-border rounded-lg text-landing-text hover:bg-landing-border/50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createIntegration.isPending}
                  className="flex-1 py-2 px-4 bg-landing-highlight text-black rounded-lg font-medium hover:bg-landing-highlight/90 transition-colors disabled:opacity-50"
                >
                  {createIntegration.isPending ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 