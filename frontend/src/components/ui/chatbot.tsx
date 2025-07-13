'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
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
  onWorkflowCreated?: (workflow: any) => void
}

export default function Chatbot({ onWorkflowCreated }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Descreva o workflow que você gostaria de criar e eu vou ajudar você.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'normal'
    }
  ])
  const [input, setInput] = useState('')
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages: wsMessages, isConnected, clearMessages } = useWebSocket()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Processar mensagens WebSocket
  useEffect(() => {
    if (wsMessages.length > 0) {
      const lastWsMessage = wsMessages[wsMessages.length - 1]
      
      if (lastWsMessage.type === 'progress' && lastWsMessage.msg) {
        const progressMessage: Message = {
          id: `progress-${Date.now()}`,
          text: lastWsMessage.msg,
          sender: 'bot',
          timestamp: new Date(),
          type: 'progress'
        }
        
        setMessages(prev => [...prev, progressMessage])
      }
    }
  }, [wsMessages])

  const handleSend = async () => {
    if (!input.trim() || isCreatingWorkflow) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'normal'
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsCreatingWorkflow(true)
    clearMessages() // Limpar mensagens WebSocket anteriores

    try {
      // Adicionar mensagem inicial
      const initialMessage: Message = {
        id: `init-${Date.now()}`,
        text: 'Iniciando criação do workflow... Aguarde enquanto processo sua solicitação.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'progress'
      }
      setMessages(prev => [...prev, initialMessage])

      // Chamar API para criar workflow
      const workflow = await createWorkflow(userMessage.text)
      
      // Sucesso
      const successMessage: Message = {
        id: `success-${Date.now()}`,
        text: `✅ Workflow criado com sucesso! ID: ${workflow.id}`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'success'
      }
      setMessages(prev => [...prev, successMessage])
      
      // Callback para componente pai
      if (onWorkflowCreated) {
        onWorkflowCreated(workflow)
      }
      
    } catch (error) {
      // Erro
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `❌ Erro ao criar workflow: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsCreatingWorkflow(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'progress':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <Bot className="w-4 h-4" />
    }
  }

  const getMessageBgColor = (type?: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'progress':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-secondary'
    }
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Assistente de Workflow</h3>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  getMessageIcon(message.type)
                )}
              </div>
              <div className={`p-3 rounded-lg border ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : getMessageBgColor(message.type)
              }`}>
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isCreatingWorkflow && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-secondary text-muted-foreground flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-secondary rounded-lg border">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Processando...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Descreva o workflow que você quer criar..."
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isCreatingWorkflow}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isCreatingWorkflow}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 