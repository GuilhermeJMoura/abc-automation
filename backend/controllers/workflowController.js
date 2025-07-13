const workflowService = require('../services/workflowService');
const { sendProgress } = require('../services/websocketService');
const n8n             = require('../services/n8nService');

exports.createWorkflow = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const workflow = await workflowService.handleCreation(prompt, sendProgress);
    res.status(201).json(workflow);          // returns n8n workflow object
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