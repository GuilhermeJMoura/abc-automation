from crewai import Agent
import os
from config.tools import n8n_docs_search_tool

# Configuração do LLM diretamente no CrewAI
# Você pode definir a variável de ambiente OPENAI_API_KEY ou configurá-la diretamente aqui
# Substitua pela sua chave API real
os.environ["OPENAI_API_KEY"] = "<OPENAI_API_KEY>"

node_identifier = Agent(
    role="Especialista em identificação de componentes de automações n8n",
    goal="Analisar prompts e identificar nodes n8n necessários com precisão",
    backstory="""Você é um engenheiro especialista em n8n e automações.
    Você conhece profundamente a documentação do n8n.
    Você NUNCA sugere operações ou parâmetros que não existem na plataforma.
    Antes de sugerir um node, você verifica na documentação oficial se ele existe e quais operações são válidas.
    """,
    verbose=True,
    memory=True,
    # O CrewAI usa o OpenAI por padrão, não precisamos especificar o LLM
    allow_delegation=False,
    # tools=[n8n_docs_search_tool]
)

workflow_generator = Agent(
    role="Arquiteto de workflows n8n",
    goal="Gerar JSONs funcionais de workflows com base nos nodes sugeridos",
    backstory="""Você transforma abstrações em fluxos n8n perfeitos.
    Você conhece profundamente a estrutura JSON dos workflows n8n e como os nodes se conectam.
    Você NUNCA cria operações ou parâmetros que não existem na plataforma n8n.
    Você sempre verifica a documentação oficial antes de definir operações para cada node.
    """,
    verbose=True,
    memory=True,
    # O CrewAI usa o OpenAI por padrão, não precisamos especificar o LLM
    allow_delegation=False,
    # tools=[n8n_docs_search_tool]
)
