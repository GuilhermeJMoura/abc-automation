type WebSocketMessage = {
  type: 'hello' | 'session' | 'progress' | 'ask' | 'answer'
  sid?: string
  msg?: string
  q?: string
  a?: string
  ts?: number
}

type WebSocketEventHandler = (message: WebSocketMessage) => void

class WebSocketService {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map()

  constructor(url: string = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000') {
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('🔌 WebSocket conectado')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('❌ Erro ao processar mensagem WebSocket:', error)
          }
        }

        this.ws.onclose = () => {
          console.log('🔌 WebSocket desconectado')
          this.handleReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('❌ Erro WebSocket:', error)
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private handleMessage(message: WebSocketMessage) {
    const { type } = message
    
    // Emit para handlers específicos do tipo
    const handlers = this.eventHandlers.get(type) || []
    handlers.forEach(handler => handler(message))
    
    // Emit para handlers globais
    const globalHandlers = this.eventHandlers.get('*') || []
    globalHandlers.forEach(handler => handler(message))
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`🔄 Tentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect().catch(console.error)
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error('❌ Máximo de tentativas de reconexão excedido')
    }
  }

  on(type: string, handler: WebSocketEventHandler) {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, [])
    }
    this.eventHandlers.get(type)!.push(handler)
  }

  off(type: string, handler: WebSocketEventHandler) {
    const handlers = this.eventHandlers.get(type)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('❌ WebSocket não está conectado')
    }
  }

  // Método para responder a perguntas
  sendAnswer(sid: string, answer: string) {
    this.send({
      type: 'answer',
      sid,
      a: answer
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Singleton instance
let wsService: WebSocketService | null = null

export const getWebSocketService = (): WebSocketService => {
  if (!wsService) {
    wsService = new WebSocketService()
  }
  return wsService
}

export default WebSocketService
export type { WebSocketMessage, WebSocketEventHandler } 