'use client'

import { usePathname } from 'next/navigation'

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/workflows': 'Visual Workflow Builder',
  '/templates': 'Templates',
  '/integrations': 'Integrations',
  '/activity': 'Activity Log',
}

export default function TopBar() {
  const pathname = usePathname()
  const pageName = pageNames[pathname] || 'Hackas Adapta'

  return (
    <div className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">H</span>
              </div>
              <span className="text-foreground font-semibold">Hackas Adapta</span>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <h1 className="text-xl font-semibold text-foreground">{pageName}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 