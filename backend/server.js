require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initWebsocket } = require('./services/websocketService');

const server = http.createServer(app);
initWebsocket(server);                     // upgrade WS on same port

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`🚀  API + WS up on http://localhost:${PORT}`)
);
