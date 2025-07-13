const { Router } = require('express');
const router     = Router();
const {
  createWorkflow,
  getWorkflow
} = require('../controllers/workflowController');

router.post('/', createWorkflow);          // POST /api/workflows
router.get('/:id', getWorkflow);           // GET  /api/workflows/123

module.exports = router;
