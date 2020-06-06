import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import { checkPathResult, checkKing } from "../data";

import { newSocket } from "../data/chessSocketAPI";

let socket;

export default function GameSession({ gameName, gameCode, playerCode }) {
  const [boardConfig, setBoardConfig] = useState(null);
  const [gameState, setGameState] = useState({
    status: "OnGoing",
    turn: "w",
    checked: null,
  });

  useEffect(() => {
    socket = newSocket();
    socket.emit("join", { gameName, gameCode, playerCode }, (board_config) => {
      if (!board_config) {
        console.error("Not found");
        return;
      }
      const newPos = JSON.parse(board_config);
      setBoardConfig({ ...newPos });
    });
    socket.on("pieceMove", (board_config) => {
      console.log({ boardConfig });
      if (!board_config) {
        console.error("Something went wrong!");
      }
      const vala = JSON.parse(board_config);
      const newPos = vala;
      setBoardConfig({ ...newPos });
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);

  if (!boardConfig) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="row">
        <div className="row input-container">
          <Chessboard position={boardConfig} onDrop={onDrop} />
        </div>
      </div>
    </div>
  );

  // METHODS

  async function onDrop({ sourceSquare, targetSquare, piece }) {
    // TODO: make a socket for the whole drop socket.emit("onDrop", { sourceSquare, targetSquare, piece }, () => {});
    const result = checkPathResult({
      sourceSquare,
      targetSquare,
      piece,
      boardConfig,
    });
    // Invalid path
    if (!result) {
      return;
    }

    // Move piece
    if (result === "empty" || "eat") {
      const sourceContent = boardConfig[sourceSquare];
      let postitionNew = { ...boardConfig };
      delete postitionNew[sourceSquare];
      postitionNew[targetSquare] = sourceContent;
      socket.emit(
        "sendPieceMove",
        { boardConfigNew: postitionNew, gameName, gameCode, playerCode, piece },
        (response) => {
          if (!response) {
            console.error("Something went wrong!");
          }
          const newPos = response || {};

          // boardConfig({ ...newPos });
        }
      );
    }

    // Scan kings for check
    if (checkKing({ boardConfig, color: "w" })) {
      setGameState({ ...gameState, checked: "w" });
    } else if (checkKing({ boardConfig, color: "b" })) {
      setGameState({ ...gameState, checked: "b" });
    } else {
      setGameState({ ...gameState, checked: null });
      return;
    }

    // TODO: Scan kings for checkmate
  }
}
