// App.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";
import GameControls from "./components/GameControls";
import ScoreBoard from "./components/ScoreBoard";
import SettingsPanel from "./components/SettingsPanel";
import { useSound } from "./hooks/useSound";

// Card sets for different themes
const cardSets = {
  magic: [
    { src: "/Images/Book.png", matched: false },
    { src: "/Images/Book2.png", matched: false },
    { src: "/Images/Broom.png", matched: false },
    { src: "/Images/Candle.png", matched: false },
    { src: "/Images/Cauldron.png", matched: false },
    { src: "/Images/Cauldron2.png", matched: false },
    { src: "/Images/Eye.png", matched: false },
    { src: "/Images/Globe.png", matched: false },
    { src: "/Images/Hat.png", matched: false },
    { src: "/Images/Potion.png", matched: false },
    { src: "/Images/Wand.png", matched: false },
    { src: "/Images/Tarot.png", matched: false },
  ],
  space: [
    { src: "/Images/Themes/Space/planet1.png", matched: false },
    { src: "/Images/Themes/Space/planet2.png", matched: false },
    { src: "/Images/Themes/Space/rocket.png", matched: false },
    { src: "/Images/Themes/Space/satellite.png", matched: false },
    { src: "/Images/Themes/Space/astronaut.png", matched: false },
    { src: "/Images/Themes/Space/alien.png", matched: false },
    { src: "/Images/Themes/Space/comet.png", matched: false },
    { src: "/Images/Themes/Space/star.png", matched: false },
    { src: "/Images/Themes/Space/moon.png", matched: false },
    { src: "/Images/Themes/Space/galaxy.png", matched: false },
    { src: "/Images/Themes/Space/ufo.png", matched: false },
    { src: "/Images/Themes/Space/blackhole.png", matched: false },
  ],
  animals: [
    { src: "/Images/Themes/Animals/cat.png", matched: false },
    { src: "/Images/Themes/Animals/dog.png", matched: false },
    { src: "/Images/Themes/Animals/elephant.png", matched: false },
    { src: "/Images/Themes/Animals/giraffe.png", matched: false },
    { src: "/Images/Themes/Animals/lion.png", matched: false },
    { src: "/Images/Themes/Animals/monkey.png", matched: false },
    { src: "/Images/Themes/Animals/owl.png", matched: false },
    { src: "/Images/Themes/Animals/panda.png", matched: false },
    { src: "/Images/Themes/Animals/penguin.png", matched: false },
    { src: "/Images/Themes/Animals/tiger.png", matched: false },
    { src: "/Images/Themes/Animals/turtle.png", matched: false },
    { src: "/Images/Themes/Animals/fox.png", matched: false },
  ],
};

// Card backs for different themes
const cardBacks = {
  magic: "/Images/Cover.png",
  space: "/Images/Themes/Space/cover.png",
  animals: "/Images/Themes/Animals/cover.png",
};

