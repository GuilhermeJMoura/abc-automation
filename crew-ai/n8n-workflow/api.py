from crew_ai import crew
from flask import Flask, request, jsonify
import os
import sys
import os.path
import sys
import os
import re
import json
sys.path.append(os.path.abspath('../n8n-workflow'))

from dotenv import load_dotenv
import os

# Load variables from .env into environment
load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Adicionar o diretório raiz ao sys.path para importação correta

app = Flask(__name__)


@app.route('/generate-workflow', methods=['POST'])
def generate_workflow():
    try:
        data = request.json

        if not data:
            return jsonify({"error": "Dados não fornecidos"}), 400

        user_prompt = data.get('user_prompt')
        instruction = data.get(
            'instruction', "Utilize a ferramenta de busca para verificar na documentação oficial do n8n quais são as operações válidas para cada node antes de incluí-las no workflow.")
        verbose = data.get('verbose', True)

        if not user_prompt:
            return jsonify({"error": "O parâmetro 'user_prompt' é obrigatório"}), 400

        # Configurar chave API se fornecida
        api_key = OPENAI_API_KEY
        if api_key:
            os.environ["OPENAI_API_KEY"] = api_key

        # Executar o crew
        result = crew.kickoff(inputs={
            "user_prompt": user_prompt,
            "verbose": verbose,
            "instruction": instruction
        })

        print("Resultado bruto do CrewAI:")
        print(result)
        print("=" * 50)
        
        result_str = str(result)
        
        # Remover ``` do início e fim
        json_str = result_str.replace('```json', '').replace('```', '').strip()
        
        print("JSON limpo:")
        print(json_str)
        print("=" * 50)
        
        try:
            # Parse do JSON
            parsed_json = json.loads(json_str)
            return jsonify(parsed_json), 200
            
        except json.JSONDecodeError as e:
            return jsonify({
                "error": f"Erro ao fazer parse do JSON: {str(e)}",
                "raw_json": json_str
            }), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
