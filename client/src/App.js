import React, { useState } from "react";
import "./App.css";
import GameSession from "./components/GameSession";
import CreateGame from "./CreateGame/CreateGame";

import { findGame } from "./data/chessAPI";
import Strategy from "./strategy.png";

// TODO: List of public games screen
// TODO: More components and organize folders
// TODO: Give user a reaction when game is created
// TODO: Improve visuals of "Information" section

export default function App() {
  const [lobbyStatus, setLobbyStatus] = useState("lobby"); // "lobby", "create", "game", "info"
  const [gameName, setGameName] = useState(null);
  const [gameCode, setGameCode] = useState(null);
  const [playerCode, setPlayerCode] = useState(null);

  async function startGame() {
    const game = await findGame({ gameName, gameCode, playerCode });
    console.log({ game });
    if (!game || (game && game.error)) {
      // TODO: Put up warning message in render
      console.info("No game found!");
      return;
    }
    setLobbyStatus("game");
  }

  return (
    <div className="App">
      <div className="row" style={{ display: "inline" }}>
        <h1 style={{ display: "inline" }}>Socket Chess</h1>
        <img src={Strategy} style={{ width: "10rem", marginLeft: "1rem" }} />
      </div>

      {/* Lobby Buttons */}
      <div className="row">
        <div className="row input-container">
          <div className="col-xs-12">
            <div
              className="btn-lrg submit-btn"
              onClick={() => setLobbyStatus("info")}
              style={{
                backgroundColor: lobbyStatus === "info" ? "#2c59a8" : "#4b8cfb",
              }}
            >
              ...
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="row input-container">
          <div className="col-xs-12">
            <div
              className="btn-lrg submit-btn"
              onClick={() => setLobbyStatus("create")}
              style={{
                backgroundColor:
                  lobbyStatus === "create" ? "#2c59a8" : "#4b8cfb",
              }}
            >
              Create Game
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="row input-container">
          <div className="col-xs-12">
            <div
              className="btn-lrg submit-btn"
              onClick={() => setLobbyStatus("lobby")}
              style={{
                backgroundColor:
                  lobbyStatus === "lobby" ? "#2c59a8" : "#4b8cfb",
              }}
            >
              Enter Game
            </div>
          </div>
        </div>
      </div>

      {/* Lobby */}
      {lobbyStatus === "lobby" && (
        <div>
          <div className="row">
            <h2>Join a game</h2>
          </div>
          <div className="row">
            <h4 style={{ textAlign: "center" }}>
              Join an existing game and introduce your player code... keep it
              secret!
            </h4>
          </div>
          <div className="row input-container">
            <div className="col-xs-12">
              <div className="styled-input wide">
                <input
                  onChange={(e) => setGameName(e.target.value)}
                  type="text"
                  required
                />
                <label>Game Name</label>
              </div>
            </div>

            <div className="col-md-6 col-sm-12">
              <div className="styled-input">
                <input
                  onChange={(e) => setGameCode(e.target.value)}
                  type="text"
                  required
                />
                <label>Game code</label>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="styled-input" style={{ float: "right" }}>
                <input
                  onChange={(e) => setPlayerCode(e.target.value)}
                  type="text"
                  required
                />
                <label>Player code</label>
              </div>
            </div>
            <div className="col-xs-12">
              <div className="btn-lrg submit-btn" onClick={startGame}>
                Join!
              </div>
            </div>
          </div>
        </div>
      )}
      {lobbyStatus === "game" && (
        <GameSession {...{ gameName, gameCode, playerCode }} />
      )}
      {lobbyStatus === "create" && <CreateGame />}
      {lobbyStatus === "info" && (
        <div>
          <div className="row">
            <h2>Information</h2>
          </div>
          <div className="row">
            <h4 style={{ textAlign: "center" }}>Instructions</h4>
            <p>
              Connect easily with other people for a chess game! Just create a
              session with a code made by you and share it with your friend.
              Each player can create their own code (to avoid unwanted cheaters
              :P!). As soon as the second player enters the session the game
              will be locked to anyn other player. Your session will be up for
              24 hours.
            </p>
            <h4>Stack</h4>
            <p>
              This game was built to experiment with sockets in a practical and
              fast way. All of it was made by me, Pedro Caetano: Private VPS
              (Ubuntu, PM2, NGINX), PostgreSQL database, Node server with REST
              and Sockets (Express, Socket.io) and React.
            </p>
          </div>
          <div className="row input-container"></div>
        </div>
      )}

      {/* Footer */}
      <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
        <div className="row input-container">
          {"Icons made by "}
          <a
            href="https://www.flaticon.com/authors/freepik"
            title="Freepik"
            style={{ color: "#4b8cfb" }}
          >
            Freepik
          </a>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
        <div className="row input-container">
          {"CSS Form by "}
          <a
            href="https://codepen.io/JonLehman/pen/yOdbOG"
            title="Free Frontend"
            style={{ color: "#4b8cfb" }}
          >
            Jon Lehman
          </a>
        </div>
      </div>
    </div>
  );
}
