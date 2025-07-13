import { create } from 'zustand'

interface AgentsState {
  activeAgent: string
  setActiveAgent: (agent: string) => void
}

export const useAgentsStore = create<AgentsState>((set) => ({
  activeAgent: '1',
  setActiveAgent: (agent) => set({ activeAgent: agent }),
})) 