from crew_ai import crew

result = crew.kickoff(inputs={
    "user_prompt": "Monitore o preço do Bitcoin a cada hora e envie email quando passar de $50,000",
    "verbose": True,
    "instruction": "Utilize a ferramenta de busca para verificar na documentação oficial do n8n quais são as operações válidas para cada node antes de incluí-las no workflow."
})

print(result)
