import React from "react";
import "./SettingsPanel.css";

export default function SettingsPanel({
  currentTheme,
  currentDifficulty,
  changeTheme,
  changeDifficulty,
  difficultyLevels,
  onClose, // The function to start a new game
}) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3>Game Settings</h3>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="settings-section">
        <h4>Theme</h4>
        <div className="theme-options">
          <button
            className={`theme-button ${
              currentTheme === "magic" ? "active" : ""
            }`}
            onClick={() => changeTheme("magic")}
          >
            Magic
          </button>
          <button
            className={`theme-button ${
              currentTheme === "space" ? "active" : ""
            }`}
            onClick={() => changeTheme("space")}
          >
            Space
          </button>
          <button
            className={`theme-button ${
              currentTheme === "animals" ? "active" : ""
            }`}
            onClick={() => changeTheme("animals")}
          >
            Animals
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h4>Difficulty</h4>
        <div className="difficulty-options">
          {Object.keys(difficultyLevels).map((level) => (
            <button
              key={level}
              className={`difficulty-button ${
                currentDifficulty === level ? "active" : ""
              }`}
              onClick={() => changeDifficulty(level)}
            >
              {difficultyLevels[level].name} (
              {difficultyLevels[level].pairs * 2} cards)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
