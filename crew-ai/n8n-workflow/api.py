from flask import Flask, request, jsonify
import os
import sys
import os.path
import sys
import os
sys.path.append(os.path.abspath('../n8n-workflow'))

from crew_ai import crew

# Adicionar o diretório raiz ao sys.path para importação correta
_name_ = '_main_'

app = Flask(_name_)


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
        api_key = "<OPENAI_API_KEY>"
        if api_key:
            os.environ["OPENAI_API_KEY"] = api_key

        # Executar o crew
        result = crew.kickoff(inputs={
            "user_prompt": user_prompt,
            "verbose": verbose,
            "instruction": instruction
        })
        print("Crew", crew)
        print("Resultado do Crew:", result)

        return jsonify({"result": result}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if _name_ == '_main_':
    app.run(debug=True, host='0.0.0.0', port=5000)
    print("Servidor iniciado na porta 5000")