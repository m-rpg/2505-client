"use client";

import { useEffect, useState } from "react";
import styles from "./App.module.css";
import Game, { GameProps } from "./Game";
import { GameManager } from "./GameManager";

export function App() {
  const [games, setGames] = useState<GameProps[]>([]);

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

  const activeGame = games.find((g) => g.id === activeGameId);

  switch (aspectRatioState) {
    case "normal":
      return (
        <main className={styles["main"]}>
          <div className={styles["scrollContainer"]}>
            <div className={styles["gamesRow"]}>
              {games.map((game) => (
                <div
                  key={game.id}
                  className={`${styles["gameWrapper"]} ${
                    game.id === activeGameId ? styles["activeGame"] : ""
                  }`}
                  onClick={() => handleGameSelect(game.id)}
                >
                  <Game id={game.id} color={game.color} />
                </div>
              ))}
              <div
                className={`${styles["gameWrapper"]} ${
                  activeGameId === undefined ? styles["activeGame"] : ""
                }`}
                onClick={() => handleGameSelect(undefined)}
              >
                <GameManager
                  games={games}
                  setGames={setGames}
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
                <Game id={activeGame.id} color={activeGame.color} />
              ) : (
                <GameManager
                  games={games}
                  setGames={setGames}
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
                <Game id={activeGame.id} color={activeGame.color} />
              ) : (
                <GameManager
                  games={games}
                  setGames={setGames}
                  setActiveGame={setActiveGameId}
                />
              )}
            </div>
          </div>
        </main>
      );
  }
}
