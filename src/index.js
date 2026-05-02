const http = require("http");
const cors = require("cors");
const express = require("express");
const { Server } = require("socket.io");

const { port, corsOrigin } = require("./config/serverConfig");
const { registerSocketHandlers } = require("./sockets/handlers");

const app = express();
app.use(cors({ origin: corsOrigin }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
  },
});

registerSocketHandlers(io);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
