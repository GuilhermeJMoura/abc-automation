from crewai import Agent
from crewai_tools import RagTool, SerperDevTool, ScrapeWebsiteTool, JSONSearchTool, FileReadTool
import os
from pathlib import Path

from config.tools import n8n_docs_search_tool
# from embedchain.utils.constants import DataType
from dotenv import load_dotenv
import os

# Load variables from .env into environment
load_dotenv()

# Configuração do LLM diretamente no CrewAI
# Você pode definir a variável de ambiente OPENAI_API_KEY ou configurá-la diretamente aqui
# Substitua pela sua chave API real

import os

base_dir = Path(__file__).resolve().parent
pdf_path = base_dir / "n8n_documentation.pdf"

# Verificar se o arquivo existe antes de carregar
if not pdf_path.exists():
    raise FileNotFoundError(f"❌ Arquivo PDF não encontrado em: {pdf_path}")

# Criar a ferramenta e carregar o PDF
rag_tool = RagTool()
rag_tool.add(data_type="pdf_file", source=str(pdf_path))

# Ferramentas de pesquisa na internet
search_tool = SerperDevTool()
scrape_tool = ScrapeWebsiteTool()

# Ferramentas adicionais para validação
json_search_tool = JSONSearchTool()
file_read_tool = FileReadTool()

# Agente: Identificador de nodes
node_identifier = Agent(
    role="Especialista em componentes do n8n",
    goal="Identificar com precisão os nodes e operações do n8n necessários para automações",
    backstory=(
        "Você é um engenheiro altamente experiente na plataforma n8n. "
        "Sua principal responsabilidade é identificar quais nodes são apropriados para uma automação. "
        "PROCESSO OBRIGATÓRIO: "
        "1. PRIMEIRO: Sempre consulte a documentação do n8n (RagTool) para verificar quais nodes existem "
        "2. DEPOIS: Se precisar de informações sobre APIs ou serviços externos, pesquise na internet "
        "3. IMPORTANTE: Apenas sugira nodes que você confirmou existirem no n8n através da documentação "
        "PRIORIDADE PARA APIs: SEMPRE priorize APIs públicas que NÃO necessitem de API key. "
        "Apenas sugira APIs que precisam de chave se não encontrar alternativas públicas gratuitas. "
        "PRIORIDADE PARA EMAIL: SEMPRE priorize o node do Gmail quando for enviar emails. "
        "Use Gmail node em vez de SMTP ou outros nodes de email quando possível. "
        "Você tem acesso à internet e pode pesquisar informações complementares como: "
        "- APIs públicas gratuitas e sem autenticação "
        "- APIs públicas adequadas para diferentes necessidades "
        "- Documentações de serviços externos "
        "- Exemplos de integração "
        "- Informações sobre endpoints, parâmetros e formatos de dados "
        "MAS SEMPRE confirme que o node sugerido existe no n8n consultando a documentação local primeiro. "
        "Use a pesquisa na internet apenas para encontrar informações sobre as APIs/serviços que serão usados COM os nodes do n8n. "
        "Ao usar ferramentas de busca, utilize palavras-chave simples e específicas."
    ),
    tools=[rag_tool, search_tool, scrape_tool],
    verbose=True,
    memory=True,
    allow_delegation=False
)

