import { STORAGE_KEY } from "../constants";

export function getSessionStorage() {
  return sessionStorage.getItem(STORAGE_KEY)?.split("\n") || [];
}
