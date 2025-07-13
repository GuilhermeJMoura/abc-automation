const workflowService = require('../services/workflowService');
const { sendProgress } = require('../services/websocketService');
const n8n             = require('../services/n8nService');
const agent           = require('../services/agentService');

exports.createWorkflow = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const { workflow, sid } = await workflowService.handleCreation(prompt);
    res.status(201).json({ workflow, wsSession: sid });        // returns n8n workflow object
  } catch (err) { next(err); }
};


exports.getWorkflow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const wf = await n8n.getWorkflow(id);
    if (!wf) return res.status(404).json({ error: 'Not found' });
    res.json(wf);
  } catch (err) { next(err); }
};

exports.getAllWorkflows = async (req, res, next) => {
  try {
    const workflows = await n8n.getAllWorkflows();
    res.json(workflows);
  } catch (err) { next(err); }
}

exports.bypassCreateWorkflow = async (req, res, next) => {
  try {
    console.log('Bypassing creation logic');
    console.log('Request body:', req.body);
    if (!req.body) return res.status(400).json({ error: 'Workflow JSON is required' });

    const workflow = await n8n.createWorkflow(req.body);
    res.status(201).json(workflow);
  } catch (err) { next(err); }
}

exports.bypassActivateWorkflow = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Workflow ID is required' });

    await n8n.activateWorkflow(id);
    res.status(204).send();  // No content
  } catch (err) { next(err); }
}

exports.startClarification = async (req, res, next) => {
  try {
    const { user_prompt } = req.body;
    if (!user_prompt) return res.status(400).json({ error: 'user_prompt is required' });

    const result = await agent.startClarify(user_prompt);
    res.json(result);
  } catch (err) { next(err); }
}

exports.continueClarification = async (req, res, next) => {
  try {
    const { session_id, user_prompt } = req.body;
    if (!session_id) return res.status(400).json({ error: 'session_id is required' });
    if (!user_prompt) return res.status(400).json({ error: 'user_prompt is required' });

    const result = await agent.continueClarify(session_id, user_prompt);
    res.json(result);
  } catch (err) { next(err); }
}

exports.generateWorkflowWithContext = async (req, res, next) => {
  try {
    const { context } = req.body;
    if (!context) return res.status(400).json({ error: 'context is required' });

    const result = await agent.generateWorkflow(context);
    res.json(result);
  } catch (err) { next(err); }
}