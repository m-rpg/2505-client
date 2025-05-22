"use client";

import { useEffect, useState } from "react";
import styles from "./App.module.css";
import Game from "./Game";
import { GameManager } from "./GameManager";
import { GameStateWithoutId } from "./lib/GameState";
import { updateSessionStorage } from "./lib/storage/updateSessionStorage";
import { useLocalStorage } from "./lib/storage/useLocalStorage";
import { useSessionStorage } from "./lib/storage/useSessionStorage";

export function App() {
  const sessionStorageGames = useSessionStorage(1000);
  const localStorageGames = useLocalStorage(1000);

  const [activeGameId, setActiveGameId] = useState<string | undefined>();
  const [aspectRatioState, setAspectRatioState] = useState<
    "normal" | "narrow" | "fullscreen"
  >("normal");

  useEffect(() => {
    const checkAspectRatio = () => {
      const ratio = window.innerWidth / window.innerHeight;

      if (ratio >= 3 / 4) {
        setAspectRatioState("normal");
      } else if (ratio >= 3 / 7) {
        setAspectRatioState("fullscreen");
      } else {
        setAspectRatioState("narrow");
      }
    };

    checkAspectRatio();
    window.addEventListener("resize", checkAspectRatio);
    return () => window.removeEventListener("resize", checkAspectRatio);
  }, []);

  const handleGameSelect = (id: string | undefined) => {
    setActiveGameId(id);
  };

  const setGameState = (id: string, newState: GameStateWithoutId) => {
    updateSessionStorage(id, { ...newState, id });
  };

  const activeGame = sessionStorageGames.find((g) => g.id === activeGameId);

  switch (aspectRatioState) {
    case "normal":
      return (
        <main className={styles["main"]}>
          <div className={styles["scrollContainer"]}>
            <div className={styles["gamesRow"]}>
              {sessionStorageGames.map((game) => (
                <div
                  key={game.id}
                  className={`${styles["gameWrapper"]} ${
                    game.id === activeGameId ? styles["activeGame"] : ""
                  }`}
                  onClick={() => handleGameSelect(game.id)}
                >
                  <Game
                    state={game}
                    setState={(newState) => setGameState(game.id, newState)}
                  />
                </div>
              ))}
              <div
                className={`${styles["gameWrapper"]} ${
                  activeGameId === undefined ? styles["activeGame"] : ""
                }`}
                onClick={() => handleGameSelect(undefined)}
              >
                <GameManager
                  sessionStorageGames={sessionStorageGames}
                  localStorageGames={localStorageGames}
                  setActiveGame={setActiveGameId}
                />
              </div>
            </div>
          </div>
        </main>
      );

    case "fullscreen":
      return (
        <main>
          <div className={styles["verticalFullscreen"]}>
            <div className={styles["gameContainer"]}>
              {activeGame ? (
                <Game
                  state={activeGame}
                  setState={(newState) => setGameState(activeGame.id, newState)}
                />
              ) : (
                <GameManager
                  sessionStorageGames={sessionStorageGames}
                  localStorageGames={localStorageGames}
                  setActiveGame={setActiveGameId}
                />
              )}
            </div>
          </div>
        </main>
      );

    case "narrow":
      return (
        <main>
          <div className={styles["verticalNarrow"]}>
            <div className={styles["centeredGameContainer"]}>
              {activeGame ? (
                <Game
                  state={activeGame}
                  setState={(newState) => setGameState(activeGame.id, newState)}
                />
              ) : (
                <GameManager
                  sessionStorageGames={sessionStorageGames}
                  localStorageGames={localStorageGames}
                  setActiveGame={setActiveGameId}
                />
              )}
            </div>
          </div>
        </main>
      );
  }
}
