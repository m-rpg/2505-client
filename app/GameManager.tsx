import { ModeContext } from "@-ft/mode-next";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { eventBus } from "./util/eventBus";

export interface GameManagerProps {
  games: string[];
  setGames: Dispatch<SetStateAction<string[]>>;
  setActiveGame: Dispatch<SetStateAction<string | undefined>>;
}

export function GameManager({
  games,
  setGames,
  setActiveGame,
}: GameManagerProps) {
  const { setMode, mode } = useContext(ModeContext);
  const [newGameId, setNewGameId] = useState("");

  const sessionStorageGames = useSessionStorage(1000);
  const localStorageGames = useLocalStorage(1000);

  useEffect(() => {
    setGames(sessionStorageGames);
  }, [sessionStorageGames]);

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

const [onLocalStorageChange, triggerLocalStorageChange] = eventBus<void>();
const [onSessionStorageChange, triggerSessionStorageChange] = eventBus<void>();

const STORAGE_KEY = "games";

function getLocalStorage() {
  return localStorage.getItem(STORAGE_KEY)?.split("\n") || [];
}

function addLocalStorage(gameId: string) {
  const next = getLocalStorage();
  if (!next.includes(gameId)) {
    next.push(gameId);
    localStorage.setItem(STORAGE_KEY, next.join("\n"));
  }
  triggerLocalStorageChange();
}

function removeLocalStorage(gameId: string) {
  const next = getLocalStorage().filter((id) => id !== gameId);
  if (next.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, next.join("\n"));
  }
  triggerLocalStorageChange();
}

function useLocalStorage(pollingRateInMs: number) {
  const [value, setValue] = useState<string[]>(getLocalStorage);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function timeoutFunc() {
      timeoutId = setTimeout(timeoutFunc, pollingRateInMs);
      setValue((prev) => {
        const next = getLocalStorage();
        if (prev.join("\n") === next.join("\n")) {
          return prev;
        }
        return next;
      });
    }

    timeoutId = setTimeout(timeoutFunc, pollingRateInMs);

    const cleanup = onLocalStorageChange(() => setValue(getLocalStorage()));
    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  }, [pollingRateInMs]);

  return value;
}

function getSessionStorage() {
  return sessionStorage.getItem(STORAGE_KEY)?.split("\n") || [];
}

function addSessionStorage(gameId: string) {
  const next = getSessionStorage();
  if (!next.includes(gameId)) {
    next.push(gameId);
    sessionStorage.setItem(STORAGE_KEY, next.join("\n"));
  }
  triggerSessionStorageChange();
}

function removeSessionStorage(gameId: string) {
  const next = getSessionStorage().filter((id) => id !== gameId);
  if (next.length === 0) {
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, next.join("\n"));
  }
  triggerSessionStorageChange();
}

function useSessionStorage(pollingRateInMs: number) {
  const [value, setValue] = useState<string[]>(getSessionStorage);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function timeoutFunc() {
      timeoutId = setTimeout(timeoutFunc, pollingRateInMs);
      setValue((prev) => {
        const next = getSessionStorage();
        if (prev.join("\n") === next.join("\n")) {
          return prev;
        }
        return next;
      });
    }

    timeoutId = setTimeout(timeoutFunc, pollingRateInMs);

    const cleanup = onSessionStorageChange(() => setValue(getSessionStorage()));
    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  }, [pollingRateInMs]);

  return value;
}
