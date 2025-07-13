'use client'

import { useEffect, useState, useCallback } from 'react'
import { getWebSocketService, WebSocketMessage, WebSocketEventHandler } from '@/services/websocket'

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const wsService = getWebSocketService()

  useEffect(() => {
    const connect = async () => {
      try {
        await wsService.connect()
        setIsConnected(true)
        setConnectionError(null)
      } catch (error) {
        setConnectionError('Erro ao conectar WebSocket')
        console.error('Erro ao conectar WebSocket:', error)
      }
    }

    // Handler para todas as mensagens
    const messageHandler: WebSocketEventHandler = (message) => {
      setLastMessage(message)
    }

    wsService.on('*', messageHandler)
    connect()

    return () => {
      wsService.off('*', messageHandler)
      wsService.disconnect()
      setIsConnected(false)
    }
  }, [wsService])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    wsService.send(message)
  }, [wsService])

  const sendAnswer = useCallback((sid: string, answer: string) => {
    wsService.sendAnswer(sid, answer)
  }, [wsService])

  const subscribe = useCallback((type: string, handler: WebSocketEventHandler) => {
    wsService.on(type, handler)
    return () => wsService.off(type, handler)
  }, [wsService])

  return {
    isConnected,
    lastMessage,
    connectionError,
    sendMessage,
    sendAnswer,
    subscribe
  }
}

export const useWebSocketMessages = (messageType: string) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const wsService = getWebSocketService()

  useEffect(() => {
    const handler: WebSocketEventHandler = (message) => {
      if (message.type === messageType || messageType === '*') {
        setMessages(prev => [...prev, message])
      }
    }

    wsService.on(messageType, handler)
    return () => wsService.off(messageType, handler)
  }, [wsService, messageType])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    clearMessages
  }
}

export const useWorkflowProgress = (sessionId?: string) => {
  const [progress, setProgress] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const wsService = getWebSocketService()

  useEffect(() => {
    if (!sessionId) return

    const sessionHandler: WebSocketEventHandler = (message) => {
      if (message.sid === sessionId) {
        setIsSessionActive(true)
      }
    }

    const progressHandler: WebSocketEventHandler = (message) => {
      if (message.sid === sessionId && message.msg) {
        setProgress(prev => [...prev, message.msg!])
      }
    }

    const askHandler: WebSocketEventHandler = (message) => {
      if (message.sid === sessionId && message.q) {
        setCurrentQuestion(message.q)
      }
    }

    wsService.on('session', sessionHandler)
    wsService.on('progress', progressHandler)
    wsService.on('ask', askHandler)

    return () => {
      wsService.off('session', sessionHandler)
      wsService.off('progress', progressHandler)
      wsService.off('ask', askHandler)
    }
  }, [wsService, sessionId])

  const answerQuestion = useCallback((answer: string) => {
    if (sessionId && currentQuestion) {
      wsService.sendAnswer(sessionId, answer)
      setCurrentQuestion(null)
    }
  }, [wsService, sessionId, currentQuestion])

  const clearProgress = useCallback(() => {
    setProgress([])
    setCurrentQuestion(null)
    setIsSessionActive(false)
  }, [])

  return {
    progress,
    currentQuestion,
    isSessionActive,
    answerQuestion,
    clearProgress
  }
}
