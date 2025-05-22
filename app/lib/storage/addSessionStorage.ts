import { STORAGE_KEY } from "../constants";
import { triggerSessionStorageChange } from "../events";
import { GameState } from "../GameState";
import { getSessionStorage } from "./getSessionStorage";

export function addSessionStorage(gameId: GameState) {
  const next = getSessionStorage();
  if (!next.some((item) => item.id === gameId.id)) {
    next.push(gameId);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  triggerSessionStorageChange();
}
