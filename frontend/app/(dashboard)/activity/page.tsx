'use client'

import { useState } from 'react'
import { Calendar, Filter } from 'lucide-react'
import { useActivities } from '@/hooks/use-api'
import { format, isToday, isYesterday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type FilterPeriod = 'all' | 'today' | 'yesterday' | 'week' | 'month'

export default function ActivityPage() {
  const { data: activities, isLoading } = useActivities()
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const filteredActivities = activities?.filter(activity => {
    const activityDate = new Date(activity.timestamp)
    const now = new Date()
    
    let dateMatch = true
    switch (filterPeriod) {
      case 'today':
        dateMatch = isToday(activityDate)
        break
      case 'yesterday':
        dateMatch = isYesterday(activityDate)
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        dateMatch = activityDate >= weekAgo
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        dateMatch = activityDate >= monthAgo
        break
      default:
        dateMatch = true
    }
    
    const typeMatch = filterType === 'all' || activity.type === filterType
    
    return dateMatch && typeMatch
  })

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-landing-text'
    }
  }

  const getStatusDot = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-400'
      case 'warning': return 'bg-yellow-400'
      case 'error': return 'bg-red-400'
      default: return 'bg-landing-border'
    }
  }

  const getStatusLabel = (type: string) => {
    switch (type) {
      case 'success': return 'Sucesso'
      case 'warning': return 'Aviso'
      case 'error': return 'Erro'
      default: return type
    }
  }

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Hoje'
    if (isYesterday(date)) return 'Ontem'
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
  }

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: ptBR })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-landing-title">Log de Atividades</h2>
        <p className="text-landing-text mt-1">Acompanhe todas as execuções e eventos do sistema</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-landing-text" />
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as FilterPeriod)}
            className="pl-10 pr-8 py-3 bg-landing-tertiary border border-landing-border rounded-lg text-landing-title focus:outline-none focus:border-landing-highlight/50 backdrop-blur-md"
          >
            <option value="all">Todos os períodos</option>
            <option value="today">Hoje</option>
            <option value="yesterday">Ontem</option>
            <option value="week">Últimos 7 dias</option>
            <option value="month">Últimos 30 dias</option>
          </select>
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-landing-text" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-3 bg-landing-tertiary border border-landing-border rounded-lg text-landing-title focus:outline-none focus:border-landing-highlight/50 backdrop-blur-md"
          >
            <option value="all">Todos os tipos</option>
            <option value="success">Sucesso</option>
            <option value="warning">Aviso</option>
            <option value="error">Erro</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-landing-tertiary border border-landing-border rounded-xl p-6 backdrop-blur-md">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="w-4 h-4 bg-landing-border rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="w-3/4 h-4 bg-landing-border rounded mb-2"></div>
                  <div className="w-1/2 h-3 bg-landing-border rounded mb-2"></div>
                  <div className="w-1/4 h-3 bg-landing-border rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities && filteredActivities.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-2 top-0 bottom-0 w-px bg-landing-border"></div>
            
            <div className="space-y-6">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="relative flex items-start gap-4">
                  {/* Status dot */}
                  <div className={`relative z-10 w-4 h-4 ${getStatusDot(activity.type)} rounded-full flex-shrink-0 mt-2`}>
                    <div className={`absolute inset-0 ${getStatusDot(activity.type)} rounded-full animate-ping opacity-25`}></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(activity.type)} bg-current/10`}>
                          {getStatusLabel(activity.type)}
                        </span>
                        <span className="text-xs text-landing-text">
                          {formatDate(activity.timestamp)} às {formatTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`${getStatusColor(activity.type)} mb-1`}>
                      {activity.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-landing-border rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-landing-text" />
            </div>
            <p className="text-landing-text">Nenhuma atividade encontrada para os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  )
} 