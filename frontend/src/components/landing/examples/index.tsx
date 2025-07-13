const Examples = () => {
  const examples = [
    {
      title: "Hedge Automático",
      description: "Ajustar hedge USD/BRL sempre que oscilar ±0,75%, split 60% corretora A e 40% DEX."
    },
    {
      title: "Bridge Loan",
      description: "Gerar bridge-loan memo de R$ 20 mi para Target S.A., coletar balanço e enviar para assinatura."
    },
    {
      title: "Margin Call",
      description: "Executar margin call automática se equity ratio cair abaixo de 110% em qualquer prime."
    },
    {
      title: "Stress Test",
      description: "Rodar stress-test +300 bps na curva DI, gerar CSV e enviar à CVM em até 48 h."
    },
    {
      title: "Earn-out",
      description: "Verificar cláusula de earn-out trimestral, calcular valor devido e disparar pagamento via ERP."
    }
  ]

  return (
    <div className="flex flex-col gap-8 mt-20">
      <h2 className="text-landing-title text-3xl lg:text-5xl px-14">Exemplos de Prompt</h2>
      <div className="w-full border-y border-landing-border py-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 md:px-12">
          {examples.map((example, index) => (
            <div key={index} className="flex flex-col gap-4 p-6 bg-landing-tertiary rounded-[20px] border border-landing-border">
              <h3 className="text-landing-highlight text-xl font-semibold">{example.title}</h3>
              <p className="text-landing-text text-sm leading-relaxed">{example.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Examples 