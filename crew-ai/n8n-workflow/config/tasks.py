from crewai import Task
from config.agents import node_identifier, workflow_generator, workflow_validator

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

    ⚠️ REGRA OBRIGATÓRIA PARA EXPRESSIONS:
    - TODOS os campos de parâmetros DEVEM ser do tipo expression usando sintaxe ={{ }}
    - NUNCA use valores diretos, sempre converta para expressions:
      * Strings: "texto" → "={{ 'texto' }}"
      * Números: 123 → "={{ 123 }}"
      * Booleanos: true → "={{ true }}"
      * Valores dinâmicos: "{{ $json.campo }}"
    - EXEMPLOS OBRIGATÓRIOS:
      ❌ ERRADO: "method": "GET"
      ✅ CORRETO: "method": "={{ 'GET' }}"
      ❌ ERRADO: "timeout": 30
      ✅ CORRETO: "timeout": "={{ 30 }}"

    Lista de Nodes:
    {{identify_nodes_task.output}}
    """,
    expected_output="""
    JSON completo e funcional do workflow n8n, contendo apenas nodes e operações confirmadas
    na documentação oficial por meio da ferramenta 'RagTool'.
    TODOS os campos de parâmetros DEVEM usar expressions ={{ }}.
    Em caso de ausência de dados suficientes na documentação, justifique claramente no lugar do trecho correspondente do JSON.
    """,
    agent=workflow_generator,
    dependencies=[identify_nodes_task]
)

validate_workflow_task = Task(
    description="""
    VALIDAÇÃO RIGOROSA E CORREÇÃO COMPLETA do workflow JSON gerado.

    ⚠️ PROCESSO DE VALIDAÇÃO OBRIGATÓRIO (SIGA EXATAMENTE ESTA ORDEM):

    1. ANÁLISE ESTRUTURAL DO JSON:
       - Valide se o JSON está bem formado
       - Confirme presença de campos obrigatórios: "nodes", "connections"
       - Verifique se não há comentários (// ou /* */)

    2. VALIDAÇÃO INDIVIDUAL DE CADA NODE:
       - Para CADA node no array "nodes":
         a) Consulte RagTool para confirmar se o tipo de node existe no n8n
         b) Verifique se tem prefixo correto "n8n-nodes-base."
         c) Confirme se a operação é válida para este tipo de node
         d) Valide se parâmetros obrigatórios estão presentes
         e) Se node não existir, substitua por "n8n-nodes-base.httpRequest"

    3. VALIDAÇÃO E CONVERSÃO DE EXPRESSIONS (CRÍTICO):
       - TODOS os campos de parâmetros DEVEM ser expressions ={{ }}
       - Converta OBRIGATORIAMENTE valores diretos para expressions:
         * "GET" → "={{ 'GET' }}"
         * 30 → "={{ 30 }}"
         * true → "={{ true }}"
         * false → "={{ false }}"
         * "texto qualquer" → "={{ 'texto qualquer' }}"
         * 123.45 → "={{ 123.45 }}"
       - Mantenha expressions já corretas: ={{ $json.campo }}
       - Corrija expressions malformadas para sintaxe ={{ }}

    4. VALIDAÇÃO DE FLUXO DE DADOS (CRÍTICO):
       - Para cada HTTP Request no workflow:
         a) Pesquise na internet a estrutura de resposta da API
         b) Use JSONSearchTool se necessário para analisar estruturas
         c) Verifique se nodes subsequentes acessam campos corretos
         d) Corrija expressions que referenciam campos inexistentes
       - Exemplo: Se API retorna {"results": {"price": 100}}, 
         corrija ={{ $json.price }} para ={{ $json.results.price }}

    5. VALIDAÇÃO DE CONEXÕES:
       - Confirme que array "connections" está correto
       - Verifique se todos os IDs de nodes referenciados existem
       - Garanta que fluxo de dados faz sentido

    6. CORREÇÕES AUTOMÁTICAS OBRIGATÓRIAS:
       - Substitua nodes inexistentes por equivalentes válidos
       - Corrija parâmetros baseado na documentação do n8n
       - Converta TODOS os valores para expressions ={{ }}
       - Ajuste expressions para acessar campos corretos das APIs
       - Repare conexões quebradas
       - Garanta que Gmail seja usado para emails

    ⚠️ REGRAS CRÍTICAS DE CORREÇÃO:
    - TODOS os nodes devem ter prefixo "n8n-nodes-base."
    - Para email, use "n8n-nodes-base.gmail"
    - Para HTTP, use "n8n-nodes-base.httpRequest"
    - Para Schedule, use "n8n-nodes-base.cron"
    - TODOS os campos de parâmetros devem ser expressions ={{ }}
    - Expressions devem acessar campos que realmente existem na API

    ⚠️ VALIDAÇÕES ESPECÍFICAS POR TIPO DE NODE:
    - HTTP Request: Confirme URL, method, headers corretos (todos como expressions)
    - Gmail: Confirme to, subject, message com expressions corretas
    - Cron: Confirme expressão de tempo válida (como expressions)
    - Set: Confirme estrutura de dados correta (como expressions)

    EXEMPLO DE CORREÇÃO COMPLETA:
    ANTES (Incorreto):
    ```json
    {
      "nodes": [
        {
          "id": "1",
          "type": "httpRequest",
          "parameters": {
            "url": "https://api.exemplo.com/data",
            "method": "GET",
            "timeout": 30
          }
        },
        {
          "id": "2", 
          "type": "email",
          "parameters": {
            "message": "Preço: $json.price",
            "enabled": true
          }
        }
      ]
    }
    ```

    DEPOIS (Corrigido):
    ```json
    {
      "nodes": [
        {
          "id": "1",
          "type": "n8n-nodes-base.httpRequest",
          "parameters": {
            "url": "={{ 'https://api.exemplo.com/data' }}",
            "method": "={{ 'GET' }}",
            "timeout": "={{ 30 }}"
          }
        },
        {
          "id": "2",
          "type": "n8n-nodes-base.gmail", 
          "parameters": {
            "message": "={{ 'Preço: ' + $json.results.price }}",
            "enabled": "={{ true }}"
          }
        }
      ]
    }
    ```

    Workflow a ser validado:
    {{generate_workflow_task.output}}
    """,
    expected_output="""
    JSON do workflow n8n COMPLETAMENTE VALIDADO E CORRIGIDO garantindo:
    ✅ Estrutura JSON válida sem comentários
    ✅ TODOS os nodes existem no n8n com prefixo correto
    ✅ TODAS as operações são válidas para seus respectivos nodes
    ✅ TODOS os parâmetros obrigatórios estão presentes
    ✅ TODOS os campos de parâmetros são expressions ={{ }}
    ✅ TODAS as expressions acessam campos que existem nas APIs
    ✅ Conexões entre nodes estão funcionais
    ✅ Fluxo de dados está correto e testado
    ✅ JSON pode ser importado no n8n sem erros
    ✅ Workflow executará com sucesso
    """,
    agent=workflow_validator,
    dependencies=[generate_workflow_task]
)

