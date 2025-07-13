const WebSocket = require('ws');

let wss;
// sid  ➜  array of resolve() callbacks waiting for that answer
const answerWaiters = new Map();
exports.initWebsocket = (server) => {
  wss = new WebSocket.Server({ server });
  wss.on('connection', (ws) =>
    ws.send(JSON.stringify({ type: 'hello', ts: Date.now() }))
  );

  // listen for answers from *any* socket
  wss.on('connection', (ws) => {
    ws.on('message', (raw) => {
      try {
        const { type, sid, a } = JSON.parse(raw);
        if (type === 'answer' && sid && answerWaiters.has(sid)) {
          // resolve all waiters registered for this sid
          answerWaiters.get(sid).forEach((fn) => fn(a));
          answerWaiters.delete(sid);
        }
      } catch (_) {}
    });
  });
};

/* ---------- tiny “session” helpers ---------- */
exports.openSession = (sid) => {
  broadcast({ type: 'session', sid });
};

exports.progress = (sid, msg) => {
  broadcast({ type: 'progress', sid, msg, ts: Date.now() });
};

exports.ask = (sid, q) => {
  broadcast({ type: 'ask', sid, q, ts: Date.now() });
};

function broadcast(obj) {
  const data = JSON.stringify(obj);
  wss.clients.forEach(
    (c) => c.readyState === WebSocket.OPEN && c.send(data)
  );
}

/* expo wss so utils can attach listeners */
exports.wss = () => wss;

/* -------- register a promise resolver for an answer -------- */
exports.waitForAnswer = (sid, resolver) => {
  if (!answerWaiters.has(sid)) answerWaiters.set(sid, []);
  answerWaiters.get(sid).push(resolver);
};