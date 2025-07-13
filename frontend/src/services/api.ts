const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Tipos para as respostas da API
export interface WorkflowResponse {
  id: string
  name: string
  active: boolean
  nodes: any[]
  connections: any
  createdAt: string
  updatedAt: string
}
export interface WorkflowApiResponse {
  workflow: WorkflowResponse
  wsSession: string
}
export interface ApiError {
  error: string
  message?: string
}

// Serviço para criar workflow
export async function createWorkflow(prompt: string): Promise<WorkflowApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || 'Erro ao criar workflow')
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro de conexão com o servidor')
  }
}

// Serviço para buscar workflow por ID
export async function getWorkflow(id: string): Promise<WorkflowResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflows/${id}`)

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || 'Erro ao buscar workflow')
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro de conexão com o servidor')
  }
}

// Serviço para listar todos os workflows
export async function getAllWorkflows(): Promise<WorkflowResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflows`)

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || 'Erro ao buscar workflows')
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro de conexão com o servidor')
  }
} 