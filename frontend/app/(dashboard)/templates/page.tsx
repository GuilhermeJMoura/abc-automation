'use client'

import { useState } from 'react'
import { Search, Filter, Play } from 'lucide-react'
import { useTemplates } from '@/hooks/use-api'

export default function TemplatesPage() {
  const { data: templates, isLoading } = useTemplates()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'Câmbio', 'Risco', 'Crédito', 'Compliance']

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Câmbio': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Risco': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'Crédito': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Compliance': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-landing-border/20 text-landing-text border-landing-border'
    }
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-landing-text" />
          <input
            type="text"
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-landing-tertiary border border-landing-border rounded-lg text-landing-title placeholder-landing-text focus:outline-none focus:border-landing-highlight/50 backdrop-blur-md"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-landing-text" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 bg-landing-tertiary border border-landing-border rounded-lg text-landing-title focus:outline-none focus:border-landing-highlight/50 backdrop-blur-md"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-black">
                {category === 'all' ? 'Todas as categorias' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-landing-tertiary border border-landing-border rounded-xl p-6 backdrop-blur-md animate-pulse">
              <div className="w-full h-48 bg-landing-border rounded-lg mb-4"></div>
              <div className="w-3/4 h-6 bg-landing-border rounded mb-2"></div>
              <div className="w-16 h-5 bg-landing-border rounded mb-3"></div>
              <div className="w-full h-4 bg-landing-border rounded mb-2"></div>
              <div className="w-2/3 h-4 bg-landing-border rounded mb-4"></div>
              <div className="w-20 h-8 bg-landing-border rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates?.map((template) => (
            <div key={template.id} className="bg-landing-tertiary border border-landing-border rounded-xl p-6 backdrop-blur-md hover:border-landing-highlight/50 transition-colors group">
              <div className="w-full h-48 bg-landing-border rounded-lg mb-4 flex items-center justify-center">
                <Play className="w-12 h-12 text-landing-highlight opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h3 className="text-lg font-semibold text-landing-title mb-2 line-clamp-2">
                {template.title}
              </h3>
              
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium border mb-3 ${getCategoryColor(template.category)}`}>
                {template.category}
              </div>
              
              <p className="text-landing-text text-sm mb-4 line-clamp-3">
                {template.description}
              </p>
              
              <button className="w-full bg-landing-highlight text-black py-2 px-4 rounded-lg font-medium hover:bg-landing-highlight/90 transition-colors">
                Usar Template
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredTemplates?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-landing-text">Nenhum template encontrado com os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
} 