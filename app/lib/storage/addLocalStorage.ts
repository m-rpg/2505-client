import { STORAGE_KEY } from "../constants";
import { triggerLocalStorageChange } from "../events";
import { getLocalStorage } from "./getLocalStorage";

export function addLocalStorage(gameId: string) {
  const next = getLocalStorage();
  if (!next.includes(gameId)) {
    next.push(gameId);
    localStorage.setItem(STORAGE_KEY, next.join("\n"));
  }
  triggerLocalStorageChange();
}
