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
// NEW helpers
 /* Clarifier helpers (question is now a STRING) */
 exports.startClarify = (prompt) =>
   axios.post(`${CREW}/clarify`, { user_prompt: prompt })
        .then(r => r.data);                     // {session_id, ready?, question}

 exports.continueClarify = (sess, answer) =>
   axios.post(`${CREW}/clarify`, {
     session_id: sess,
     user_prompt: answer
   }).then(r => r.data);                        // same shape

// existing (unchanged) generateWorkflow + fixWorkflow helpers … 
