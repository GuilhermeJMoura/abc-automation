const WebSocket = require('ws');
let wss;

exports.initWebsocket = (server) => {
  wss = new WebSocket.Server({ server });
  wss.on('connection', ws =>
    ws.send(JSON.stringify({ type: 'hello', ts: Date.now() }))
  );
};

exports.sendProgress = (msg) => {
  if (!wss) return;
  const payload = JSON.stringify({ type: 'progress', msg, ts: Date.now() });
  wss.clients.forEach(c => c.readyState === WebSocket.OPEN && c.send(payload));
};
