'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Key,
  Globe,
  Database,

  Shield,
  CheckCircle,
  AlertTriangle,
  Copy,
  MoreHorizontal,
  ArrowLeft,
  MessageCircle
} from 'lucide-react'

interface Credential {
  id: string
  name: string
  type: 'api_key' | 'oauth' | 'database' | 'webhook'
  service: string
  description: string
  status: 'active' | 'expired' | 'inactive'
  lastUsed: Date
  createdAt: Date
  expiresAt?: Date
  masked: boolean
}

const mockCredentials: Credential[] = [
  {
    id: '1',
    name: 'API B3 Trading',
    type: 'api_key',
    service: 'B3',
    description: 'Credenciais para execução de ordens na B3',
    status: 'active',
    lastUsed: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90), // 90 days from now
    masked: true
  },
  {
    id: '2',
    name: 'CVM API Access',
    type: 'oauth',
    service: 'CVM',
    description: 'OAuth para submissão de relatórios à CVM',
    status: 'active',
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    masked: true
  },
  {
    id: '3',
    name: 'Database Primário',
    type: 'database',
    service: 'PostgreSQL',
    description: 'Conexão com banco de dados principal de posições',
    status: 'active',
    lastUsed: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
    masked: true
  },
  {
    id: '4',
    name: 'Webhook Notificações',
    type: 'webhook',
    service: 'Slack',
    description: 'Webhook para notificações de margin calls no Slack',
    status: 'expired',
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // expired 3 days ago
    masked: true
  }
]

export default function CredentialsPage() {
  const router = useRouter()
  const [credentials] = useState<Credential[]>(mockCredentials)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [visibleCredentials, setVisibleCredentials] = useState<Set<string>>(new Set())

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api_key': return <Key className="w-4 h-4 text-blue-500" />
      case 'oauth': return <Shield className="w-4 h-4 text-green-500" />
      case 'database': return <Database className="w-4 h-4 text-purple-500" />
      case 'webhook': return <Globe className="w-4 h-4 text-orange-500" />
      default: return <Key className="w-4 h-4 text-gray-500" />
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'expired': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'inactive': return <AlertTriangle className="w-4 h-4 text-gray-500" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'expired': return 'bg-red-100 text-red-800 border-red-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days > 0) return `${days}d atrás`
    if (hours > 0) return `${hours}h atrás`
    if (minutes > 0) return `${minutes}min atrás`
    return 'Agora'
  }

  const toggleVisibility = (credentialId: string) => {
    const newVisible = new Set(visibleCredentials)
    if (newVisible.has(credentialId)) {
      newVisible.delete(credentialId)
    } else {
      newVisible.add(credentialId)
    }
    setVisibleCredentials(newVisible)
  }

  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = credential.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         credential.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         credential.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || credential.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/chatbot')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar ao Chat</span>
              </button>
              <div className="w-px h-6 bg-border"></div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Credenciais</h1>
                <p className="text-muted-foreground">Gerencie suas chaves de API e credenciais de integração</p>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/chatbot')}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Filters and Search */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar credenciais..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-80"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="all">Todos os tipos</option>
                    <option value="api_key">API Key</option>
                    <option value="oauth">OAuth</option>
                    <option value="database">Database</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </div>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                Nova Credencial
              </button>
            </div>
          </div>

          {/* Credentials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCredentials.map((credential) => (
              <div key={credential.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(credential.type)}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{credential.name}</h3>
                      <p className="text-sm text-muted-foreground">{credential.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(credential.status)}`}>
                      {credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}
                    </span>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">{credential.description}</p>

                {/* Credential Value */}
                <div className="bg-secondary rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {visibleCredentials.has(credential.id) ? (
                        <code className="text-sm font-mono text-foreground">
                          sk_live_51H7qF2eZvKYlo2C8pK...xyz123
                        </code>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          •••••••••••••••••••••••••••••••••••••
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleVisibility(credential.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {visibleCredentials.has(credential.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Último uso</div>
                    <div className="text-sm font-medium text-foreground">{formatRelativeTime(credential.lastUsed)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Criado em</div>
                    <div className="text-sm font-medium text-foreground">{credential.createdAt.toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Expiration */}
                {credential.expiresAt && (
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground">Expira em</div>
                    <div className={`text-sm font-medium ${
                      credential.status === 'expired' ? 'text-red-600' : 
                      credential.expiresAt.getTime() - Date.now() < 1000 * 60 * 60 * 24 * 30 ? 'text-yellow-600' : 'text-foreground'
                    }`}>
                      {credential.expiresAt.toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1 text-sm bg-secondary text-foreground rounded hover:bg-accent transition-colors">
                    <Edit className="w-3 h-3" />
                    Editar
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 text-sm bg-secondary text-foreground rounded hover:bg-accent transition-colors">
                    <Shield className="w-3 h-3" />
                    Testar
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3 h-3" />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCredentials.length === 0 && (
            <div className="text-center py-12">
              <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma credencial encontrada</h3>
              <p className="text-muted-foreground">Ajuste seus filtros ou adicione uma nova credencial</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 