const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

const socketIO = require("./services/socketService");
const roomsRouter = require("./routes/rooms");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(bodyParser.json());
app.use("/rooms", roomsRouter);

const onConnection = (socket) => {
  socket.on("whiteboard", (data) => socket.broadcast.emit("whiteboard", data));
};

io.on("connection", onConnection);

server.listen(8080, () =>
  console.log(`
  🌟 HTTP server is running on http://localhost:8080
  `)
);

module.exports = { io };
