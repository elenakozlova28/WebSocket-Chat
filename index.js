const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');



// Setup HTTP server
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('A new client connected.');

  // Broadcast messages to all clients
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('A client disconnected.');
  });
});

// Server listens on port 8080
server.listen(8080, () => {
  console.log('Server is listening on ws://localhost:8080');
});
