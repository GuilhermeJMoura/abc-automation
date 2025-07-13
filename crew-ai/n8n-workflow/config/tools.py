import requests
from bs4 import BeautifulSoup
import re
from crewai.tools import BaseTool
from typing import Any


class N8nDocsSearchTool(BaseTool):
    name: str = "n8n_docs_search"
    description: str = """
    Use esta ferramenta para buscar informações específicas sobre nodes do n8n, 
    suas operações disponíveis e parâmetros válidos na documentação oficial.
    
    Exemplos de uso:
    - "n8n Excel node operations documentation"
    - "n8n HTTP Request node parameters documentation"
    - "n8n Email (SMTP) node operations documentation"
    - "n8n Cron node configuration documentation"
    
    Sempre inclua "n8n", o nome do node, e "documentation" na sua busca para encontrar resultados precisos.
    """

    def _run(self, query: str) -> str:
        """
        Busca informações na documentação oficial do n8n.

        Args:
            query: A consulta de busca, que deve incluir o nome do node e o que você está procurando.

        Returns:
            Uma string contendo informações sobre o node solicitado.
        """
        # Extrair o nome do node da consulta - melhorando o padrão de reconhecimento
        node_name_match = re.search(
            r'n8n\s+([\w\s\(\)-]+)(?:\s+node|\s+documentation)', query, re.IGNORECASE)

        if not node_name_match:
            # Tentar um padrão mais simples
            node_name_match = re.search(
                r'n8n\s+([\w\s\(\)-]+)', query, re.IGNORECASE)

        if not node_name_match:
            return "Por favor, especifique o nome do node no formato 'n8n [nome] node'."

        # Extrair o nome do node e limpar parênteses se houver
        node_name = node_name_match.group(1).lower()
        # Remove qualquer texto entre parênteses
        node_name = re.sub(r'\s*\([^)]*\)', '', node_name)
        node_name = node_name.strip()

        # Remover espaços e caracteres especiais para formar o nome do node para a URL
        node_name_url = node_name.replace(' ', '').lower()

        # Tentar buscar na documentação
        try:
            # URL base da documentação do n8n
            base_url = "https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base."

            # Tentar diferentes variações do nome do node
            urls_to_try = [
                f"{base_url}{node_name_url}/",
                f"{base_url}{node_name_url.capitalize()}/",
                f"{base_url}{node_name_url}s/",  # Plural
                # Plural capitalizado
                f"{base_url}{node_name_url.capitalize()}s/",
                # Tentar com diferentes separadores
                f"{base_url}{node_name_url.replace('-', '')}/",
                f"{base_url}{node_name_url.replace('_', '')}/",
                # Tentar com diferentes combinações
                f"{base_url}{node_name.replace(' ', '-').lower()}/",
                f"{base_url}{node_name.replace(' ', '_').lower()}/"
            ]

            content = ""
            for url in urls_to_try:
                try:
                    response = requests.get(url, timeout=10)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.text, 'html.parser')

                        # Extrair o conteúdo principal
                        main_content = soup.find('main')
                        if main_content:
                            # Extrair operações disponíveis
                            operations_section = main_content.find(
                                'h2', string=re.compile('Operations', re.IGNORECASE))
                            if operations_section:
                                operations_content = ""
                                current = operations_section.next_sibling
                                while current and not (current.name == 'h2'):
                                    if current.name:
                                        operations_content += current.get_text() + "\n"
                                    current = current.next_sibling

                                if operations_content:
                                    content += f"Operações disponíveis para o node {node_name}:\n{operations_content}\n"

                            # Se não encontrou operações específicas, pegar todo o conteúdo principal
                            if not content:
                                content = main_content.get_text()

                            # Limpar e formatar o conteúdo
                            content = re.sub(r'\n+', '\n', content)
                            content = re.sub(r'\s+', ' ', content)

                            return f"Informações encontradas para o node {node_name}:\n\n{content}\n\nFonte: {url}"
                except Exception as e:
                    continue

            # Se não encontrou nada específico, tentar buscar na página geral de integrações
            general_urls = [
                "https://docs.n8n.io/integrations/builtin/",
                "https://docs.n8n.io/integrations/builtin/nodes/",
                "https://docs.n8n.io/integrations/builtin/app-nodes/"
            ]

            for general_url in general_urls:
                try:
                    response = requests.get(general_url, timeout=10)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.text, 'html.parser')

                        # Buscar links que contenham o nome do node
                        links = soup.find_all('a', href=re.compile(
                            node_name_url, re.IGNORECASE))
                        if not links:
                            # Tentar buscar pelo texto do link
                            links = soup.find_all(
                                'a', string=re.compile(node_name, re.IGNORECASE))

                        if links:
                            found_links = "\n".join(
                                [f"- {link.get_text().strip()}: {link['href']}" for link in links[:5]])
                            return f"Não encontrei informações detalhadas, mas encontrei estes links relacionados ao node {node_name}:\n\n{found_links}"
                except Exception as e:
                    continue

            # Se ainda não encontrou nada, tentar uma busca mais genérica
            search_url = "https://docs.n8n.io/search/"
            try:
                response = requests.get(
                    f"{search_url}?q={node_name}", timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    search_results = soup.find_all('a', class_='search-result')

                    if search_results:
                        found_results = "\n".join(
                            [f"- {result.get_text().strip()}: {result['href']}" for result in search_results[:5]])
                        return f"Não encontrei informações específicas, mas encontrei estes resultados de busca para o node {node_name}:\n\n{found_results}"
            except Exception as e:
                pass

            return f"Não foi possível encontrar informações específicas sobre o node {node_name} na documentação do n8n. Por favor, verifique se o nome está correto ou tente uma busca mais genérica."

        except Exception as e:
            return f"Ocorreu um erro ao buscar informações: {str(e)}"


# Instância da ferramenta
n8n_docs_search_tool = N8nDocsSearchTool()
