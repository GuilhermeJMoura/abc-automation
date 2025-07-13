'use client'

import { useEffect, useState, useCallback } from "react"
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

const Banner = () => {
  return (
    <section className="section-padding-large bg-minimal">
      <div className="container-max">
        <div className="text-center space-y-12">
          <div className="space-y-6">
            <h2 id="vision" className="text-heading-2">Nossa Visão</h2>
            <p className="text-body-large text-minimal-secondary max-w-4xl mx-auto">
              Levar a agilidade de um banco global para qualquer boutique de investimentos, usando IA para transformar pedidos em operações concluídas — do prompt ao compliance.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
