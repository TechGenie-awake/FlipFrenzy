import React from "react";
import "./GameControls.css";

export default function GameControls({
  onNewGame,
  toggleSettings,
  toggleSound,
  soundEnabled,
}) {
  return (
    <div className="game-controls">
      <button className="primary-button" onClick={onNewGame}>
        New Game
      </button>
      <button className="settings-button" onClick={toggleSettings}>
        Settings
      </button>
      <button className="sound-button" onClick={toggleSound}>
        {soundEnabled ? "Sound: On" : "Sound: Off"}
      </button>
    </div>
  );
}
