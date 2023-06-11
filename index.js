const webSocket = require("ws");
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const wss = new webSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("[LOG] client connected.");
  ws.on("message", (message) => {
    const bufferString = message.toString("utf8");
    try {
      const jsonObject = JSON.parse(bufferString);
      if (jsonObject.method === "HEART_RATE") {
        console.log("[LOG] HEART_RATE", jsonObject);
        wss.clients.forEach((client) => {
          if (client.readyState === webSocket.OPEN) {
            client.send(message);
          }
        });
      }
    } catch (error) {
      console.log("[ERROR] INVALID MESSAGE TYPE", error?.message, "message:", bufferString);
    }
  });

  // Handle disconnection
  ws.on("close", () => {
    console.log("[LOG] client disconnected.");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address().port}`);
});