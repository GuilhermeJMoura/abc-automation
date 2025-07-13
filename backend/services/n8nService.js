const axios = require('axios');
const api = axios.create({
  baseURL : process.env.N8N_API_URL,
  headers : {
    'X-N8N-API-KEY': process.env.N8N_API_KEY,  // official header :contentReference[oaicite:1]{index=1}
    'Content-Type'  : 'application/json',
  },
});

/** Create workflow but keep inactive until validated */
exports.createWorkflow = async (workflowJSON) => {
  const { data } = await api.post('/workflows', {
    ...workflowJSON,
    active: false,
  });
  return data;
};

exports.activateWorkflow = (id) => api.post(`/workflows/${id}/activate`);

exports.triggerWebhook = async (workflow, sample = {}) => {
  const webhookNode = workflow.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
  if (!webhookNode) throw new Error('Webhook node not found');

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
