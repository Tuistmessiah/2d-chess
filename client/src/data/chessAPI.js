import { logger } from "./utils";
import auth from "./auth-api";
const BASE_URL = auth.chessAPI[auth.chessAPI.mode];
const GAME_ENTITY = "game";

logger({ "chessAPI URL": BASE_URL });

// - API Endpoints

/* Game */
export async function createGame(gameForm) {
  const body = { ...gameForm };
  return fetchFromAPI(GAME_ENTITY, "new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

export async function findGame({ gameName, gameCode, playerCode }) {
  return fetchFromAPI(
    GAME_ENTITY,
    `join/${gameName}/${gameCode}/${playerCode}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
}

// > INTERNALS

function fetchFromAPI(endpoint, url, { method, headers, body }) {
  return fetch(`${BASE_URL}/${endpoint}/${url}`, {
    method,
    headers: { ...headers },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then(logger)
    .catch((error) => {
      console.error(error);
      return null;
    });
}
