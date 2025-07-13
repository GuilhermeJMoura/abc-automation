const axios = require('axios');
const CREW = process.env.CREW_AI_BASE_URL;

async function call(path, payload) {
  const { data } = await axios.post(`${CREW}/${path}`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return data;
}

exports.generateWorkflow = (prompt) => {console.log("Calling Crew AI to generate workflow with prompt:", prompt); return call('/generate-workflow', { user_prompt: prompt });};
// exports.agent1Collect   = (prompt)               => call('agent1/collect',   { prompt });
// exports.agent1Continue  = (feedback)             => call('agent1/continue',  { feedback });
// exports.agent2Validate  = (context)              => call('agent2/validate',  { context });
// exports.agent3Generate  = (context, nodes)       => call('agent3/generate',  { context, nodes });
// exports.agent3Fix       = (context, error, json) => call('agent3/fix',       { context, error, json });
// exports.agent4Validate  = (execution)            => call('agent4/validate',  { execution });
