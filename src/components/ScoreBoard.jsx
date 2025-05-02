import React from "react";
import "./ScoreBoard.css";

export default function ScoreBoard({
  turns,
  time,
  matches,
  totalPairs,
  bestScore,
  difficulty,
}) {
  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="score-board">
      <div className="score-item">
        <span className="score-label">Difficulty:</span>
        <span className="score-value">{difficulty}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Turns:</span>
        <span className="score-value">{turns}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Time:</span>
        <span className="score-value">{formatTime(time)}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Matches:</span>
        <span className="score-value">
          {matches} / {totalPairs}
        </span>
      </div>
      <div className="best-score">
        <div className="best-score-title">Best Score ({difficulty}):</div>
        <div className="best-score-detail">
          {bestScore.turns !== Infinity ? (
            <>
              <span>{bestScore.turns} turns</span>
              <span> in {formatTime(bestScore.time)}</span>
            </>
          ) : (
            <span>No record yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
