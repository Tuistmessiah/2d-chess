import socketIOClient from "socket.io-client";
import { logger } from "./utils";
import auth from "./auth-api";
const BASE_URL = auth.chessSocketAPI[auth.chessSocketAPI.mode];

logger({ "chessSocketAPI URL": BASE_URL });

export function newSocket() {
  return socketIOClient(BASE_URL);
}
