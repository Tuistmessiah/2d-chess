const { Router } = require("express");
const router = new Router();

const { findAll, create, update } = require("./services/acrud-service");
const { findGameByName } = require("./services/game-service");

const { initialPosition } = require("../data");
const { errorJON } = require("./errors");

module.exports = router;

const ENTITY_NAME = "game";

// TODO: Change endpoints with new queries

router.get("/", (req, res) => {
  return res.json({ message: "Not a valid endpoint" });
});

router.get("/test", async (req, res) => {
  const { type, content: allGames } = await findAll("game");
  if (type === "error") {
    return res.status(500).json(errorJON(500));
  }
  return res.json(allGames);
});

router.post("/new", async (req, res, next) => {
  const { type, content: id } = await create(ENTITY_NAME, {
    ...req.body,
    turn: "w",
    board_config: JSON.stringify(initialPosition),
  });
  if (type === "error") {
    return res.status(500).json(errorJON(500, " - Code #P541"));
  }
  if (id) {
    const newGame = response.content.rows[0];
    return res.status(200).json(newGame);
  }

  return res.status(500).json(errorJON(500, " - Code #P213"));
});

router.get(
  "/join/:game_name/:game_code/:player_code",
  async (req, res, next) => {
    const { game_name, game_code, player_code } = req.params;
    const { type, content: game } = await findGameByName(game_name);

    // Error/Auth
    if (!game || type === "error") {
      res.status(404);
      return res.status(404).json({
        error: `No '${ENTITY_NAME}' with game_name ${game_name} found`,
      });
    }
    if (game.game_code !== game_code) {
      return res.status(400).json({
        error: `Game with wrong credentials`,
      });
    }
    if (
      game.p2_code &&
      game.p1_code !== player_code &&
      game.p2_code !== player_code
    ) {
      return res.status(400).json({
        error: `Player with wrong credentials`,
      });
    }

    // Register new P2 player
    if (!game.p2_code && player_code !== game.p1_code) {
      await update("game", game.id, {
        p2_code: player_code,
      });
    }

    return res.json(true);
  }
);
