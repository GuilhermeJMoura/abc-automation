import { useState, useEffect, useCallback, useRef } from 'react'

interface WebSocketMessage {
  type: string
  msg?: string
  ts: number
}

interface UseWebSocketReturn {
  isConnected: boolean
  messages: WebSocketMessage[]
  lastMessage: WebSocketMessage | null
  sendMessage: (message: any) => void
  clearMessages: () => void
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000'

export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const ws = useRef<WebSocket | null>(null)

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(WS_URL)
      
      ws.current.onopen = () => {
        console.log('WebSocket conectado')
        setIsConnected(true)
      }
      
      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)
          setMessages(prev => [...prev, message])
        } catch (error) {
          console.error('Erro ao parsear mensagem WebSocket:', error)
        }
      }
      
      ws.current.onclose = () => {
        console.log('WebSocket desconectado')
        setIsConnected(false)
        
        // Reconectar após 3 segundos
        setTimeout(() => {
          connect()
        }, 3000)
      }
      
      ws.current.onerror = (error) => {
        console.error('Erro WebSocket:', error)
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error)
      setIsConnected(false)
    }
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setLastMessage(null)
  }, [])

  useEffect(() => {
    connect()
    
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [connect])

  return {
    isConnected,
    messages,
    lastMessage,
    sendMessage,
    clearMessages
  }
} 