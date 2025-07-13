const n8n   = require('./n8nService');
const agent = require('./agentService');

/**
 * High-level orchestration:
 *  1) Collect info  (Agent 1 ↔ user via frontend)
 *  2) Validate nodes (Agent 2)
 *  3) Generate JSON  (Agent 3)
 *  4) Deploy + test  (n8n)
 *  5) Run QA         (Agent 4)
 */
exports.handleCreation = async (prompt, notify = () => {}) => {
  notify('🔹 Agent 1: collecting requirements');
  let context = await agent.agent1Collect(prompt);

  while (true) {
    notify('🔹 Agent 2: checking node availability');
    const { valid, nodes, feedback } = await agent.agent2Validate(context);

    if (!valid) {                         // missing or unsupported nodes
      notify('⚠️  Nodes missing – back to Agent 1');
      context = await agent.agent1Continue(feedback);
      continue;                           // restart loop
    }

    notify('🔹 Agent 3: generating workflow JSON');
    let json = await agent.agent3Generate(context, nodes);

    // ── Deploy to n8n ───────────────────────────────────────────────
    let workflow;
    try {
      workflow = await n8n.createWorkflow(json);
      await n8n.activateWorkflow(workflow.id);
    } catch (err) {
      notify(`❌ n8n rejected JSON: ${err.message} – retrying`);
      json = await agent.agent3Fix(context, err.message, json);
      continue;                           // regenerate & redeploy
    }

    // ── Test via webhook trigger ───────────────────────────────────
    notify('🔹 Triggering webhook for smoke test');
    try { await n8n.triggerWebhook(workflow, { test: 'ping' }); }
    catch (err) {
      notify(`❌ Webhook failed: ${err.message} – Agent 3 will patch`);
      json = await agent.agent3Fix(context, err.message, json);
      continue;
    }

    // ── QA by Agent 4, based on execution log ─────────────────────
    const exec = await n8n.getLastExecution(workflow.id);
    const { ok, reason } = await agent.agent4Validate(exec);

    if (!ok) {
      notify(`❌ Agent 4 QA failed (${reason}) – regenerating`);
      json = await agent.agent3Fix(context, reason, json);
      continue;
    }

    // All good 🎉
    notify('✅ Workflow created, activated & validated');
    return workflow;
  }
};
