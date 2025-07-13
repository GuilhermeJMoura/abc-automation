'use client'

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAgentsStore } from "@/store/agents"
import Image from "next/image"

interface Agent {
  [key: string]: {
    title: string;
    prompts: string[];
  };
}

const data: Agent[] = [
  {
    hedgeAgent: {
      title: "Hedge Agent",
      prompts: [
        "Ajustar hedge USD/BRL sempre que oscilar ±0,75%, split 60% corretora A e 40% DEX."
      ]
    }
  },
  {
    bridgeLoanAgent: {
      title: "Bridge Loan Agent",
      prompts: [
        "Gerar bridge-loan memo de R$ 20 mi para Target S.A., coletar balanço e enviar para assinatura."
      ]
    }
  },
  {
    marginCallAgent: {
      title: "Margin Call Agent",
      prompts: [
        "Executar margin call automática se equity ratio cair abaixo de 110% em qualquer prime."
      ]
    }
  },
  {
    stressTestAgent: {
      title: "Stress Test Agent",
      prompts: [
        "Rodar stress-test +300 bps na curva DI, gerar CSV e enviar à CVM em até 48 h."
      ]
    }
  },
  {
    earnOutAgent: {
      title: "Earn-out Agent",
      prompts: [
        "Verificar cláusula de earn-out trimestral, calcular valor devido e disparar pagamento via ERP."
      ]
    }
  }
]

const useTypewriter = () => {
  const [text, setText] = useState('')
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaitingForNextAgent, setIsWaitingForNextAgent] = useState(false)
  const [isPausingBeforeDelete, setIsPausingBeforeDelete] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const { setActiveAgent } = useAgentsStore()
  const getCurrentPrompt = useCallback(() => {
    const agent = Object.values(data[currentAgentIndex])[0]
    return agent.prompts[currentPromptIndex]
  }, [currentAgentIndex, currentPromptIndex])

  useEffect(() => {
    setIsMounted(true)
    let timeout: NodeJS.Timeout

    const batchSize = 1;
    const typeSpeed = 150;
    const deleteSpeed = 100;
    const pauseBeforeDelete = 2000;
    const agentChangeDelay = 1000;

    const animate = () => {
      if (isWaitingForNextAgent) {
        timeout = setTimeout(() => {
          setCurrentAgentIndex((currentAgentIndex + 1) % data.length);
          setCurrentPromptIndex(0);
          setIsWaitingForNextAgent(false);
        }, agentChangeDelay);
        return
      }

      const currentText = getCurrentPrompt();

      if (!isDeleting) {
        if (text.length < currentText.length) {
          const charsToAdd = Math.min(batchSize, currentText.length - text.length);
          setText(currentText.slice(0, text.length + charsToAdd));
          setIsPausingBeforeDelete(false);
          timeout = setTimeout(animate, typeSpeed);
        } else {
          setIsPausingBeforeDelete(true);
          timeout = setTimeout(() => {
            setIsPausingBeforeDelete(false);
            setIsDeleting(true);
            animate();
          }, pauseBeforeDelete);
        }
      } else {
        if (text.length > 0) {
          const charsToRemove = Math.min(batchSize, text.length);
          const newText = text.slice(0, text.length - charsToRemove);
          setText(newText);
          setIsPausingBeforeDelete(false);
          timeout = setTimeout(animate, deleteSpeed);
        } else {
          setIsDeleting(false);
          const agent = Object.values(data[currentAgentIndex])[0];

          if (currentPromptIndex < agent.prompts.length - 1) {
            timeout = setTimeout(() => {
              setCurrentPromptIndex(currentPromptIndex + 1);
            }, 0);
          } else {
            if (currentAgentIndex === 5) {
              setActiveAgent((currentAgentIndex + 3).toString())
            }
            else if (currentAgentIndex === data.length - 1) {
              setActiveAgent('1')
            }
            else {
              setActiveAgent((currentAgentIndex + 2).toString())
            }
            setIsWaitingForNextAgent(true);
          }
        }
      }
    };

    timeout = setTimeout(animate, 20);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, isWaitingForNextAgent, currentAgentIndex, currentPromptIndex, getCurrentPrompt, setActiveAgent]);

  return { text: isMounted ? text : '', isPausingBeforeDelete: isMounted ? isPausingBeforeDelete : false };
}

const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const router = useRouter()
  const { text, isPausingBeforeDelete } = useTypewriter()

  const words = [
    'linhas de crédito',
    'hedges cambiais',
    'stress-tests regulatórios',
    'margin calls',
    'relatórios CVM'
  ]

  useEffect(() => {
    setIsMounted(true)
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [words.length])

  const handleLaunchApp = () => {
    router.push('/chatbot')
  }

  return (
    <section className="section-padding-large bg-minimal min-h-screen flex items-center justify-center">
      <div className="container-max text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Logo centralizada */}
          <div className="flex justify-center mb-8">
            {!logoError ? (
              <Image 
                src="/logo.png" 
                alt="Hackas Logo" 
                width={80} 
                height={80}
                className="w-20 h-20"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-20 h-20 bg-minimal-accent rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-2xl">H</span>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <h1 className="text-heading-1 space-y-2">
              <div className="text-minimal-primary">
                Automatize suas
              </div>
              <div className="min-h-[4rem] flex items-center justify-center">
                <span
                  key={isMounted ? words[currentWord] : words[0]}
                  className="text-minimal-accent animate-fadeInUp"
                >
                  {isMounted ? words[currentWord] : words[0]}
                </span>
              </div>
              <div className="text-minimal-primary">
                em segundos.
              </div>
            </h1>
          </div>
          
          <div className="space-y-8">
            <p className="text-body-large text-minimal-secondary max-w-3xl mx-auto">
              Transforme pedidos em operações concluídas através de workflows de IA que conectam dados, executam ordens e geram documentos oficiais.
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={handleLaunchApp}
                className="btn-primary text-lg px-8 py-3"
              >
                Começar Agora
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            
            {/* Barra de prompt */}
            <div className="max-w-3xl mx-auto">
              <div className="card-minimal">
                <div className="flex items-center bg-minimal-card border border-minimal rounded-lg p-4 min-h-[60px]">
                  <div className="w-6 h-6 bg-minimal-accent rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-body text-minimal-primary">
                    <span>{text}</span>
                    {!isPausingBeforeDelete && <span className="animate-pulse text-minimal-accent">|</span>}
                  </div>
                  {isPausingBeforeDelete && (
                    <div className="ml-4">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-minimal-accent"
                      >
                        <path
                          d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
