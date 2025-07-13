'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Send, 
  Bot, 
  User, 
  Settings, 
  Download, 
  Search, 
  Plus, 
  MessageCircle, 
  History,
  Moon,
  Sun,
  Workflow,
  Key,
  ArrowRight
} from 'lucide-react'
import { createWorkflow } from '@/services/api'
import { useWebSocket, useWebSocketMessages } from '@/hooks/useWebSocket'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const quickSuggestions = [
  "Como criar um workflow de automação?",
  "Configurar integração com APIs",
  "Gerar relatórios automáticos",
  "Monitorar performance do sistema"
]

export default function MainChatbot() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Conversa Inicial',
      messages: [
        {
          id: '1',
          text: 'Olá! Sou seu assistente de automação. Como posso ajudá-lo hoje?',
          sender: 'bot',
          timestamp: new Date()
        }
      ],
      createdAt: new Date()
    }
  ])
  
  const [activeConversationId, setActiveConversationId] = useState('1')
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false)
  const { isConnected } = useWebSocket()
  const { messages: wsMessages, clearMessages } = useWebSocketMessages('*')

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages])

  // Processar mensagens WebSocket
  useEffect(() => {
    if (wsMessages && wsMessages.length > 0) {
      const lastWsMessage = wsMessages[wsMessages.length - 1]
      
      if (lastWsMessage.type === 'progress' && lastWsMessage.msg) {
        const progressMessage: Message = {
          id: `progress-${Date.now()}`,
          text: lastWsMessage.msg,
          sender: 'bot',
          timestamp: new Date()
        }
        
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, messages: [...conv.messages, progressMessage] }
            : conv
        ))
      }
    }
  }, [wsMessages, activeConversationId])

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isCreatingWorkflow) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    // Add message to active conversation
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { ...conv, messages: [...conv.messages, userMessage] }
        : conv
    ))
    
    setInput('')
    setIsCreatingWorkflow(true)
    clearMessages() // Limpar mensagens WebSocket anteriores

    try {
      // Adicionar mensagem inicial
      const initialMessage: Message = {
        id: `init-${Date.now()}`,
        text: 'Iniciando criação do workflow... Aguarde enquanto processo sua solicitação.',
        sender: 'bot',
        timestamp: new Date()
      }
      
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [...conv.messages, initialMessage] }
          : conv
      ))

      // Chamar API para criar workflow
      const workflow = await createWorkflow(userMessage.text)
      
      // Sucesso
      const successMessage: Message = {
        id: `success-${Date.now()}`,
        text: `✅ Workflow criado com sucesso! ID: ${workflow.workflow.id}\n\nDescrição: ${workflow.workflow.name || 'Workflow automático'}\nStatus: ${workflow.workflow.active ? 'Ativo' : 'Inativo'}`,
        sender: 'bot',
        timestamp: new Date()
      }
      
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [...conv.messages, successMessage] }
          : conv
      ))
      
    } catch (error) {
      // Erro
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: `❌ Erro ao criar workflow: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        sender: 'bot',
        timestamp: new Date()
      }
      
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [...conv.messages, errorMessage] }
          : conv
      ))
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

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Conversa ${conversations.length + 1}`,
      messages: [
        {
          id: '1',
          text: 'Olá! Como posso ajudá-lo nesta nova conversa?',
          sender: 'bot',
          timestamp: new Date()
        }
      ],
      createdAt: new Date()
    }
    
    setConversations(prev => [...prev, newConversation])
    setActiveConversationId(newConversation.id)
  }

  const exportConversation = () => {
    if (!activeConversation) return
    
    const content = activeConversation.messages.map(msg => 
      `${msg.sender.toUpperCase()} (${msg.timestamp.toLocaleString()}): ${msg.text}`
    ).join('\n\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversa-${activeConversation.title.toLowerCase().replace(/\s+/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`bg-card border-r border-border transition-all duration-300 ${showSidebar ? 'w-80' : 'w-0'} overflow-hidden`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Conversas</h2>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button
            onClick={createNewConversation}
            className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Conversa
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setActiveConversationId(conversation.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeConversationId === conversation.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-accent'
                }`}
              >
                <div className="font-medium text-foreground text-sm">{conversation.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {conversation.messages.length} mensagens
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <History className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">Assistente IA</h1>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                {isCreatingWorkflow && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Processando...
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={exportConversation}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title="Exportar conversa"
              >
                <Download className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title="Alternar tema"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <button
                className="p-2 hover:bg-accent rounded-lg transition-colors"
                title="Configurações"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeConversation?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-4 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-muted-foreground'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div className={`p-4 rounded-xl max-w-full ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isCreatingWorkflow && (
            <div className="flex justify-start">
              <div className="flex items-start gap-4 max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-secondary text-muted-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 bg-secondary rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">Criando workflow...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {activeConversation?.messages.length === 1 && (
          <div className="p-6 border-t border-border bg-card">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Acesso Rápido</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => router.push('/chatbot/workflows')}
                  className="flex items-center gap-3 p-4 bg-secondary hover:bg-accent text-left rounded-lg transition-colors border border-border hover:border-primary/50"
                >
                  <Workflow className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Meus Workflows</div>
                    <div className="text-sm text-muted-foreground">Gerencie seus workflows de automação</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </button>
                
                <button
                  onClick={() => router.push('/chatbot/credentials')}
                  className="flex items-center gap-3 p-4 bg-secondary hover:bg-accent text-left rounded-lg transition-colors border border-border hover:border-primary/50"
                >
                  <Key className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Credenciais</div>
                    <div className="text-sm text-muted-foreground">Gerencie suas chaves e APIs</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </button>
              </div>
              
              <h4 className="text-sm font-medium text-foreground mb-3">Sugestões rápidas:</h4>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 text-sm bg-secondary text-foreground rounded-full hover:bg-accent transition-colors border border-border"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-border bg-card">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isCreatingWorkflow}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isCreatingWorkflow}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreatingWorkflow ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 