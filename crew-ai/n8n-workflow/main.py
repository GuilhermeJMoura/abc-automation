from crew_ai import crew

result = crew.kickoff(inputs={
    "user_prompt": "",
    "verbose": True,
    "instruction": "Utilize a ferramenta de busca para verificar na documentação oficial do n8n quais são as operações válidas para cada node antes de incluí-las no workflow."
})

print(result)
