import { STORAGE_KEY } from "../constants";

export function getLocalStorage() {
  return localStorage.getItem(STORAGE_KEY)?.split("\n") || [];
}
