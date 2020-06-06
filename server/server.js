const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const gameRouter = require("./api/game-router");

const gameSocket = require("./api/game-socket");

const PORT = process.env.PORT || 4002;
const PORT_SOCKET = process.env.PORT || 4001;

// > Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// > Socket API
const server = http.createServer(app);
const io = socketIo(server);
io.on("connection", (socket) => gameSocket(socket, io));

// > Routing API
app.use("/game", gameRouter);

// > Listeners
server.listen(PORT_SOCKET, () =>
  console.info(`Listening Socket API on port ${PORT_SOCKET}`)
);
app.listen(PORT, function () {
  console.info(`Listening REST API on port ${PORT}`);
});
