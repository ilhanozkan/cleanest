const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

io.on("connection", () => console.log("socket server listening"));

const onConnection = (socket) => {
  socket.on("drawing", (data) => socket.broadcast.emit("drawing", data));
};

server.listen(8080, () =>
  console.log(`
  🌟 HTTP server is running on http://localhost:8080
`)
);