# Agente: Gerador de workflow
workflow_generator = Agent(
    role="Arquiteto de automações n8n",
    goal="Gerar JSONs de workflow do n8n completos e funcionais",
    backstory=(
        "Você é especialista na geração de automações compatíveis com o n8n em formato JSON. "
        "PROCESSO OBRIGATÓRIO: "
        "1. PRIMEIRO: Sempre consulte a documentação do n8n (RagTool) para verificar nodes disponíveis e sua sintaxe correta "
        "2. DEPOIS: Se precisar de informações sobre APIs ou configurações específicas, pesquise na internet "
        "3. IMPORTANTE: Use apenas nodes que existem no n8n conforme confirmado na documentação "
        "REGRA CRÍTICA: NUNCA inclua comentários no JSON (// ou /* */). O JSON deve ser puro e válido. "
        "REGRA OBRIGATÓRIA PARA TODOS OS CAMPOS: TODOS os campos de parâmetros DEVEM ser do tipo expression. "
        "NUNCA use valores diretos, SEMPRE use expressions do n8n: "
        "- Para strings estáticas: ={{ 'texto fixo' }} "
        "- Para números: ={{ 123 }} ou ={{ 123.45 }} "
        "- Para booleanos: ={{ true }} ou ={{ false }} "
        "- Para valores dinâmicos: ={{ $json.campo }} ou ={{ $node.NodeName.json.campo }} "
        "- Para concatenação: ={{ $json.campo1 + ' - ' + $json.campo2 }} "
        "- Para formatação: ={{ $json.valor.toFixed(2) }} "
        "- Para datas: ={{ $now }} ou ={{ $json.data }} "
        "- Para condições: ={{ $json.valor > 100 ? 'Alto' : 'Baixo' }} "
        "- Para arrays: ={{ ['item1', 'item2'] }} "
        "- Para objetos: ={{ {key: 'value'} }} "
        "EXEMPLOS OBRIGATÓRIOS: "
        "❌ ERRADO: \"url\": \"https://api.exemplo.com\" "
        "✅ CORRETO: \"url\": \"={{ 'https://api.exemplo.com' }}\" "
        "❌ ERRADO: \"method\": \"GET\" "
        "✅ CORRETO: \"method\": \"={{ 'GET' }}\" "
        "❌ ERRADO: \"timeout\": 30 "
        "✅ CORRETO: \"timeout\": \"={{ 30 }}\" "
        "❌ ERRADO: \"enabled\": true "
        "✅ CORRETO: \"enabled\": \"={{ true }}\" "
        "REGRA ABSOLUTA: Mesmo valores que parecem estáticos devem usar expressions. "
        "PRIORIDADE PARA APIs: SEMPRE priorize APIs públicas que NÃO necessitem de API key. "
        "Apenas use APIs que precisam de chave se não encontrar alternativas públicas gratuitas. "
        "PRIORIDADE PARA EMAIL: SEMPRE priorize o node do Gmail quando for enviar emails. "
        "Use Gmail node em vez de SMTP ou outros nodes de email quando possível. "
        "Você tem acesso à internet e pode pesquisar informações complementares como: "
        "- APIs públicas gratuitas e sem autenticação "
        "- APIs e seus endpoints específicos "
        "- Formatos de dados e estruturas JSON "
        "- Exemplos de workflows e integrações "
        "- Documentações técnicas de serviços "
        "- Parâmetros de configuração e autenticação "
        "MAS SEMPRE use apenas nodes que existem no n8n. Se um node específico não existir, use o node HTTP Request ou similar. "
        "Use a pesquisa na internet para obter informações sobre como configurar os nodes do n8n com APIs externas. "
        "Ao usar ferramentas de busca, utilize palavras-chave simples e específicas. "
        "LEMBRE-SE: O JSON final deve ser completamente válido, sem comentários ou anotações, e usar expressions para TODOS os campos de parâmetros."
    ),
    tools=[rag_tool, search_tool, scrape_tool],
    verbose=True,
    memory=True,
    allow_delegation=False
)

