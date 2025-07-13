const { Router } = require('express');
const router     = Router();
const {
  createWorkflow,
  getWorkflow,
  getAllWorkflows,
  bypassCreateWorkflow,
  startClarification,
  continueClarification,
  generateWorkflowWithContext,
} = require('../controllers/workflowController');

router.post('/', createWorkflow);          // POST /api/workflows
router.get('/:id', getWorkflow);           // GET  /api/workflows/123
router.get('/', getAllWorkflows);         // GET  /api/workflows
router.post('/bypass-create', bypassCreateWorkflow); // Optional: if you want to bypass creation logic
router.post('/clarify', startClarification);         // POST /api/workflows/clarify
router.post('/generate', generateWorkflowWithContext); // POST /api/workflows/generate

module.exports = router;
