import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Activity } from 'lucide-react'
import KpiCard from '@/components/ui/kpi-card'

describe('KpiCard', () => {
  it('renders metric and caption correctly', () => {
    render(
      <KpiCard
        icon={Activity}
        metric="156"
        caption="Execuções Hoje"
      />
    )

    expect(screen.getByText('156')).toBeInTheDocument()
    expect(screen.getByText('Execuções Hoje')).toBeInTheDocument()
  })

  it('displays trend when provided', () => {
    render(
      <KpiCard
        icon={Activity}
        metric="24"
        caption="Workflows Ativos"
        trend={{ value: '+12%', isPositive: true }}
      />
    )

    expect(screen.getByText('↗ +12%')).toBeInTheDocument()
  })

  it('shows loading state when loading prop is true', () => {
    render(
      <KpiCard
        icon={Activity}
        metric="0"
        caption="Loading"
        loading={true}
      />
    )

    // Should not show the actual content when loading
    expect(screen.queryByText('0')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
  })
}) 