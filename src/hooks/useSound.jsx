import { useState, useCallback } from "react";

// A custom hook to manage game sounds
export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Create audio elements for each sound type
  const createAudio = (src) => {
    const audio = new Audio(src);
    audio.volume = 0.5;
    return audio;
  };

  // Audio objects
  const flipSound = createAudio("/sounds/card-flip.mp3");
  const matchSound = createAudio("/sounds/match-success.mp3");
  const gameOverSound = createAudio("/sounds/game-complete.mp3");

  // Play sounds if enabled
  const playSound = useCallback(
    (audio) => {
      if (soundEnabled) {
        // Clone and play to allow overlapping sounds
        const soundClone = audio.cloneNode();
        soundClone
          .play()
          .catch((e) => console.error("Error playing sound:", e));
      }
    },
    [soundEnabled]
  );

  // Functions to play specific sounds
  const playCardFlip = useCallback(() => {
    playSound(flipSound);
  }, [playSound, flipSound]);

  const playMatchSuccess = useCallback(() => {
    playSound(matchSound);
  }, [playSound, matchSound]);

  const playGameOver = useCallback(() => {
    playSound(gameOverSound);
  }, [playSound, gameOverSound]);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  return {
    playCardFlip,
    playMatchSuccess,
    playGameOver,
    toggleSound,
    soundEnabled,
  };
}
