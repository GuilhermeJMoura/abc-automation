# Hackas Adapta - Dashboard

Uma plataforma completa de automação financeira com IA, desenvolvida com Next.js 14, TypeScript, TailwindCSS e shadcn/ui.

## 🚀 Funcionalidades

### Páginas Principais

1. **Dashboard** - KPI cards e feed de atividades em tempo real
2. **Visual Workflow Builder** - Construtor visual de workflows com palette de componentes
3. **Templates** - Grid responsivo de templates com busca e filtros
4. **Integrations** - Gerenciamento de credenciais com modal para OAuth/API Key
5. **Activity Log** - Timeline vertical com filtros de data e tipo
6. **404** - Página de erro com navegação de volta

### Layout e Componentes

- **Sidebar colapsível** com navegação por ícones
- **Toggle de tema** claro/escuro (footer da sidebar)
- **TopBar** com logo e título da página
- **Toast notifications** (configurado)
- **Componentes reutilizáveis**: KpiCard, ThemeToggle, ConfirmModal, etc.

### Tecnologia e Estilo

- **Next.js 14** com App Router
- **TypeScript** com tipagem estrita
- **TailwindCSS** com sistema de design customizado
- **React-Query** para gerenciamento de estado do servidor
- **Zustand** para estado da aplicação (sidebar, tema)
- **Framer Motion** para animações
- **Lucide React** para ícones
- **Date-fns** para formatação de datas

## 🎨 Design System

Mantém o padrão visual da landing page:

```css
/* Cores principais */
--landing-title: #ffffff      /* Texto principal */
--landing-highlight: #00d4ff  /* Destaque cyan */
--landing-text: #b0b0b0       /* Texto secundário */
--landing-border: #2d3748     /* Bordas */
--landing-tertiary: rgba(255, 255, 255, 0.1) /* Glassmorphism */
```

- **Background**: Preto sólido (#000000)
- **Cards**: Glassmorphism com backdrop-blur
- **Responsividade**: Mobile-first com breakpoints lg:
- **Tipografia**: Font Suisse (já configurada)

## 🛠 Desenvolvimento

### Instalação

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

### Testes

```bash
npm run test        # Executar testes
npm run test:ui     # Interface do Vitest
```

### Build

```bash
npm run build
npm run start
```

## 📁 Estrutura do Projeto

```
├── app/
│   ├── (dashboard)/           # Grupo de rotas do dashboard
│   │   ├── layout.tsx         # Layout com sidebar e providers
│   │   ├── dashboard/         # Página principal com KPIs
│   │   ├── workflows/         # Construtor visual
│   │   ├── templates/         # Grid de templates
│   │   ├── integrations/      # Gerenciamento de APIs
│   │   └── activity/          # Log de atividades
│   ├── not-found.tsx          # Página 404
│   └── layout.tsx             # Layout raiz
├── src/
│   ├── components/
│   │   ├── layout/            # Sidebar, TopBar, AppLayout
│   │   └── ui/                # Componentes reutilizáveis
│   ├── hooks/
│   │   └── use-api.ts         # Hooks React-Query
│   ├── store/
│   │   └── app.ts             # Store Zustand
│   └── providers/
│       └── query-provider.tsx # Provider React-Query
└── __tests__/                 # Testes Vitest
```

## 🔧 Funcionalidades Técnicas

### Gerenciamento de Estado

- **Zustand**: Estado da UI (sidebar aberta/fechada, tema)
- **React-Query**: Cache e sincronização de dados da API
- **Form state**: useState local nos formulários

### Data Fetching

- **Hooks customizados** com React-Query
- **Mock APIs** com delays realistas
- **Refetch automático** para dados em tempo real
- **Loading states** com skeleton loaders

### Responsividade

- **Mobile-first** design
- **Sidebar colapsível** em telas menores
- **Grid adaptativo** nos templates e KPIs
- **Typography scale** responsiva

### Qualidade de Código

- **TypeScript** estrito com interfaces bem definidas
- **ESLint** configurado
- **Vitest** para testes unitários
- **Componentes isolados** (um por arquivo)

## 🔗 Integrações Planejadas

A aplicação está preparada para integrar com:

- **APIs de mercado financeiro** (B3, Bloomberg)
- **Sistemas bancários** (Open Banking)
- **Plataformas de compliance** (CVM)
- **Ferramentas de automação** (n8n, Zapier)

## 📱 Responsividade

- **Mobile**: Sidebar se torna overlay
- **Tablet**: Layout adaptado com grid 2 colunas
- **Desktop**: Layout completo com sidebar fixa
- **4K+**: Otimizado para telas grandes

## 🧪 Testes

Exemplo de teste incluído para KpiCard:

```typescript
describe('KpiCard', () => {
  it('renders metric and caption correctly', () => {
    render(<KpiCard icon={Activity} metric="156" caption="Execuções Hoje" />)
    expect(screen.getByText('156')).toBeInTheDocument()
  })
})
```

---

**Desenvolvedores**: Hackas Team  
**Versão**: 1.0.0  
**Licença**: MIT