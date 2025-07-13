'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL?.replace(/^http/, 'ws') || 'ws://localhost:4000'

interface WsMsg {
  type: string
  [k: string]: any
}

export function useWebSocket() {
  const [messages, setMessages] = useState<WsMsg[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)

  /* open once */
  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    socketRef.current = ws

    ws.onopen = () => setIsConnected(true)
    ws.onclose = () => setIsConnected(false)
    ws.onmessage = (e) => {
      try {
        const data: WsMsg = JSON.parse(e.data)
        setMessages((prev) => [...prev, data])
      } catch (_) {}
    }

    return () => ws.close()
  }, [])

  /* helpers */
  const send = useCallback((obj: Record<string, any>) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(obj))
    }
  }, [])

  const clearMessages = () => setMessages([])

  return { messages, isConnected, send, clearMessages }
}
