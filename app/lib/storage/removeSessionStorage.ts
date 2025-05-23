import { STORAGE_KEY } from "../constants";
import { triggerSessionStorageChange } from "../events";
import { getSessionStorage } from "./getSessionStorage";

export function removeSessionStorage(gameId: string) {
  const next = getSessionStorage().filter((item) => item.id !== gameId);
  if (next.length === 0) {
    sessionStorage.removeItem(STORAGE_KEY);
  } else {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  triggerSessionStorageChange();
}
