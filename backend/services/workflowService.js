/**
 * This version expects Crew-AI to do all the “Agent 1 → Agent 3” work
 * and return a **ready-to-deploy n8n workflow JSON** in ONE API call.
 *
 * Steps handled here
 * ───────────────────────────────────────────────────────────
 *  1. Ask Crew-AI for a workflow JSON (may retry on failure).
 *  2. POST it to n8n → store the returned workflow ID.
 *  3. Activate the workflow; if activation fails, ask Crew-AI to fix JSON.
 *  4. If the workflow’s first node is a Webhook Trigger, fire a test call.
 *     • on error ⇒ ask Crew-AI to fix and loop again.
 *  5. Return the successfully created & activated workflow object.
 */

const n8n   = require('./n8nService');
const agent = require('./agentService');

const MAX_ATTEMPTS = 5;          // avoid infinite loops

exports.handleCreation = async (prompt, notify = () => {}) => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    notify(`🧠 Crew-AI: generating workflow (attempt ${attempt})`);

    /* 1 ▸  ONE call → JSON  */
    let wfJson;
    try {
      console.log('Calling Crew-AI to generate workflow with prompt:', prompt);
      wfJson = await agent.generateWorkflow(prompt);  // NEW helper in agentService
      console.log('Crew-AI returned workflow JSON:', wfJson);
    } catch (err) {
      throw new Error(`Crew-AI generation failed: ${err.message}`);
    }

    /* 2 ▸  Create in n8n  */
    let workflow;
    try {
      workflow = await n8n.createWorkflow(wfJson);     // inactive by default
      console.log('Workflow created in n8n:', workflow);
      notify(`📄 Workflow saved in n8n (id ${workflow.id})`);
    } catch (err) {
      notify(`❌ n8n rejected JSON → ${err.message}`);
      prompt = await agent.fixWorkflow(prompt, err.message, wfJson);
      continue;                                        // retry full loop
    }

    /* 3 ▸  Activate */
    try {
      await n8n.activateWorkflow(workflow.id);
      notify('⚡ Workflow activated');
    } catch (err) {
      notify(`❌ Activation failed → ${err.message}`);
      prompt = await agent.fixWorkflow(prompt, err.message, wfJson);
      continue;
    }

    /* 4 ▸  Optional webhook smoke-test */
    const firstNode = workflow?.nodes?.[0];
    const isWebhook =
      firstNode && firstNode.type === 'n8n-nodes-base.webhook';

    if (isWebhook) {
      notify('🔹 Firing webhook test');
      try {
        await n8n.triggerWebhook(workflow, { test: 'ping' });
        notify('✅ Webhook responded OK');
      } catch (err) {
        notify(`❌ Webhook test failed → ${err.message}`);
        prompt = await agent.fixWorkflow(prompt, err.message, wfJson);
        continue;
      }
    } else {
      notify('ℹ️ No Webhook Trigger as first node — test skipped');
    }

    /* 5 ▸  Success */
    notify('🎉 Workflow created, activated & verified');
    return workflow;                                   // exit loop
  }

  throw new Error(`Failed after ${MAX_ATTEMPTS} attempts`);
};
