import { STORAGE_KEY } from "../constants";
import { GameState } from "../GameState";

function isGameState(item: object): item is GameState {
  return (
    "id" in item &&
    typeof item.id === "string" &&
    "type" in item &&
    (item.type === "beforeLogin" ||
      (item.type === "loggedIn" &&
        "token" in item &&
        typeof item.token === "string"))
  );
}

export function getSessionStorage(): GameState[] {
  try {
    const item = sessionStorage.getItem(STORAGE_KEY);
    if (item === null) {
      return [];
    }
    const result: unknown = JSON.parse(item);
    if (
      !Array.isArray(result) ||
      result.some(
        (item: unknown) =>
          typeof item !== "object" || item === null || !isGameState(item),
      )
    ) {
      throw new Error("Session storage is corrupted");
    }
    return result;
  } catch (error) {
    sessionStorage.removeItem(STORAGE_KEY);
    return [];
  }
}
