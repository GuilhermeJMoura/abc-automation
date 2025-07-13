#!/usr/bin/env node

const axios = require('axios');
const WebSocket = require('ws');

const BACKEND_URL = 'http://localhost:4000';
const CREW_AI_URL = 'http://localhost:5000';
const WS_URL = 'ws://localhost:4000';

console.log('🧪 Iniciando testes de integração...\n');

// Teste 1: Verificar se o backend está rodando
async function testBackend() {
  try {
    console.log('1. Testando Backend...');
    const response = await axios.get(`${BACKEND_URL}/api/workflows`);
    console.log('✅ Backend está rodando e responde corretamente');
    return true;
  } catch (error) {
    console.log('❌ Backend não está respondendo:', error.message);
    return false;
  }
}

// Teste 2: Verificar se o Crew AI está rodando
async function testCrewAI() {
  try {
    console.log('\n2. Testando Crew AI...');
    const response = await axios.post(`${CREW_AI_URL}/generate-workflow`, {
      user_prompt: 'Teste de integração - criar workflow simples'
    });
    console.log('✅ Crew AI está rodando e responde corretamente');
    return true;
  } catch (error) {
    console.log('❌ Crew AI não está respondendo:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Dados:', error.response.data);
    }
    return false;
  }
}

// Teste 3: Verificar WebSocket
async function testWebSocket() {
  return new Promise((resolve) => {
    console.log('\n3. Testando WebSocket...');
    
    const ws = new WebSocket(WS_URL);
    let received = false;
    
    ws.on('open', () => {
      console.log('✅ WebSocket conectado');
    });
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        console.log('✅ Mensagem recebida:', message);
        received = true;
        ws.close();
        resolve(true);
      } catch (error) {
        console.log('❌ Erro ao processar mensagem WebSocket:', error.message);
        ws.close();
        resolve(false);
      }
    });
    
    ws.on('error', (error) => {
      console.log('❌ Erro WebSocket:', error.message);
      resolve(false);
    });
    
    ws.on('close', () => {
      if (!received) {
        console.log('❌ WebSocket fechou sem receber mensagem');
        resolve(false);
      }
    });
    
    // Timeout após 5 segundos
    setTimeout(() => {
      if (!received) {
        console.log('❌ Timeout - WebSocket não respondeu');
        ws.close();
        resolve(false);
      }
    }, 5000);
  });
}

// Teste 4: Fluxo completo de criação de workflow
async function testFullWorkflow() {
  try {
    console.log('\n4. Testando fluxo completo...');
    
    // Criar workflow
    const response = await axios.post(`${BACKEND_URL}/api/workflows`, {
      prompt: 'Criar um workflow de teste para envio de email'
    });
    
    console.log('✅ Workflow criado com sucesso');
    console.log('   ID:', response.data.workflow?.id);
    console.log('   Nome:', response.data.workflow?.name);
    
    // Buscar workflow criado
    if (response.data.workflow?.id) {
      const getResponse = await axios.get(`${BACKEND_URL}/api/workflows/${response.data.workflow.id}`);
      console.log('✅ Workflow recuperado com sucesso');
      console.log('   Nós:', getResponse.data.nodes?.length || 0);
    }
    
    return true;
  } catch (error) {
    console.log('❌ Erro no fluxo completo:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Dados:', error.response.data);
    }
    return false;
  }
}

// Teste 5: Teste de clarificação
async function testClarification() {
  try {
    console.log('\n5. Testando clarificação...');
    
    const response = await axios.post(`${BACKEND_URL}/api/workflows/clarify`, {
      user_prompt: 'Quero automatizar o envio de relatórios'
    });
    
    console.log('✅ Clarificação iniciada');
    console.log('   Session ID:', response.data.session_id);
    console.log('   Perguntas:', response.data.questions);
    
    return true;
  } catch (error) {
    console.log('❌ Erro na clarificação:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Dados:', error.response.data);
    }
    return false;
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 ABC Automation - Teste de Integração\n');
  
  const results = {
    backend: await testBackend(),
    crewAI: await testCrewAI(),
    webSocket: await testWebSocket(),
    fullWorkflow: false,
    clarification: false
  };
  
  // Só executa testes avançados se os básicos passaram
  if (results.backend && results.crewAI) {
    results.fullWorkflow = await testFullWorkflow();
    results.clarification = await testClarification();
  }
  
  // Resumo dos resultados
  console.log('\n📊 Resumo dos Testes:');
  console.log('==================');
  console.log(`Backend:         ${results.backend ? '✅ PASSOU' : '❌ FALHOU'}`);
  console.log(`Crew AI:         ${results.crewAI ? '✅ PASSOU' : '❌ FALHOU'}`);
  console.log(`WebSocket:       ${results.webSocket ? '✅ PASSOU' : '❌ FALHOU'}`);
  console.log(`Fluxo Completo:  ${results.fullWorkflow ? '✅ PASSOU' : '❌ FALHOU'}`);
  console.log(`Clarificação:    ${results.clarification ? '✅ PASSOU' : '❌ FALHOU'}`);
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`\n🎯 Total: ${passedTests}/${totalTests} testes passaram`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Todos os testes passaram! A integração está funcionando corretamente.');
  } else {
    console.log('⚠️  Alguns testes falharam. Verifique os logs acima para mais detalhes.');
  }
  
  process.exit(passedTests === totalTests ? 0 : 1);
}

// Executar testes
runAllTests().catch(console.error); 