// Difficulty levels and their configurations
const difficultyLevels = {
  easy: { pairs: 6, columns: 4, name: "Easy" },
  medium: { pairs: 8, columns: 4, name: "Medium" },
  hard: { pairs: 12, columns: 6, name: "Hard" },
};

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [matches, setMatches] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");
  const [theme, setTheme] = useState("magic");
  const [showSettings, setShowSettings] = useState(false);
  const [bestScores, setBestScores] = useState({
    easy: { turns: Infinity, time: Infinity },
    medium: { turns: Infinity, time: Infinity },
    hard: { turns: Infinity, time: Infinity },
  });

  // Move refs to the top level of the component
  const comparisonInProgressRef = useRef(false);
  const matchCheckRef = useRef(false);

  const {
    playCardFlip,
    playMatchSuccess,
    playGameOver,
    toggleSound,
    soundEnabled,
  } = useSound();

  // Load best scores from localStorage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem("flipFrenzyBestScores");
    if (savedScores) {
      setBestScores(JSON.parse(savedScores));
    }
  }, []);

  // Shuffle cards based on current theme and difficulty
  const shuffleCards = useCallback(() => {
    // Select cards based on current theme and difficulty
    const themeCards = cardSets[theme] || cardSets.magic;
    const pairsCount = difficultyLevels[difficulty].pairs;

    // Take only the number of cards needed for the current difficulty
    const selectedCards = themeCards.slice(0, pairsCount);

    const shuffledCards = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random(), matched: false }));

    // Reset game state
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setTime(0);
    setMatches(0);
    setGameOver(false);
    setGameStarted(true);
  }, [theme, difficulty]);

  // Reset choices and increase turn count
  const resetTurn = useCallback(() => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  }, []);

  // Handle card choice
  const handleChoice = useCallback(
    (card) => {
      // Don't allow selections when the board is disabled (during animation)
      if (disabled) return;

      // Don't allow selecting already matched cards or the same card twice
      if (card.matched || card.id === choiceOne?.id) return;

      // Play flip sound
      playCardFlip();

      // Set first or second choice based on whether we already have a first choice
      if (choiceOne) {
        setChoiceTwo(card);
      } else {
        setChoiceOne(card);
      }
    },
    [choiceOne, disabled, playCardFlip]
  );

  // Compare selected cards
  // Compare selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo && !comparisonInProgressRef.current) {
      comparisonInProgressRef.current = true;
      setDisabled(true);

      if (choiceOne.src === choiceTwo.src) {
        // It's a match
        setCards((prevCards) => {
          const newCards = prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            }
            return card;
          });

          // Count how many cards are now matched
          const matchedCount =
            newCards.filter((card) => card.matched).length / 2;
          setMatches(matchedCount);

          return newCards;
        });

        playMatchSuccess();
      }

      // Wait before resetting the turn
      const timer = setTimeout(() => {
        resetTurn();
        comparisonInProgressRef.current = false;
      }, 800);

      return () => {
        clearTimeout(timer);
        comparisonInProgressRef.current = false;
      };
    }
  }, [choiceOne, choiceTwo, resetTurn]);

  // Game timer - runs only when game is active
  useEffect(() => {
    let timer;
    if (gameStarted && !gameOver) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Check for game completion
  useEffect(() => {
    if (cards.length > 0 && gameStarted && !gameOver) {
      const allMatched = cards.every((card) => card.matched);

      if (allMatched && !matchCheckRef.current) {
        matchCheckRef.current = true;
        setGameOver(true);
        setGameStarted(false);
        playGameOver();

        const currentDifficultyBest = bestScores[difficulty];
        if (
          turns < currentDifficultyBest.turns ||
          (turns === currentDifficultyBest.turns &&
            time < currentDifficultyBest.time)
        ) {
          const updatedScores = {
            ...bestScores,
            [difficulty]: { turns, time },
          };
          setBestScores(updatedScores);
          localStorage.setItem(
            "flipFrenzyBestScores",
            JSON.stringify(updatedScores)
          );
        }
      }
    } else if (!gameStarted || gameOver) {
      matchCheckRef.current = false;
    }
  }, [
    cards,
    turns,
    time,
    bestScores,
    difficulty,
    playGameOver,
    gameStarted,
    gameOver,
  ]);

  // Change difficulty level
  const changeDifficulty = useCallback((newDifficulty) => {
    setDifficulty(newDifficulty);
    setGameStarted(false);
    setGameOver(false);
    setCards([]);
  }, []);

  // Change theme
  const changeTheme = useCallback(
    (newTheme) => {
      setTheme(newTheme);
      if (gameStarted) {
        // We'll call shuffleCards in the next render cycle
        setTimeout(shuffleCards, 0);
      }
    },
    [gameStarted, shuffleCards]
  );

  // Toggle settings panel
  const toggleSettings = useCallback(() => {
    setShowSettings((prevShowSettings) => {
      // if settings are being closed, start a new game
      if (prevShowSettings) {
        setTimeout(shuffleCards, 0);
      }
      return !prevShowSettings;
    });
  }, [shuffleCards]);

  return (
    <div className="app-container">
      <div className="game-header">
        <h1 className="game-title">FlipFrenzy</h1>
        <div className="game-subtitle">Memory Challenge</div>
      </div>

      <GameControls
        onNewGame={shuffleCards}
        toggleSettings={toggleSettings}
        toggleSound={toggleSound}
        soundEnabled={soundEnabled}
      />

      {showSettings && (
        <SettingsPanel
          currentTheme={theme}
          currentDifficulty={difficulty}
          changeTheme={changeTheme}
          changeDifficulty={changeDifficulty}
          difficultyLevels={difficultyLevels}
          onClose={toggleSettings}
        />
      )}

      {gameOver && (
        <div className="game-over-message">
          <h2>Game Complete!</h2>
          <p>
            You completed the game in {turns} turns and {time} seconds.
          </p>
          {turns === bestScores[difficulty].turns &&
            time === bestScores[difficulty].time && (
              <p className="new-best-score">New Best Score!</p>
            )}
        </div>
      )}

      {cards.length > 0 ? (
        <div
          className="card-grid"
          style={{
            gridTemplateColumns: `repeat(${difficultyLevels[difficulty].columns}, 1fr)`,
          }}
        >
          {cards.map((card) => (
            <SingleCard
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
              cardBack={cardBacks[theme]}
            />
          ))}
        </div>
      ) : (
        <div className="start-game-prompt">
          <p>
            Select your difficulty and theme in settings, then click "New Game"
            to start
          </p>
        </div>
      )}

      <ScoreBoard
        turns={turns}
        time={time}
        matches={matches}
        totalPairs={difficultyLevels[difficulty].pairs}
        bestScore={bestScores[difficulty]}
        difficulty={difficultyLevels[difficulty].name}
      />
    </div>
  );
}

export default App;
