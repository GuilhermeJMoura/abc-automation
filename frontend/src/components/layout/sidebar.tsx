'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Workflow, 
  Layout, 
  Plug, 
  Activity, 
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Key
} from 'lucide-react'
import { useAppStore } from '@/store/app'
import ThemeToggle from '@/components/ui/theme-toggle'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'Templates', href: '/templates', icon: Layout },
  { name: 'Integrations', href: '/integrations', icon: Plug },
  { name: 'Activity', href: '/activity', icon: Activity },
  { name: 'Chatbot Workflows', href: '/chatbot/workflows', icon: GitBranch },
  { name: 'Credentials', href: '/chatbot/credentials', icon: Key },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <div className={`bg-card border-r border-border shadow-sm transition-all duration-300 ${
      sidebarOpen ? 'w-64' : 'w-16'
    } flex flex-col h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">H</span>
              </div>
              <span className="text-foreground font-semibold">Hackas</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-lg bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className={`flex ${sidebarOpen ? 'justify-between' : 'justify-center'} items-center`}>
          <ThemeToggle />
          {sidebarOpen && (
            <div className="text-xs text-muted-foreground">
              v1.0.0
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 