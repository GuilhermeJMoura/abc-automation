'use client'

import { Activity, Workflow, AlertTriangle, Clock } from 'lucide-react'
import KpiCard from '@/components/ui/kpi-card'
import { useKpis, useActivities } from '@/hooks/use-api'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function DashboardPage() {
  const { data: kpis, isLoading: kpisLoading } = useKpis()
  const { data: activities, isLoading: activitiesLoading } = useActivities()

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusDot = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-muted'
    }
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          icon={Workflow}
          metric={kpis?.workflowsActive || 0}
          caption="Workflows Ativos"
          trend={{ value: '+12%', isPositive: true }}
          loading={kpisLoading}
        />
        <KpiCard
          icon={Activity}
          metric={kpis?.runsToday || 0}
          caption="Execuções Hoje"
          trend={{ value: '+8%', isPositive: true }}
          loading={kpisLoading}
        />
        <KpiCard
          icon={AlertTriangle}
          metric={kpis?.errors || 0}
          caption="Erros"
          trend={{ value: '-2%', isPositive: true }}
          loading={kpisLoading}
        />
        <KpiCard
          icon={Clock}
          metric={kpis?.avgLatency || '0s'}
          caption="Latência Média"
          trend={{ value: '-5%', isPositive: true }}
          loading={kpisLoading}
        />
      </div>

      {/* Activity Feed */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Atividade em Tempo Real</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Ao vivo</span>
          </div>
        </div>
        
        {activitiesLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="w-3 h-3 bg-muted rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="w-3/4 h-4 bg-muted rounded mb-2"></div>
                  <div className="w-1/4 h-3 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
                          {activities?.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`w-3 h-3 ${getStatusDot(activity.type)} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1">
                  <p className={`text-sm ${getStatusColor(activity.type)} mb-1`}>
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 