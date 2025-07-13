const Verticals = () => {
  return (
    <div id="vision" className="py-32 bg-landing-tertiary/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-16">
          <h2 className="text-landing-title text-4xl lg:text-5xl font-bold">Conectividade Global</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="bg-landing-tertiary border border-landing-border rounded-2xl p-8 hover:border-landing-highlight transition-all duration-300 hover:scale-105">
              <img src="/landing/icons8-gmail.svg" alt="Email Integration" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-landing-title text-sm font-semibold">Email</h3>
            </div>
            <div className="bg-landing-tertiary border border-landing-border rounded-2xl p-8 hover:border-landing-highlight transition-all duration-300 hover:scale-105">
              <img src="/landing/icons8-slack-logo.svg" alt="Slack Integration" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-landing-title text-sm font-semibold">Slack</h3>
            </div>
            <div className="bg-landing-tertiary border border-landing-border rounded-2xl p-8 hover:border-landing-highlight transition-all duration-300 hover:scale-105">
              <img src="/landing/icons8-whatsapp.svg" alt="WhatsApp Integration" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-landing-title text-sm font-semibold">WhatsApp</h3>
            </div>
            <div className="bg-landing-tertiary border border-landing-border rounded-2xl p-8 hover:border-landing-highlight transition-all duration-300 hover:scale-105">
              <img src="/landing/icons8-twitterx.svg" alt="X Integration" className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-landing-title text-sm font-semibold">X (Twitter)</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Verticals
