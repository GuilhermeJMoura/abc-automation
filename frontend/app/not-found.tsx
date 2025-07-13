'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="text-8xl font-bold text-primary mb-4">404</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Página não encontrada</h1>
          <p className="text-muted-foreground text-lg">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir para Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-lg hover:border-primary/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Se você acredita que isso é um erro, por favor entre em contato conosco.</p>
        </div>
      </div>
    </div>
  )
} 