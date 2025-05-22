import { ModeContext } from "@-ft/mode-next";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { addLocalStorage } from "./lib/storage/addLocalStorage";
import { addSessionStorage } from "./lib/storage/addSessionStorage";
import { removeLocalStorage } from "./lib/storage/removeLocalStorage";
import { removeSessionStorage } from "./lib/storage/removeSessionStorage";

export interface GameManagerProps {
  sessionStorageGames: string[];
  localStorageGames: string[];
  setActiveGame: Dispatch<SetStateAction<string | undefined>>;
}

export function GameManager({
  sessionStorageGames,
  localStorageGames,
  setActiveGame,
}: GameManagerProps) {
  const { setMode, mode } = useContext(ModeContext);
  const [newGameId, setNewGameId] = useState("");

  const handleAddNewGame = () => {
    addSessionStorage(newGameId);
    addLocalStorage(newGameId);
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
            handleAddNewGame();
            e.stopPropagation();
          }
        }}
      />
      <button
        onClick={(e) => {
          handleAddNewGame();
          e.stopPropagation();
        }}
      >
        add new game
      </button>
      <SessionStorageGameList
        sessionStorageGames={sessionStorageGames}
        localStorageGames={localStorageGames}
      />
      <LocalStorageGameList
        sessionStorageGames={sessionStorageGames}
        localStorageGames={localStorageGames}
      />
    </div>
  );
}

function LocalStorageGameList({
  sessionStorageGames,
  localStorageGames,
}: {
  sessionStorageGames: string[];
  localStorageGames: string[];
}) {
  return (
    <div>
      Saved items:
      <ul>
        {localStorageGames.map((game) => (
          <li key={game}>
            {game}
            {!sessionStorageGames.includes(game) && (
              <>
                {" "}
                <button onClick={() => addSessionStorage(game)}>add</button>
              </>
            )}{" "}
            <button onClick={() => removeLocalStorage(game)}>remove</button>
          </li>
        ))}
        {localStorageGames.length === 0 && <div>No saved items</div>}
      </ul>
    </div>
  );
}

function SessionStorageGameList({
  sessionStorageGames,
  localStorageGames,
}: {
  sessionStorageGames: string[];
  localStorageGames: string[];
}) {
  return (
    <div>
      Current items:
      <ul>
        {sessionStorageGames.map((game) => (
          <li key={game}>
            {game}{" "}
            <button onClick={() => removeSessionStorage(game)}>remove</button>
            {!localStorageGames.includes(game) && (
              <>
                {" "}
                <button onClick={() => addLocalStorage(game)}>save</button>
              </>
            )}
          </li>
        ))}
        {sessionStorageGames.length === 0 && <div>No saved items</div>}
      </ul>
    </div>
  );
}
