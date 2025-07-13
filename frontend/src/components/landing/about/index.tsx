const About = () => {
  return (
    <section id="about" className="section-padding-large bg-minimal">
      <div className="container-max">
        <div className="text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-heading-2">Como funciona</h2>
            <p className="text-body-large text-minimal-secondary max-w-2xl mx-auto">
              Transformamos processos complexos em fluxos automatizados simples
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Problema */}
            <div className="card-minimal text-center space-y-6">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-heading-3 text-red-400">Problema</h3>
                <p className="text-body text-minimal-accent font-medium">Bottleneck de Back-office</p>
              </div>
              <p className="text-body text-minimal-secondary">
                Gestoras independentes e boutiques de M&A perdem oportunidades porque tarefas de risco, crédito e reporting dependem de um back-office pequeno, afogado em planilhas e APIs complexas.
              </p>
            </div>
            
            {/* Solução */}
            <div className="card-minimal text-center space-y-6">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-heading-3 text-blue-400">Solução</h3>
                <p className="text-body text-minimal-accent font-medium">Camada de Workflow-AI</p>
              </div>
              <p className="text-body text-minimal-secondary">
                Um chatbot que converte solicitações do front-office em fluxos automatizados: coleta dados, executa ordens, gera documentos oficiais e entrega tudo pronto em um link n8n — sem código, sem fila, com logs auditáveis.
              </p>
            </div>
          </div>
          
          {/* Benefícios */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-heading-3 text-green-400">Rapidez</h4>
              <p className="text-body-small text-minimal-muted">
                Operações em segundos, não horas
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-heading-3 text-purple-400">Precisão</h4>
              <p className="text-body-small text-minimal-muted">
                Eliminação de erros manuais
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-orange-900/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-heading-3 text-orange-400">Auditabilidade</h4>
              <p className="text-body-small text-minimal-muted">
                Logs completos e transparentes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
