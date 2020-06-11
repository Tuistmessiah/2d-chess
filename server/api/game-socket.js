const { findGameByName } = require("./services/game-service");
const { update } = require("./services/acrud-service");

module.exports = gameSocket;

// TODO: Make disconnect
// TODO: Make validation in a function and call it every time
// TODO: Make files for each 'on' event functions (and others)

function gameSocket(socket, io) {
  console.info(`New client '${socket.id}' connected`);

  function joinPlayer({ gameName, playerCode }, callback, game) {
    // TODO: If player with playerCode is already in the room, return auth error
    // Join a room
    socket.join(gameName, () => {
      console.info(
        `Client ${
          socket.id
        } added to room ${gameName}. Current rooms: ${JSON.stringify(
          socket.rooms
        )}`
      );
    });

    callback(game.board_config);
  }

  socket.on("join", async ({ gameName, gameCode, playerCode }, callback) => {
    const { type, content: game } = await findGameByName(gameName);

    // Error/Auth
    if (type === "error" || !game) {
      return { type: "error", message: "Couldn't find game" };
    }
    if (game.game_code !== gameCode) {
      return { type: "error", message: "Wrong credentials for game" };
    }

    // Join existing player
    if (game.p1_code === playerCode) {
      console.info(`Game '${gameName}': P2 '${playerCode}' joined`);
      joinPlayer({ gameName, playerCode }, callback, game);
      return;
    }
    if (game.p2_code === playerCode) {
      console.info(`Game '${gameName}': P1 '${playerCode}' joined`);
      joinPlayer({ gameName, playerCode }, callback, game);
      return;
    }
    return { type: "error", message: "Player with wrong credentials" };
  });

  socket.on("test", ({ dataTest, merde }) => {
    console.log("Success", { dataTest, merde });
    // merde(dataTest);
    return "Success";
  });

  socket.on(
    "sendPieceMove",
    async (
      { boardConfigNew, gameName, gameCode, playerCode, piece },
      callback
    ) => {
      const { type, content: game } = await findGameByName(gameName);

      // TODO: Repeated code (make validation in a function)
      // Error/Auth
      if (type === "error" || !game) {
        return { type: "error", message: "Couldn't find game" };
      }
      if (game.game_code !== gameCode) {
        return { type: "error", message: "Wrong credentials for game" };
      }

      // Validate turn
      const color = piece.charAt(0);
      if (
        !(
          game.turn === color &&
          ((game.p1_code === playerCode && color === "w") ||
            (game.p2_code === playerCode && color === "b"))
        )
      ) {
        console.info(`NOT authorized: 'sendPieceMove'`);
        return;
      }

      // Update Board
      const { content: updatedGame } = await update("game", game.id, {
        board_config: boardConfigNew,
        turn: game.turn === "w" ? "b" : "w",
      });
      io.emit("pieceMove", updatedGame.board_config);
      return;
    }
  );

  // TODO: Put all game logic in this listener
  socket.on("onDrop", () => {});

  socket.on("disconnect", () => {
    console.info("Client disconnected");
  });
}
