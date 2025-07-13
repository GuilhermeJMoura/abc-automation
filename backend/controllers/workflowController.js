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