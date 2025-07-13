from crewai import Crew, Process
from config.agents import node_identifier, workflow_generator
from config.tasks import identify_nodes_task, generate_workflow_task



crew = Crew(
    agents=[node_identifier, workflow_generator],
    tasks=[identify_nodes_task, generate_workflow_task],
    process=Process.sequential,
    verbose=True  # Usar True em vez de 2 para o nível de verbosidade
)
