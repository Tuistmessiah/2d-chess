import React, { useState } from "react";
import "./CreateGame.css";

import { createGame } from "../data/chessAPI";

// TODO: Create working form for game session
// TODO: When game is created, automatically redirect user to game session as P1

export default function CreateGame() {
  const [gameForm, setGameForm] = useState({
    game_name: "",
    game_code: "",
    p1_code: "",
  });

  return (
    <div>
      <div className="row">
        <h2>New game</h2>
      </div>
      <div className="row">
        <h4 style={{ textAlign: "center" }}>
          Create a game, give your friend the game code and start playing!
        </h4>
      </div>
      <div className="row input-container">
        <div className="col-xs-12">
          <div className="styled-input wide">
            <input
              onChange={(e) => {
                setGameForm({ ...gameForm, game_name: e.target.value });
              }}
              type="text"
              required
            />
            <label>New Game Name</label>
          </div>
        </div>

        <div className="col-md-6 col-sm-12">
          <div className="styled-input">
            <input
              onChange={(e) => {
                setGameForm({ ...gameForm, game_code: e.target.value });
              }}
              type="text"
              required
            />
            <label>Code (blank for public)</label>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="styled-input" style={{ float: "right" }}>
            <input
              onChange={(e) => {
                setGameForm({ ...gameForm, p1_code: e.target.value });
              }}
              type="text"
              required
            />
            <label>Your Code</label>
          </div>
        </div>

        <div className="col-xs-12">
          <div
            className="btn-lrg submit-btn"
            onClick={(e) => {
              createGame(gameForm);
            }}
          >
            Create
          </div>
        </div>
      </div>
    </div>
  );
}
