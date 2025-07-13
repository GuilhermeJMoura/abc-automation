from crewai import Task
from config.agents import node_identifier, workflow_generator

identify_nodes_task = Task(
    description="""
    Analise o seguinte prompt do usuário e identifique todos os nodes do n8n necessários para realizar a automação descrita.
    Para cada node, informe:
    - Tipo (ex: email, cron, HTTP Request)
    - Principais parâmetros (ex: email de destino, URL de API, tempo de execução)
    
    IMPORTANTE: Antes de sugerir qualquer node ou operação, utilize a ferramenta de busca para verificar se eles existem na plataforma n8n.
    Use apenas nodes e operações que você confirmou existirem no n8n através da documentação oficial.
    
    Prompt:
    {user_prompt}
    """,
    expected_output="Lista estruturada dos nodes do n8n com parâmetros principais, garantindo que todos os nodes e operações existam na plataforma.",
    agent=node_identifier
)

generate_workflow_task = Task(
    description="""
    A partir da seguinte lista de nodes, gere um JSON completo e funcional de workflow n8n.
    
    IMPORTANTE: Certifique-se de que todas as operações e parâmetros que você incluir no JSON existam realmente na plataforma n8n.
    Utilize a ferramenta de busca para verificar na documentação oficial quais são as operações válidas para cada node antes de incluí-las no JSON.
    
    INSTRUÇÕES ESPECÍFICAS PARA USO DA FERRAMENTA n8n_docs_search:
    1. Para cada node identificado na lista abaixo, você DEVE usar a ferramenta n8n_docs_search para buscar sua documentação
    2. Use o formato exato: "n8n [nome do node] node documentation" na sua consulta
    3. Analise o resultado da busca para confirmar as operações válidas antes de incluí-las no JSON
    4. Não inclua operações que não foram confirmadas pela documentação
    
    Lista de Nodes:
    {{identify_nodes_task.output}}
    """,
    expected_output="JSON completo e funcional do workflow n8n, contendo apenas nodes e operações que existem na plataforma.",
    agent=workflow_generator,
    dependencies=[identify_nodes_task]
)
