#!/usr/bin/env python3
"""
Script para inicializar o serviço Crew AI
"""

import os
import sys
from pathlib import Path

# Adicionar o diretório n8n-workflow ao Python path
sys.path.insert(0, str(Path(__file__).parent / "n8n-workflow"))

# Configurar variáveis de ambiente padrão
os.environ.setdefault('FLASK_ENV', 'development')
os.environ.setdefault('FLASK_DEBUG', '1')

# Verificar se a chave OpenAI está configurada
if not os.environ.get('OPENAI_API_KEY'):
    print("⚠️  OPENAI_API_KEY não está configurada!")
    print("   Por favor, configure a variável de ambiente OPENAI_API_KEY")
    sys.exit(1)

print("🚀 Iniciando serviço Crew AI...")
print(f"   Porta: 5000")
print(f"   Ambiente: {os.environ.get('FLASK_ENV', 'development')}")
print(f"   Debug: {os.environ.get('FLASK_DEBUG', '0')}")

# Importar e executar a API
try:
    from n8n_workflow.api import app
    app.run(debug=True, host='0.0.0.0', port=5000)
except ImportError:
    # Fallback para estrutura atual
    os.chdir(Path(__file__).parent / "n8n-workflow")
    from api import app
    app.run(debug=True, host='0.0.0.0', port=5000) 