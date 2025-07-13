from crewai import Crew, Process
from config.agents import node_identifier, workflow_generator, workflow_validator
from config.tasks import identify_nodes_task, generate_workflow_task, validate_workflow_task
import os

# Configurar a chave da API diretamente

crew = Crew(
    agents=[node_identifier, workflow_generator, workflow_validator],
    tasks=[identify_nodes_task, generate_workflow_task, validate_workflow_task],
    process=Process.sequential,
    verbose=True  # Usar True em vez de 2 para o nível de verbosidade
)
