import { STORAGE_KEY } from "../constants";
import { triggerLocalStorageChange } from "../events";
import { getLocalStorage } from "./getLocalStorage";

export function removeLocalStorage(gameId: string) {
  const next = getLocalStorage().filter((id) => id !== gameId);
  if (next.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, next.join("\n"));
  }
  triggerLocalStorageChange();
}
