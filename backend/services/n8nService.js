const axios = require('axios');
const config = require('../config/env');
const crypto = require('crypto');
const api = axios.create({
  baseURL : config.n8n.baseUrl,
  headers : {
    'X-N8N-API-KEY': config.n8n.apiKey,
    'Content-Type'  : 'application/json',
  },
});
console.log(`🔗 Conectado ao N8N API em ${config.n8n.baseUrl}`);

/** Create workflow but keep inactive until validated */
exports.createWorkflow = async (workflowJSON) => {
  const { data } = await api.post('/workflows', {
    connections: workflowJSON?.connections,
    nodes: workflowJSON?.nodes,
    name:  `Workflow ${crypto.randomBytes(4).toString('hex')}`, // random name
    settings: {
        "executionOrder": "v1"
    }
  });
  console.log('Workflow criado:', data);
  return data;
};

exports.activateWorkflow = (id) => api.post(`/workflows/${id}/activate`);

exports.triggerWebhook = async (workflow, sample = {}) => {
  const webhookNode = workflow.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
  if (!webhookNode) {
    console.warn(`⚠️ Não foi possível encontrar o webhook para o workflow ${workflow.id}`);
    return Promise.reject(new Error('Webhook node not found'));
  }

  // Production webhook path lives in node.parameters.path
  const url = `${process.env.N8N_WEBHOOK_BASE}/${webhookNode.parameters.path}`;
  return axios.post(url, sample);
};

/** Grab last execution to feed Agent 4 */
exports.getLastExecution = async (workflowId) => {
  const { data } = await api.get('/executions', {
    params: { workflowId, limit: 1, status: 'success' },
  });
  return data?.data?.[0] || null;
};

exports.getWorkflow = async (id) => {
  const { data } = await api.get(`/workflows/${id}`);   // docs show GET /api/v1/workflows/{id} :contentReference[oaicite:0]{index=0}
  return data;
};

exports.getAllWorkflows = async () => {
  const { data } = await api.get('/workflows', {
    params: { limit: 100 },  // adjust as needed, n8n defaults to 20
  });
  return data.data;  // returns array of workflows
};
