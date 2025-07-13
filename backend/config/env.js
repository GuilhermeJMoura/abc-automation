require('dotenv').config();

const config = {
  // Server Config
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Crew AI Config
  crewAI: {
    baseUrl: process.env.CREW_AI_BASE_URL || 'http://localhost:5000',
    timeout: parseInt(process.env.CREW_AI_TIMEOUT) || 30000,
  },
  
  // n8n Config
  n8n: {
    baseUrl: process.env.N8N_API_URL || 'http://localhost:5678/api/v1',
    apiKey: process.env.N8N_API_KEY || '',
  },
  
  // OpenAI Config
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  
  // Security
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-here',
  },
  
  // WebSocket Config
  websocket: {
    heartbeatInterval: parseInt(process.env.WS_HEARTBEAT_INTERVAL) || 30000,
  }
};

// Validation
const validateConfig = () => {
  const missing = [];
  
  if (!config.crewAI.baseUrl) missing.push('CREW_AI_BASE_URL');
  if (!config.openai.apiKey) missing.push('OPENAI_API_KEY');
  if (!config.n8n.baseUrl) missing.push('N8N_API_URL');
  if (!config.n8n.apiKey) missing.push('N8N_API_KEY');
  
  if (missing.length > 0) {
    console.warn('⚠️  Variáveis de ambiente faltando:', missing.join(', '));
    console.warn('   Algumas funcionalidades podem não funcionar corretamente.');
  }
  
  return config;
};

module.exports = validateConfig(); 