const webSocket = require("ws");

const wss = new webSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("[LOG] client connected.");
  ws.on("message", (message) => {
    const bufferString = message.toString("utf8");
    try {
      const jsonObject = JSON.parse(bufferString);
      if (jsonObject.method === "HEART_RATE") {
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
