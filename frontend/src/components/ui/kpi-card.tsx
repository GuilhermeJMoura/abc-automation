/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-env es6 */
import { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  icon: LucideIcon
  metric: string | number
  caption: string
  trend?: {
    value: string
    isPositive: boolean
  }
  loading?: boolean
}

export default function KpiCard({ icon: Icon, metric, caption, trend, loading }: KpiCardProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">
            <div className="w-8 h-8 bg-muted rounded-md mb-4"></div>
            <div className="w-16 h-8 bg-muted rounded mb-2"></div>
            <div className="w-24 h-4 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {metric}
          </div>
          <div className="text-muted-foreground text-sm">
            {caption}
          </div>
          {trend && (
            <div className={`text-xs mt-2 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '↗' : '↘'} {trend.value}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 