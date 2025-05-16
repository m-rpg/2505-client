"use client";

import { useEffect, useState } from "react";
import styles from "./App.module.css";
import Game from "./Game";
import { GameManager } from "./GameManager";

export function App() {
  const [games, setGames] = useState([
    { id: 1, title: "Game 1", color: "#e11d46" },
    { id: 2, title: "Game 2", color: "#2563eb" },
    { id: 3, title: "Game 3", color: "#d97706" },
    { id: 4, title: "Game 4", color: "#059669" },
    { id: 5, title: "Game 5", color: "#7c3aed" },
  ]);

  const [activeGameId, setActiveGameId] = useState<number | undefined>();
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

  const handleGameSelect = (id: number | undefined) => {
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
                  <Game title={game.title} color={game.color} />
                </div>
              ))}
              <div
                className={`${styles["gameWrapper"]} ${
                  activeGameId === undefined ? styles["activeGame"] : ""
                }`}
                onClick={() => handleGameSelect(undefined)}
              >
                <GameManager />
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
                <Game title={activeGame.title} color={activeGame.color} />
              ) : (
                <GameManager />
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
                <Game title={activeGame.title} color={activeGame.color} />
              ) : (
                <GameManager />
              )}
            </div>
          </div>
        </main>
      );
  }
}