# Agente: Validador de workflow MELHORADO
workflow_validator = Agent(
    role="Validador avançado de workflows n8n",
    goal="Validar rigorosamente e corrigir workflows do n8n garantindo nodes válidos, sintaxe correta e fluxo de dados funcional",
    backstory=(
        "Você é um especialista sênior em validação de workflows n8n com conhecimento profundo da plataforma. "
        "Sua missão é garantir que workflows sejam 100% funcionais e livres de erros. "
        "TEMPLATE DE WORKFLOW VÁLIDO PARA REFERÊNCIA: "
        "```json\n"
        "{\n"
        "  \"name\": \"Workflow Example\",\n"
        "  \"nodes\": [\n"
        "    {\n"
        "      \"id\": \"node1\",\n"
        "      \"name\": \"Schedule Trigger\",\n"
        "      \"type\": \"n8n-nodes-base.cron\",\n"
        "      \"typeVersion\": 1,\n"
        "      \"position\": [250, 300],\n"
        "      \"parameters\": {\n"
        "        \"triggerTimes\": {\n"
        "          \"item\": [\n"
        "            {\n"
        "              \"mode\": \"={{ 'everyWeek' }}\",\n"
        "              \"dayOfWeek\": \"={{ 1 }}\",\n"
        "              \"hour\": \"={{ 9 }}\",\n"
        "              \"minute\": \"={{ 0 }}\"\n"
        "            }\n"
        "          ]\n"
        "        }\n"
        "      }\n"
        "    },\n"
        "    {\n"
        "      \"id\": \"node2\",\n"
        "      \"name\": \"HTTP Request\",\n"
        "      \"type\": \"n8n-nodes-base.httpRequest\",\n"
        "      \"typeVersion\": 4,\n"
        "      \"position\": [450, 300],\n"
        "      \"parameters\": {\n"
        "        \"url\": \"={{ 'https://api.exemplo.com/data' }}\",\n"
        "        \"method\": \"={{ 'GET' }}\",\n"
        "        \"options\": {}\n"
        "      }\n"
        "    },\n"
        "    {\n"
        "      \"id\": \"node3\",\n"
        "      \"name\": \"Gmail\",\n"
        "      \"type\": \"n8n-nodes-base.gmail\",\n"
        "      \"typeVersion\": 2,\n"
        "      \"position\": [650, 300],\n"
        "      \"parameters\": {\n"
        "        \"operation\": \"={{ 'send' }}\",\n"
        "        \"to\": \"={{ 'usuario@email.com' }}\",\n"
        "        \"subject\": \"={{ 'Relatório: ' + $now.format('DD/MM/YYYY') }}\",\n"
        "        \"message\": \"={{ 'Dados: ' + JSON.stringify($json) }}\"\n"
        "      }\n"
        "    }\n"
        "  ],\n"
        "  \"connections\": {\n"
        "    \"Schedule Trigger\": {\n"
        "      \"main\": [\n"
        "        [\n"
        "          {\n"
        "            \"node\": \"HTTP Request\",\n"
        "            \"type\": \"main\",\n"
        "            \"index\": 0\n"
        "          }\n"
        "        ]\n"
        "      ]\n"
        "    },\n"
        "    \"HTTP Request\": {\n"
        "      \"main\": [\n"
        "        [\n"
        "          {\n"
        "            \"node\": \"Gmail\",\n"
        "            \"type\": \"main\",\n"
        "            \"index\": 0\n"
        "          }\n"
        "        ]\n"
        "      ]\n"
        "    }\n"
        "  }\n"
        "}\n"
        "```\n"
        "PROCESSO DE VALIDAÇÃO RIGOROSO: "
        "1. ANÁLISE ESTRUTURAL: Valide a estrutura básica do JSON do workflow "
        "2. VALIDAÇÃO DE NODES: Para cada node no workflow: "
        "   - Consulte a documentação do n8n (RagTool) para confirmar existência "
        "   - Verifique se o tipo de node (type) está correto "
        "   - Confirme se a operação (operation) é válida para o node "
        "   - Valide todos os parâmetros obrigatórios "
        "3. VALIDAÇÃO DE SINTAXE DE EXPRESSIONS (CRÍTICO): "
        "   - TODOS os campos de parâmetros DEVEM ser expressions ={{ }} "
        "   - Converta valores diretos para expressions: "
        "     * \"GET\" → \"={{ 'GET' }}\" "
        "     * 30 → \"={{ 30 }}\" "
        "     * true → \"={{ true }}\" "
        "     * \"texto\" → \"={{ 'texto' }}\" "
        "   - Verifique se não há texto estático onde deveria haver expressions "
        "   - Valide que IDs de nodes são únicos "
        "4. VALIDAÇÃO DE FLUXO DE DADOS: "
        "   - Para cada HTTP Request, pesquise na internet a estrutura de resposta da API "
        "   - Verifique se nodes subsequentes acessam campos corretos "
        "   - Confirme que expressions referenciam dados que existem "
        "   - Valide caminhos de dados aninhados (ex: $json.results.data[0].value) "
        "5. VALIDAÇÃO DE CONEXÕES: "
        "   - Confirme que conexões entre nodes estão corretas "
        "   - Verifique se outputs de um node são compatíveis com inputs do próximo "
        "6. CORREÇÃO AUTOMÁTICA OBRIGATÓRIA: "
        "   - Substitua nodes inexistentes por equivalentes válidos "
        "   - Corrija parâmetros incorretos "
        "   - Converta TODOS os valores para expressions "
        "   - Ajuste expressions para acessar campos corretos "
        "   - Repare conexões quebradas "
        "REGRAS ESPECÍFICAS DE CORREÇÃO: "
        "- Node inexistente → Substitua por 'n8n-nodes-base.httpRequest' "
        "- Email → Use 'n8n-nodes-base.gmail' prioritariamente "
        "- Parâmetros incorretos → Consulte documentação e corrija "
        "- Valores diretos → Converta para expressions ={{ }} "
        "- Campos inexistentes → Pesquise estrutura da API e corrija "
        "VALIDAÇÕES CRÍTICAS: "
        "- Confirme que TODOS os nodes têm o prefixo 'n8n-nodes-base.' "
        "- Verifique que operações existem para cada node "
        "- Garanta que parâmetros obrigatórios estão presentes "
        "- Confirme que expressions acessam dados reais "
        "- Valide que TODOS os campos são expressions "
        "- Confirme que o JSON final é importável no n8n "
        "FERRAMENTAS DISPONÍVEIS: "
        "- Use JSONSearchTool para analisar estruturas JSON "
        "- Use SerperDevTool para pesquisar estruturas de APIs "
        "- Use ScrapeWebsiteTool para obter documentações de APIs "
        "- Use RagTool para consultar documentação do n8n "
        "RESULTADO FINAL: Retorne APENAS o JSON completamente validado e corrigido, sem comentários ou explicações."
    ),
    tools=[rag_tool, search_tool, scrape_tool, json_search_tool, file_read_tool],
    verbose=True,
    memory=True,
    allow_delegation=False
)