import { STORAGE_KEY } from "../constants";
import { triggerSessionStorageChange } from "../events";
import { getSessionStorage } from "./getSessionStorage";

export function addSessionStorage(gameId: string) {
  const next = getSessionStorage();
  if (!next.includes(gameId)) {
    next.push(gameId);
    sessionStorage.setItem(STORAGE_KEY, next.join("\n"));
  }
  triggerSessionStorageChange();
}
