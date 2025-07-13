'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Play, 
  Pause, 
  Edit, 
 
  Copy, 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  MessageCircle
} from 'lucide-react'

interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'error' | 'draft'
  lastRun: Date
  nextRun?: Date
  executions: number
  successRate: number
  createdAt: Date
  category: string
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Hedge USD/BRL Automático',
    description: 'Ajusta hedge USD/BRL sempre que oscilar ±0,75%, split 60% corretora A e 40% DEX.',
    status: 'active',
    lastRun: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    nextRun: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    executions: 247,
    successRate: 98.4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    category: 'Financeiro'
  },
  {
    id: '2',
    name: 'Bridge Loan Generator',
    description: 'Gera bridge-loan memo automaticamente, coleta balanços e envia para assinatura.',
    status: 'active',
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    executions: 42,
    successRate: 95.2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
    category: 'Documentos'
  },
  {
    id: '3',
    name: 'Margin Call Monitor',
    description: 'Executa margin call automática se equity ratio cair abaixo de 110% em qualquer prime.',
    status: 'error',
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    executions: 156,
    successRate: 89.7,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22), // 22 days ago
    category: 'Monitoramento'
  },
  {
    id: '4',
    name: 'Stress Test CVM',
    description: 'Roda stress-test +300 bps na curva DI, gera CSV e envia à CVM em até 48 h.',
    status: 'paused',
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    executions: 12,
    successRate: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    category: 'Compliance'
  }
]

export default function WorkflowsPage() {
  const router = useRouter()
  const [workflows] = useState<Workflow[]>(mockWorkflows)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      case 'draft': return <AlertCircle className="w-4 h-4 text-gray-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200'
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

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || workflow.status === selectedStatus
    return matchesSearch && matchesStatus
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
                <h1 className="text-2xl font-bold text-foreground">Meus Workflows</h1>
                <p className="text-muted-foreground">Gerencie todos os seus workflows de automação</p>
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
                    placeholder="Buscar workflows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-80"
                  />
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="all">Todos os status</option>
                    <option value="active">Ativo</option>
                    <option value="paused">Pausado</option>
                    <option value="error">Erro</option>
                    <option value="draft">Rascunho</option>
                  </select>
                </div>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                Novo Workflow
              </button>
            </div>
          </div>

          {/* Workflows Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <div key={workflow.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(workflow.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(workflow.status)}`}>
                      {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                    </span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{workflow.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{workflow.description}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Execuções</div>
                    <div className="text-lg font-semibold text-foreground">{workflow.executions}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                    <div className="text-lg font-semibold text-green-600">{workflow.successRate}%</div>
                  </div>
                </div>

                {/* Timing */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Última execução: {formatRelativeTime(workflow.lastRun)}</span>
                  </div>
                  {workflow.nextRun && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Próxima: {workflow.nextRun.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1 text-sm bg-secondary text-foreground rounded hover:bg-accent transition-colors">
                    <Play className="w-3 h-3" />
                    Executar
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 text-sm bg-secondary text-foreground rounded hover:bg-accent transition-colors">
                    <Edit className="w-3 h-3" />
                    Editar
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 text-sm bg-secondary text-foreground rounded hover:bg-accent transition-colors">
                    <Copy className="w-3 h-3" />
                    Duplicar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredWorkflows.length === 0 && (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum workflow encontrado</h3>
              <p className="text-muted-foreground">Ajuste seus filtros ou crie um novo workflow</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 