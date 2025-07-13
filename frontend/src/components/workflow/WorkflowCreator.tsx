'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWebSocket, useWorkflowProgress } from '@/hooks/useWebSocket'
import { useToastContext } from '@/providers/ToastProvider'
import { 
  createWorkflow, 
  startClarification, 
  continueClarification, 
  generateWorkflowWithContext 
} from '@/services/api'
import type { ClarificationResponse } from '@/services/api'

interface WorkflowCreatorProps {
  onWorkflowCreated?: (workflow: any) => void
  onError?: (error: string) => void
}

export const WorkflowCreator: React.FC<WorkflowCreatorProps> = ({
  onWorkflowCreated,
  onError
}) => {
  const [step, setStep] = useState<'input' | 'clarification' | 'generating' | 'completed'>('input')
  const [initialPrompt, setInitialPrompt] = useState('')
  const [clarificationSession, setClarificationSession] = useState<ClarificationResponse | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workflow, setWorkflow] = useState<any>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const { isConnected } = useWebSocket()
  const { progress, currentQuestion, answerQuestion, clearProgress } = useWorkflowProgress(sessionId)
  const { showSuccess, showError, showWarning, showInfo } = useToastContext()

  const handleStartCreation = async () => {
    if (!initialPrompt.trim()) {
      setError('Por favor, descreva o que você deseja automatizar')
      return
    }

    setIsLoading(true)
    setError(null)
    clearProgress()

    try {
      // Iniciar clarificação
      const clarification = await startClarification(initialPrompt)
      setClarificationSession(clarification)
      
      if (clarification.ready) {
        // Se já está pronto, gerar workflow diretamente
        await generateWorkflow(clarification.context!)
      } else if (clarification.questions && clarification.questions.length > 0) {
        // Se há perguntas, começar clarificação
        setStep('clarification')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao iniciar criação'
      setError(errorMessage)
      showError('Erro ao iniciar criação', errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerQuestion = async () => {
    if (!currentAnswer.trim() || !clarificationSession) return

    setIsLoading(true)
    setError(null)

    try {
      const newAnswers = [...answers, currentAnswer]
      setAnswers(newAnswers)
      setCurrentAnswer('')

      // Continuar clarificação
      const response = await continueClarification(
        clarificationSession.session_id, 
        currentAnswer
      )
      setClarificationSession(response)

      if (response.ready) {
        // Clarificação completa, gerar workflow
        await generateWorkflow(response.context!)
      } else if (response.questions && response.questions.length > 0) {
        // Mais perguntas
        setCurrentQuestionIndex(prev => prev + 1)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar resposta'
      setError(errorMessage)
      showError('Erro ao processar resposta', errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const generateWorkflow = async (context: string) => {
    setStep('generating')
    setIsLoading(true)

    try {
      const result = await createWorkflow(context)
      setWorkflow(result.workflow)
      setSessionId(result.wsSession)
      setStep('completed')
      showSuccess('Workflow criado com sucesso!', `Workflow "${result.workflow.name}" foi criado e está pronto para uso.`)
      onWorkflowCreated?.(result.workflow)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar workflow'
      setError(errorMessage)
      showError('Erro ao gerar workflow', errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStep('input')
    setInitialPrompt('')
    setClarificationSession(null)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setCurrentAnswer('')
    setError(null)
    setWorkflow(null)
    setSessionId(null)
    clearProgress()
  }

  // Responder automaticamente quando houver pergunta do WebSocket
  useEffect(() => {
    if (currentQuestion && sessionId) {
      // Aqui você pode implementar lógica para responder automaticamente
      // ou solicitar input do usuário
    }
  }, [currentQuestion, sessionId])

  const getCurrentQuestion = () => {
    if (!clarificationSession?.questions) return null
    return clarificationSession.questions[currentQuestionIndex]
  }

  const renderStep = () => {
    switch (step) {
      case 'input':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Descreva o que você deseja automatizar:
              </label>
              <Input
                id="prompt"
                value={initialPrompt}
                onChange={(e) => setInitialPrompt(e.target.value)}
                placeholder="Ex: Quero criar um relatório semanal com dados de vendas..."
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleStartCreation}
              disabled={isLoading || !initialPrompt.trim()}
              className="w-full"
            >
              {isLoading ? 'Analisando...' : 'Começar'}
            </Button>
          </div>
        )

      case 'clarification':
        const question = getCurrentQuestion()
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Pergunta {currentQuestionIndex + 1} de {clarificationSession?.questions?.length || 1}
              </h3>
              <p className="text-blue-800">{question}</p>
            </div>
            
            {answers.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Respostas anteriores:</h4>
                {answers.map((answer, index) => (
                  <p key={index} className="text-sm text-gray-600 mb-1">
                    {index + 1}. {answer}
                  </p>
                ))}
              </div>
            )}

            <div>
              <Input
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Sua resposta..."
                className="w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleAnswerQuestion()}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleAnswerQuestion}
                disabled={isLoading || !currentAnswer.trim()}
                className="flex-1"
              >
                {isLoading ? 'Processando...' : 'Responder'}
              </Button>
              <Button 
                onClick={handleReset}
                variant="outline"
              >
                Reiniciar
              </Button>
            </div>
          </div>
        )

      case 'generating':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Gerando seu workflow...</p>
            </div>
            
            {progress.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Progresso:</h4>
                {progress.map((msg, index) => (
                  <p key={index} className="text-sm text-gray-600 mb-1">
                    {msg}
                  </p>
                ))}
              </div>
            )}

            {currentQuestion && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800 font-medium">Pergunta adicional:</p>
                <p className="text-yellow-700">{currentQuestion}</p>
                <Input
                  className="mt-2"
                  placeholder="Sua resposta..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement
                      if (sessionId) {
                        answerQuestion(target.value)
                        target.value = ''
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        )

      case 'completed':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">✅ Workflow criado com sucesso!</h3>
              <p className="text-green-800">
                Seu workflow "{workflow?.name}" foi criado e está pronto para uso.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                Criar Novo Workflow
              </Button>
              <Button 
                onClick={() => {
                  // Navegar para visualizar o workflow
                  window.location.href = `/workflows/${workflow?.id}`
                }}
                className="flex-1"
              >
                Ver Workflow
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Criar Novo Workflow
        </h2>
        <p className="text-gray-600">
          Descreva o que você deseja automatizar e nossos agents criarão o workflow perfeito para você.
        </p>
      </div>

      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800">
            ⚠️ Conectando ao servidor... Algumas funcionalidades podem não estar disponíveis.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {renderStep()}
    </div>
  )
}

export default WorkflowCreator 