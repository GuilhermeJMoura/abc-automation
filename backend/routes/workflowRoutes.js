const { Router } = require('express');
const router     = Router();
const {
  createWorkflow,
  getWorkflow,
  getAllWorkflows, // Optional: if you want to list all workflows
} = require('../controllers/workflowController');

router.post('/', createWorkflow);          // POST /api/workflows
router.get('/:id', getWorkflow);           // GET  /api/workflows/123
router.get('/', getAllWorkflows);         // GET  /api/workflows (optional, if you want to list all workflows)

module.exports = router;
