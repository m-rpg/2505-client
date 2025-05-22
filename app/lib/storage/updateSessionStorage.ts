import { STORAGE_KEY } from "../constants";
import { triggerSessionStorageChange } from "../events";
import { GameState } from "../GameState";
import { getSessionStorage } from "./getSessionStorage";

export function updateSessionStorage(id: string, state: GameState) {
  const prev = getSessionStorage();
  const next = prev.map((game) => {
    if (game.id === id) {
      return state;
    }
    return game;
  });
  if (next.length === 0) {
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  triggerSessionStorageChange();
}
