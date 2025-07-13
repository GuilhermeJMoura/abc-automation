'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send, Bot, User,
  CheckCircle, XCircle, AlertCircle,
} from 'lucide-react'
import { createWorkflow } from '@/services/api'
import { useWebSocket } from '@/hooks/useWebSocket'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'progress' | 'success' | 'error' | 'normal'
}

interface ChatbotProps {
  onWorkflowCreated?: (wf: any) => void
}

export default function Chatbot ({ onWorkflowCreated }: ChatbotProps) {
  /* ---------------- state ---------------- */
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: 'Olá! Descreva o workflow que você gostaria de criar e eu vou ajudar você.',
    sender: 'bot',
    timestamp: new Date(),
  }])
  const [input, setInput]                     = useState('')
  const [isCreating, setIsCreating]           = useState(false)
  const [sid, setSid]                         = useState<string | null>(null)
  const [pendingQuestion, setPendingQuestion] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  /* evita hydration error com hora divergente */
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  /* ---------------- websocket ---------------- */
  const {
    messages: wsMessages,
    isConnected,
    clearMessages,
    send,                    // <-- WE NEED THIS
  } = useWebSocket()

  /* autoscroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* incoming WS events */
  useEffect(() => {
    if (!wsMessages.length) return
    const ev = wsMessages[wsMessages.length - 1]

    if (ev.type === 'session') {
      setSid(ev.sid)
      return
    }

    if (ev.type === 'ask') {
      const list = Array.isArray(ev.q) ? ev.q : [ev.q]
      const now  = Date.now()
      setMessages((m) => [
        ...m,
        ...list.map((txt: string, i: number) => ({
          id: `ask-${now}-${i}`,
          text: txt,
          sender: 'bot',
          timestamp: new Date(),
        }))
      ])
      setPendingQuestion(true)
      return
     }

    if (ev.type === 'progress') {
      setMessages((m) => [...m, {
        id: `prog-${Date.now()}`,
        text: ev.msg,
        sender: 'bot',
        timestamp: new Date(),
        type: 'progress',
      }])
    }
  }, [wsMessages])

  /* ---------------- handlers ---------------- */
  async function handleSend () {
    if (!input.trim()) return

    /* A) Reply to Clarifier */
    if (pendingQuestion && sid) {
      const answer = input.trim()
      setMessages((m) => [...m, {
        id: Date.now().toString(),
        text: answer,
        sender: 'user',
        timestamp: new Date(),
      }])
      send({ type: 'answer', sid, a: answer })
      setInput('')
      setPendingQuestion(false)
      return
    }

    /* B) Kick-off new workflow */
    if (isCreating) return
    setIsCreating(true)

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    clearMessages()

    try {
      setMessages((m) => [...m, {
        id: `init-${Date.now()}`,
        text: 'Iniciando criação do workflow…',
        sender: 'bot',
        timestamp: new Date(),
        type: 'progress',
      }])

      const { workflow, wsSession } = await createWorkflow(userMsg.text)
      setSid(wsSession)

      setMessages((m) => [...m, {
        id: `ok-${Date.now()}`,
        text: `✅ Workflow criado com sucesso! ID: ${workflow.id}`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'success',
      }])

      onWorkflowCreated?.(workflow)
    } catch (err: any) {
      setMessages((m) => [...m, {
        id: `err-${Date.now()}`,
        text: `❌ ${err.message || 'Erro desconhecido'}`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'error',
      }])
    } finally {
      setIsCreating(false)
    }
  }

  function handleKey (e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  /* helpers for icon / color – unchanged */

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col h-full bg-card border rounded-lg">
      {/* header */}
      <div className="p-4 border-b flex items-center gap-2">
        <Bot className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Assistente de Workflow</h3>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* message bubble (omitted for brevity – keep your existing JSX) */}
          </div>
        ))}
        {isCreating && !pendingQuestion && (
          /* spinner bubble (keep yours) */
          <div>…</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKey}
            placeholder="Digite aqui…"
            className="flex-1 px-3 py-2 border rounded-lg"
            disabled={isCreating && !pendingQuestion}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || (isCreating && !pendingQuestion)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
