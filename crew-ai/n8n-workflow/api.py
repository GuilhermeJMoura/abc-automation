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

        match = re.search(r"```json\n(.*?)\n```", str(result), re.DOTALL)
        if match:
            json_str = match.group(1)
            parsed_result = json.loads(json_str)
            return jsonify(parsed_result), 200
        else:
            return jsonify({"error": "Não foi possível extrair o JSON do resultado"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
