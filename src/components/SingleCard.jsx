import React from "react";
import "./SingleCard.css";

export default function SingleCard({
  card,
  handleChoice,
  flipped,
  disabled,
  cardBack, // default value fallback
}) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={card.src} alt="card front" />
        <img
          className="back"
          src={cardBack || "/images/default-back.png"}
          onClick={handleClick}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          role="button"
          tabIndex="0"
          alt="card back"
        />
      </div>
      {card.matched && <div className="match-particle"></div>}
    </div>
  );
}
