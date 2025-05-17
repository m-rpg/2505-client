import { ModeContext } from "@-ft/mode-next";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { hsvToRgbHexCode } from "./color/hsvToRgbHexCode";
import { GameProps } from "./Game";

export interface GameManagerProps {
  games: GameProps[];
  setGames: Dispatch<SetStateAction<GameProps[]>>;
  setActiveGame: Dispatch<SetStateAction<string | undefined>>;
}

export function GameManager({
  games,
  setGames,
  setActiveGame,
}: GameManagerProps) {
  const { setMode, mode } = useContext(ModeContext);
  const [newGameId, setNewGameId] = useState("");

  const addNewGame = () => {
    if (games.find((game) => game.id === newGameId)) {
      alert("Game already exists");
      return;
    }
    const newGame = {
      id: newGameId,
      color: hsvToRgbHexCode(
        Math.random(),
        1 - Math.pow(Math.random(), 3),
        1 - Math.pow(Math.random(), 2)
      ),
    };
    setGames((games) =>
      games.find((game) => game.id === newGame.id) ? games : [...games, newGame]
    );
    setActiveGame(newGameId);
    setNewGameId("");
  };

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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addNewGame();
            e.stopPropagation();
          }
        }}
      />
      <button
        onClick={(e) => {
          addNewGame();
          e.stopPropagation();
        }}
      >
        add new game
      </button>
    </div>
  );
}
