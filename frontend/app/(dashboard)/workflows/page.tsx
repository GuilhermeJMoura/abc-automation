'use client'

import { useState } from 'react'
import { Plus, ZoomIn, ZoomOut, RotateCcw, Play, Save, MessageCircle } from 'lucide-react'
import Chatbot from '@/components/ui/chatbot'

const nodeTypes = [
  { id: 'prompt', name: 'Prompt', color: 'bg-blue-500', description: 'Define entrada de texto' },
  { id: 'agent', name: 'Agent', color: 'bg-purple-500', description: 'Execute ação de IA' },
  { id: 'action', name: 'Action', color: 'bg-green-500', description: 'Execute ação do sistema' },
  { id: 'condition', name: 'Condition', color: 'bg-yellow-500', description: 'Avalie condição' },
]

const tabItems = [
  { id: 'config', name: 'Config' },
  { id: 'history', name: 'History' },
  { id: 'versions', name: 'Versions' },
]

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState('config')
  const [zoom, setZoom] = useState(100)
  const [showChatbot, setShowChatbot] = useState(false)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50))
  const handleResetZoom = () => setZoom(100)

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Workflows</span>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">Novo Workflow</span>
          </div>
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showChatbot 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-foreground hover:bg-accent'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            {showChatbot ? 'Fechar Chat' : 'Abrir Chat'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-6 p-4">
        {/* Left Sidebar - Node Palette */}
        <div className="w-80 bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-4">Componentes</h3>
          <div className="space-y-3">
            {nodeTypes.map((nodeType) => (
              <div
                key={nodeType.id}
                className="p-4 bg-secondary rounded-lg border border-border hover:border-accent-foreground cursor-grab active:cursor-grabbing transition-colors"
                draggable
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 ${nodeType.color} rounded`}></div>
                  <span className="font-medium text-foreground">{nodeType.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{nodeType.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Center Area - Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <ZoomOut className="w-5 h-5 text-muted-foreground" />
              </button>
              <span className="text-sm text-muted-foreground px-3">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <ZoomIn className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-foreground">
                <Save className="w-4 h-4" />
                Salvar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                <Play className="w-4 h-4" />
                Executar
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="h-full relative">
              {/* Grid Background */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgb(var(--border)) 1px, transparent 1px),
                    linear-gradient(to bottom, rgb(var(--border)) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                  transform: `scale(${zoom / 100})`
                }}
              ></div>
              
              {/* Canvas Content */}
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Canvas Vazio</h3>
                  <p className="text-muted-foreground">Arraste componentes da barra lateral para começar</p>
                </div>
              </div>

              {/* Minimap */}
              <div className="absolute bottom-4 right-4 w-32 h-24 bg-secondary border border-border rounded-lg">
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Minimap</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="flex border-b border-border">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4 p-4 bg-card border border-border rounded-lg shadow-sm">
              {activeTab === 'config' && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Configurações</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Nome do Workflow</label>
                      <input
                        type="text"
                        placeholder="Meu Workflow"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Descrição</label>
                      <textarea
                        placeholder="Descreva o que este workflow faz..."
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Histórico de Execuções</h4>
                  <div className="text-muted-foreground">Nenhuma execução ainda.</div>
                </div>
              )}
              
              {activeTab === 'versions' && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Versões</h4>
                  <div className="text-muted-foreground">Versão atual: 1.0.0</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Chatbot */}
        {showChatbot && (
          <div className="w-80 h-full">
            <Chatbot />
          </div>
        )}
      </div>
    </div>
  )
} 