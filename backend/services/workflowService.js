const { v4: uuid } = require('uuid');
const n8n   = require('./n8nService');
const agent = require('./agentService');
const wait  = require('../utils/waitUserReply');
const ws    = require('./websocketService');

const MAX_ATTEMPTS = 5;

exports.handleCreation = async (firstPrompt) => {
  /* 0️⃣  Create a dedicated WS session */
  const sid = uuid();
  ws.openSession(sid);                       // notifies UI
  const notify = (m) => ws.progress(sid, m); // bound notifier

  /* ── Clarifier loop ─────────────────────────────── */
  notify('🤖 Clarifier analysing your request…');
  let clar = await agent.startClarify(firstPrompt);   // {session_id, ready?, question}
  const convo = [firstPrompt];

  while (!clar.ready) {
    const qs = clar.questions || [clar.question] || [];
    for (const q of qs) {
      if (!q) continue;
      const userAns = await wait(sid, q);   // envia & espera
      convo.push(q, userAns);
      clar = await agent.continueClarify(clar.session_id, userAns);
      if (clar.ready) break;                // já coletou tudo no meio do array
    }
  }
  
  /* construir prompt enriquecido depois que Clarifier terminar */
  const enrichedPrompt = JSON.stringify({
    conversation: convo,
    context     : clar.context || {},
  });


  /* ── Generation + deployment with retries ───────── */
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    notify(`🧠 Crew-AI generating workflow (attempt ${attempt})`);

    /* 1 ▸ generate JSON */
    let wfJson;
    try {
      wfJson = await agent.generateWorkflow(enrichedPrompt);
    } catch (e) {
      throw new Error(`Crew-AI generation failed: ${e.message}`);
    }

    /* 2 ▸ create in n8n */
    let workflow;
    try {
      workflow = await n8n.createWorkflow(wfJson);
      notify(`📄 Saved in n8n (id ${workflow.id})`);
    } catch (e) {
      notify(`❌ n8n rejected JSON → patching`);
      await agent.fixWorkflow(enrichedPrompt, e.message, wfJson);
      continue;
    }

    /* 3 ▸ activate */
    try {
      await n8n.activateWorkflow(workflow.id);
      notify('⚡ Activated in n8n');
    } catch (e) {
      notify(`❌ Activation error → patching`);
      await agent.fixWorkflow(enrichedPrompt, e.message, wfJson);
      continue;
    }

    /* 4 ▸ optional webhook ping */
    const firstNode = workflow?.nodes?.[0];
    if (firstNode?.type === 'n8n-nodes-base.webhook') {
      notify('🔹 Webhook ping test');
      try {
        await n8n.triggerWebhook(workflow, { test: 'ping' });
      } catch (e) {
        notify(`❌ Webhook error → patching`);
        await agent.fixWorkflow(enrichedPrompt, e.message, wfJson);
        continue;
      }
    }

    /* 🎉 success */
    notify('🎉 Workflow created, activated & verified');
    return { workflow, sid };                // return sid so REST caller knows it
  }

  throw new Error(`Failed after ${MAX_ATTEMPTS} attempts`);
};
