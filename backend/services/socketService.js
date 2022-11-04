const socket = require("socket.io");

const socketIO = (server) => {
  return socket(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
};

module.exports = socketIO;
