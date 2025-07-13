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

export interface ClarificationSession {
  session_id: string
  questions?: string[]
  ready?: boolean
  context?: string
}

export interface ClarificationResponse {
  session_id: string
  questions?: string[]
  ready?: boolean
  context?: string
  error?: string
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

// Serviço para iniciar clarificação
export async function startClarification(prompt: string): Promise<ClarificationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflows/clarify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_prompt: prompt }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || 'Erro ao iniciar clarificação')
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro de conexão com o servidor')
  }
}

// Serviço para continuar clarificação
export async function continueClarification(sessionId: string, answer: string): Promise<ClarificationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflows/clarify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        session_id: sessionId, 
        user_prompt: answer 
      }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || 'Erro ao continuar clarificação')
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro de conexão com o servidor')
  }
}

// Serviço para gerar workflow com contexto clarificado
export async function generateWorkflowWithContext(context: string): Promise<WorkflowApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workflows/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context }),
    })

    if (!response.ok) {
      const error: ApiError = await response.json()
      throw new Error(error.error || 'Erro ao gerar workflow')
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro de conexão com o servidor')
  }
} 