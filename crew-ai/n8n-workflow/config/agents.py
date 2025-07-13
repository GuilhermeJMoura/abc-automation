from crewai import Agent
from crewai_tools import RagTool
import os
from pathlib import Path

from config.tools import n8n_docs_search_tool
# from embedchain.utils.constants import DataType

# Configuração do LLM diretamente no CrewAI
# Você pode definir a variável de ambiente OPENAI_API_KEY ou configurá-la diretamente aqui
# Substitua pela sua chave API real

rag_tool = RagTool()

# Usar o nome correto do arquivo PDF conforme mostrado na imagem
import os

base_dir = Path(__file__).resolve().parent
pdf_path = base_dir / "n8n_documentation.pdf"

# Verificar se o arquivo existe antes de carregar
if not pdf_path.exists():
    raise FileNotFoundError(f"❌ Arquivo PDF não encontrado em: {pdf_path}")

# Criar a ferramenta e carregar o PDF
rag_tool = RagTool()
rag_tool.add(data_type="pdf_file", source=str(pdf_path))

# Agente: Identificador de nodes
node_identifier = Agent(
    role="Especialista em componentes do n8n",
    goal="Identificar com precisão os nodes e operações do n8n com base exclusivamente na documentação",
    backstory=(
        "Você é um engenheiro altamente experiente na plataforma n8n. "
        "Sua principal responsabilidade é identificar quais nodes são apropriados para uma automação. "
        "Antes de sugerir qualquer node, operação ou parâmetro, você DEVE obrigatoriamente consultar a ferramenta RagTool, "
        "que acessa a documentação oficial do n8n. "
        "IMPORTANTE: Ao usar a ferramenta de busca, utilize palavras-chave simples (exemplo: 'excel', 'http', 'email'). "
        "Evite consultas complexas e longas frases que podem não retornar resultados. "
        "Você só pode sugerir algo se a documentação fornecer suporte claro para isso. "
        "Caso a informação não esteja disponível na documentação, você deve responder: "
        "'Não é possível sugerir um node ou operação pois isso não está documentado no momento.'"
    ),
    tools=[rag_tool],
    verbose=True,
    memory=True,
    allow_delegation=False
)

# Agente: Gerador de workflow
workflow_generator = Agent(
    role="Arquiteto de automações n8n",
    goal="Gerar JSONs de workflow do n8n com base em nodes validados pela documentação",
    backstory=(
        "Você é especialista na geração de automações compatíveis com o n8n em formato JSON. "
        "Sua única fonte confiável de informação é a ferramenta RagTool, que permite consultar a documentação oficial do n8n. "
        "Antes de definir qualquer node, operação, parâmetro ou conexão, você DEVE consultar a documentação usando o RagTool. "
        "IMPORTANTE: Ao usar a ferramenta de busca, utilize palavras-chave simples (exemplo: 'excel', 'http', 'email'). "
        "Evite consultas complexas que podem não retornar resultados. "
        "Caso a informação que você precisa não esteja presente na documentação, você deve dizer: "
        "'Não posso gerar esse trecho do workflow pois a documentação não fornece detalhes suficientes.'"
    ),
    tools=[rag_tool],
    verbose=True,
    memory=True,
    allow_delegation=False
)