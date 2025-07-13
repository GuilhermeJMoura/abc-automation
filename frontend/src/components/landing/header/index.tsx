'use client'

import { useState } from 'react'
import Image from 'next/image'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-minimal'>
      <div className="container-max">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {!logoError ? (
              <Image 
                src="/logo.png" 
                alt="Hackas Logo" 
                width={64} 
                height={64}
                className="w-14 h-120"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-12 h-12 bg-minimal-accent rounded flex items-center justify-center">
                <span className="text-black font-bold text-lg">H</span>
              </div>
            )}
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#about" 
              className="text-body text-minimal-secondary hover:text-minimal-accent transition-colors duration-200"
            >
              Sobre
            </a>
            <a 
              href="#vision" 
              className="text-body text-minimal-secondary hover:text-minimal-accent transition-colors duration-200"
            >
              Visão
            </a>
            <a 
              href="#roadmap" 
              className="text-body text-minimal-secondary hover:text-minimal-accent transition-colors duration-200"
            >
              Roadmap
            </a>
            <a 
              href="#resources" 
              className="text-body text-minimal-secondary hover:text-minimal-accent transition-colors duration-200"
            >
              Recursos
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="/chatbot" 
              className="btn-primary"
            >
              Começar
            </a>
          </div>
          
          <button 
            className="md:hidden p-2 text-minimal-secondary hover:text-minimal-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-minimal border-t border-minimal">
            <nav className="flex flex-col py-4 space-y-4">
              <a 
                href="#about" 
                className="text-body text-minimal-secondary hover:text-minimal-accent transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </a>
              <a 
                href="#vision" 
                className="text-body text-minimal-secondary hover:text-minimal-accent transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Visão
              </a>
              <a 
                href="#roadmap" 
                className="text-body text-minimal-secondary hover:text-minimal-accent transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Roadmap
              </a>
              <a 
                href="#resources" 
                className="text-body text-minimal-secondary hover:text-minimal-accent transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Recursos
              </a>
              <a 
                href="/chatbot" 
                className="btn-primary w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Começar
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header