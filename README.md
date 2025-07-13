# ABC Automation - Integração Completa

Sistema completo de automação com agents AI, backend Node.js e frontend Next.js.

## Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Crew AI       │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Python)      │
│                 │    │                 │    │                 │
│ - React Query   │    │ - Express       │    │ - CrewAI        │
│ - WebSocket     │    │ - WebSocket     │    │ - OpenAI        │
│ - Tailwind      │    │ - REST API      │    │ - Flask         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                  ┌─────────────────┐
                  │      n8n        │
                  │   (Workflows)   │
                  └─────────────────┘
```

## Pré-requisitos

- Node.js 18+ e npm/yarn
- Python 3.8+
- n8n instalado e rodando
- Chave da API OpenAI

## Configuração do Ambiente

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Backend Configuration
PORT=4000
NODE_ENV=development

# Crew AI Configuration
CREW_AI_BASE_URL=http://localhost:5000
OPENAI_API_KEY=sk-your-openai-key-here

# n8n Configuration
N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=your-n8n-api-key-here

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

### 2. Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Crew AI
cd ../crew-ai
pip install -r requirements.txt
```

## Iniciando o Sistema

### 1. Iniciar n8n (Terminal 1)
```bash
n8n start
```

### 2. Iniciar Crew AI (Terminal 2)
```bash
cd crew-ai
python start_crew_ai.py
```

### 3. Iniciar Backend (Terminal 3)
```bash
cd backend
npm run dev
```

### 4. Iniciar Frontend (Terminal 4)
```bash
cd frontend
npm run dev
```

## Testando a Integração

### 1. Teste Básico de Conexão

```bash
# Testar Backend
curl http://localhost:4000/api/workflows

# Testar Crew AI
curl -X POST http://localhost:5000/generate-workflow \
  -H "Content-Type: application/json" \
  -d '{"user_prompt": "Criar um workflow de teste"}'
```

### 2. Teste de Fluxo Completo

1. Acesse `http://localhost:3000/workflows/create`
2. Digite um prompt: "Quero criar um relatório semanal de vendas"
3. Responda às perguntas de clarificação
4. Observe o progresso em tempo real
5. Verifique o workflow criado

### 3. Teste de WebSocket

```javascript
// Teste no console do navegador
const ws = new WebSocket('ws://localhost:4000')
ws.onmessage = (event) => {
  console.log('Mensagem recebida:', JSON.parse(event.data))
}
ws.onopen = () => {
  console.log('WebSocket conectado')
}
```

## Funcionalidades Implementadas

### ✅ Backend (Node.js/Express)
- ✅ API REST para workflows
- ✅ WebSocket para comunicação em tempo real
- ✅ Integração com Crew AI
- ✅ Integração com n8n
- ✅ Tratamento de erros robusto
- ✅ Configuração centralizada

### ✅ Frontend (Next.js/React)
- ✅ Interface para criação de workflows
- ✅ Fluxo de clarificação interativo
- ✅ Comunicação WebSocket em tempo real
- ✅ Sistema de notificações (toasts)
- ✅ Listagem e visualização de workflows
- ✅ Tratamento de erros elegante

### ✅ Crew AI (Python)
- ✅ API Flask para comunicação
- ✅ Agents para clarificação
- ✅ Geração de workflows n8n
- ✅ Integração com OpenAI

### ✅ Integração Completa
- ✅ Fluxo end-to-end funcional
- ✅ Comunicação entre todas as camadas
- ✅ Progresso em tempo real
- ✅ Tratamento de erros em todas as camadas

## Estrutura de Arquivos

```
.
├── backend/
│   ├── config/
│   │   └── env.js              # Configuração centralizada
│   ├── controllers/
│   │   └── workflowController.js
│   ├── middlewares/
│   │   └── errorMiddleware.js  # Tratamento de erros
│   ├── routes/
│   │   └── workflowRoutes.js
│   ├── services/
│   │   ├── agentService.js
│   │   ├── websocketService.js
│   │   ├── workflowService.js
│   │   └── n8nService.js
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── app/
│   │   ├── workflows/
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   └── input.tsx
│   │   │   └── workflow/
│   │   │       ├── WorkflowCreator.tsx
│   │   │       └── WorkflowList.tsx
│   │   ├── hooks/
│   │   │   └── useWebSocket.ts
│   │   ├── providers/
│   │   │   └── ToastProvider.tsx
│   │   └── services/
│   │       ├── api.ts
│   │       └── websocket.ts
│   └── package.json
├── crew-ai/
│   ├── n8n-workflow/
│   │   ├── api.py
│   │   ├── crew_ai.py
│   │   └── config/
│   │       ├── agents.py
│   │       ├── tasks.py
│   │       └── tools.py
│   ├── start_crew_ai.py
│   └── requirements.txt
└── README.md
```

## Solução de Problemas

### Erro: "OPENAI_API_KEY não está configurada"
- Verifique se a chave está correta no arquivo `.env`
- Certifique-se de que o arquivo `.env` está na raiz do projeto

### Erro: "Erro de conexão com serviço externo"
- Verifique se o n8n está rodando na porta 5678
- Verifique se o Crew AI está rodando na porta 5000
- Confirme as URLs nos arquivos de configuração

### WebSocket não conecta
- Verifique se o backend está rodando na porta 4000
- Confirme a variável `NEXT_PUBLIC_WS_URL` no frontend

### Workflows não são listados
- Verifique a conexão com n8n
- Confirme se a API key do n8n está correta
- Verifique os logs do backend para erros

## Próximos Passos

1. **Autenticação**: Implementar sistema de login/registro
2. **Banco de Dados**: Adicionar persistência de dados
3. **Monitoramento**: Logs e métricas de performance
4. **Testes**: Suíte de testes automatizados
5. **Deploy**: Configuração para produção

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

MIT License - veja o arquivo LICENSE para detalhes.