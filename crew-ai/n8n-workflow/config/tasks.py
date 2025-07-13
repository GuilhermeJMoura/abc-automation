from crewai import Task
from config.agents import node_identifier, workflow_generator

identify_nodes_task = Task(
    description="""
    Analise o seguinte prompt do usuário e identifique todos os nodes do n8n necessários para realizar a automação descrita.

    Para cada node, informe:
    - Tipo (ex: email, cron, HTTP Request)
    - Principais parâmetros (ex: email de destino, URL de API, tempo de execução)

    ⚠️ IMPORTANTE:
    - Antes de sugerir qualquer node ou operação, você DEVE obrigatoriamente consultar a documentação do n8n usando a ferramenta 'RagTool'.
    - Use apenas nodes e operações que você confirmou estarem documentados oficialmente.
    - Caso não encontre a operação ou node necessário na documentação, informe isso claramente e NÃO sugira esse elemento.
    
    Prompt do usuário:
    {user_prompt}
    """,
    expected_output="""
    Uma lista estruturada dos nodes do n8n com seus parâmetros principais,
    garantindo que todos os nodes e operações estejam documentados na plataforma.
    Caso algum node não seja documentado, informe que ele não pôde ser incluído.
    """,
    agent=node_identifier
)

generate_workflow_task = Task(
    description="""
    A partir da seguinte lista de nodes, gere um JSON completo e funcional de workflow n8n.

    ⚠️ REGRAS CRÍTICAS:
    - Antes de incluir qualquer operação ou parâmetro no JSON, você DEVE usar a ferramenta 'RagTool' para consultar a documentação oficial do n8n.
    - Verifique quais são os parâmetros e operações válidas de cada node baseado na documentação.
    - NUNCA inclua algo que não esteja explicitamente documentado.
    - Caso a documentação não traga informação suficiente para construir determinado trecho do workflow, você deve informar isso claramente e não gerar esse trecho.

    Lista de Nodes:
    {{identify_nodes_task.output}}
    """,
    expected_output="""
    JSON completo e funcional do workflow n8n, contendo apenas nodes e operações confirmadas
    na documentação oficial por meio da ferramenta 'RagTool'.
    Em caso de ausência de dados suficientes na documentação, justifique claramente no lugar do trecho correspondente do JSON.
    """,
    agent=workflow_generator,
    dependencies=[identify_nodes_task]
)

