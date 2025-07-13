const http = require('http');
const app = require('./app');
const config = require('./config/env');
const { initWebsocket } = require('./services/websocketService');

const server = http.createServer(app);
initWebsocket(server);                     // upgrade WS on same port

server.listen(config.port, () =>
  console.log(`🚀  API + WS up on http://localhost:${config.port}`)
);
