import { ModeContext } from "@-ft/mode-next";
import { useContext, useState } from "react";
import { GameInstance } from "./App";
import { hsvToRgbHexCode } from "./color/hsvToRgbHexCode";

export interface GameManagerProps {
  games: GameInstance[];
  setGames: (games: GameInstance[]) => void;
  setActiveGame: (id: string) => void;
}

export function GameManager({
  games,
  setGames,
  setActiveGame,
}: GameManagerProps) {
  const { setMode, mode } = useContext(ModeContext);
  const [newGameId, setNewGameId] = useState("");

  return (
    <div>
      <button
        onClick={() =>
          setMode(
            mode === "dark" ? "system" : mode === "system" ? "light" : "dark"
          )
        }
      >
        toggle dark mode (currently {mode})
      </button>
      <button onClick={() => document.documentElement.requestFullscreen?.()}>
        fullscreen
      </button>
      <br />
      <input
        type="text"
        value={newGameId}
        onChange={(e) => setNewGameId(e.target.value)}
      />
      <button
        onClick={(e) => {
          const newGame = {
            id: newGameId,
            color: hsvToRgbHexCode(
              Math.random(),
              1 - Math.pow(Math.random(), 3),
              1 - Math.pow(Math.random(), 2)
            ),
          };
          setGames([...games, newGame]);
          setActiveGame(newGameId);
          setNewGameId("");
          e.stopPropagation();
        }}
      >
        add new game
      </button>
    </div>
  );
}
