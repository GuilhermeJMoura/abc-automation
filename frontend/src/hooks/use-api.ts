import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Mock API functions
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const mockApi = {
  getKpis: async () => {
    await mockDelay(1000)
    return {
      workflowsActive: 24,
      runsToday: 156,
      errors: 3,
      avgLatency: '1.2s'
    }
  },
  
  getActivities: async () => {
    await mockDelay(800)
    return [
      { id: 1, type: 'success', message: 'Workflow "Hedge USD/BRL" completed successfully', timestamp: new Date(Date.now() - 5 * 60000) },
      { id: 2, type: 'warning', message: 'High latency detected in integration API', timestamp: new Date(Date.now() - 15 * 60000) },
      { id: 3, type: 'error', message: 'Failed to execute margin call workflow', timestamp: new Date(Date.now() - 30 * 60000) },
      { id: 4, type: 'success', message: 'Bridge loan memo generated for Target S.A.', timestamp: new Date(Date.now() - 45 * 60000) },
    ]
  },

  getTemplates: async () => {
    await mockDelay(600)
    return [
      { id: 1, title: 'Hedge Automático USD/BRL', category: 'Câmbio', image: '/api/placeholder/300/200', description: 'Ajusta hedge automaticamente baseado em oscilações' },
      { id: 2, title: 'Margin Call Monitor', category: 'Risco', image: '/api/placeholder/300/200', description: 'Monitora equity ratio e executa margin calls' },
      { id: 3, title: 'Bridge Loan Generator', category: 'Crédito', image: '/api/placeholder/300/200', description: 'Gera memos de bridge loan automaticamente' },
      { id: 4, title: 'Stress Test CVM', category: 'Compliance', image: '/api/placeholder/300/200', description: 'Executa stress tests e envia para CVM' },
    ]
  },

  getIntegrations: async () => {
    await mockDelay(500)
    return [
      { id: 1, name: 'BTG Pactual Prime', provider: 'BTG', status: 'connected', type: 'API Key' },
      { id: 2, name: 'B3 Market Data', provider: 'B3', status: 'connected', type: 'OAuth' },
      { id: 3, name: 'CVM Reporting', provider: 'CVM', status: 'error', type: 'API Key' },
      { id: 4, name: 'Inter Banking', provider: 'Inter', status: 'disconnected', type: 'OAuth' },
    ]
  }
}

// Hooks
export const useKpis = () => {
  return useQuery({
    queryKey: ['kpis'],
    queryFn: mockApi.getKpis,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: mockApi.getActivities,
    refetchInterval: 10000, // Refetch every 10 seconds
  })
}

export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: mockApi.getTemplates,
  })
}

export const useIntegrations = () => {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: mockApi.getIntegrations,
  })
}

export const useCreateIntegration = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      await mockDelay(2000)
      return { id: Date.now(), ...data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] })
    },
  })
} 