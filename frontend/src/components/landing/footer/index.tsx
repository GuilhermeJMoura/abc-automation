'use client'

import Image from 'next/image'
import { useState } from 'react'

const Footer = () => {
  const [logoError, setLogoError] = useState(false)

  return (
    <footer id="resources" className="section-padding bg-minimal border-t border-minimal">
      <div className="container-max">
        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              {!logoError ? (
                <Image 
                  src="/logo.png" 
                  alt="Hackas Logo" 
                  width={32} 
                  height={32}
                  className="w-8 h-8"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-8 h-8 bg-minimal-accent rounded flex items-center justify-center">
                  <span className="text-black font-bold text-sm">H</span>
                </div>
              )}
            </div>
            <p className="text-body text-minimal-secondary max-w-md mx-auto md:mx-0">
              Automatizando o futuro das operações financeiras com IA. Transforme processos complexos em fluxos simples e eficientes.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-heading-3 text-minimal-primary">Contato</h3>
            <ul className="space-y-2 text-minimal-secondary">
              <li>
                <a 
                  href="mailto:contato@hackas.com" 
                  className="text-body hover:text-minimal-accent transition-colors duration-200"
                >
                  contato@hackas.com
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-heading-3 text-minimal-primary">Recursos</h3>
            <ul className="space-y-2 text-minimal-secondary">
              <li>
                <a 
                  href="https://docs.hackas.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-body hover:text-minimal-accent transition-colors duration-200"
                >
                  Documentação
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/hackas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-body hover:text-minimal-accent transition-colors duration-200"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-minimal text-center">
          <p className="text-body-small text-minimal-muted">
            © 2024 ABC - All but Code. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer