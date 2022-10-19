const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const cors = require("cors");

app.use(cors());

const onConnection = (socket) => {
  socket.on("whiteboard", (data) => socket.broadcast.emit("whiteboard", data));
};

io.on("connection", onConnection);

server.listen(8080, () =>
  console.log(`
  🌟 HTTP server is running on http://localhost:8080
`)
);
