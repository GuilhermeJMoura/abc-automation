const data = [
  {
    title: 'Stage 1',
    subtitle: 'MVP',
    focus: 'Prova de valor',
    description: 'Desenvolvimento da interface fundamental e validação dos fluxos core de automação financeira.',
    items: [
      'Interface de chat intuitiva com feedback visual de processamento',
      'Implementação de fluxos automatizados para hedge dinâmico USD/BRL',
      'Sistema de geração de relatórios PnL diários',
      'Validação de conceito com gestoras parceiras'
    ]
  },
  {
    title: 'Stage 2',
    subtitle: 'Piloto',
    focus: 'Integrações reais',
    description: 'Expansão das integrações com sistemas reais e implementação de controles de risco.',
    items: [
      'Conectores nativos com principais custódias e prime brokers',
      'Sistema Guardian para monitoramento e aplicação de políticas de risco',
      'Integração com APIs de mercado em tempo real',
      'Piloto com 5-10 gestoras independentes'
    ]
  },
  {
    title: 'Stage 3',
    subtitle: 'Mercado',
    focus: 'Escala e receita',
    description: 'Monetização da plataforma através de marketplace e planos enterprise.',
    items: [
      'Marketplace de templates de fluxos para diferentes estratégias',
      'Planos Enterprise com VPC dedicada e SLA garantido',
      'Sistema de billing e gestão de assinaturas',
      'Expansão para 100+ gestoras ativas'
    ]
  },
  {
    title: 'Stage 4',
    subtitle: 'Expansão',
    focus: 'Ecossistema',
    description: 'Criação de um ecossistema completo com suporte internacional e parcerias estratégicas.',
    items: [
      'SDK completo para parceiros e integradores',
      'Suporte multilíngue (PT-EN-ES) com localizações regionais',
      'Integração com Open Banking e sistemas de pagamento',
      'Parcerias com grandes instituições financeiras'
    ]
  }
]

const Roadmap = () => {
  return (
    <section id="roadmap" className="section-padding-large bg-minimal">
      <div className="container-max">
        <div className="text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-heading-2">Roadmap</h2>
            <p className="text-body-large text-minimal-secondary max-w-2xl mx-auto">
              Nossa jornada de evolução rumo à automação completa das operações financeiras
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.map((stage, index) => (
              <div key={index} className="card-minimal space-y-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-minimal-accent rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-heading-3 text-minimal-primary">{stage.subtitle}</h3>
                      <p className="text-body-small text-minimal-muted">Foco: {stage.focus}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-body text-minimal-secondary">
                  {stage.description}
                </p>
                
                <div className="space-y-4">
                  <h4 className="text-body font-semibold text-minimal-primary">Entregas-chave:</h4>
                  <ul className="space-y-2">
                    {stage.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-minimal-accent rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-body-small text-minimal-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Roadmap