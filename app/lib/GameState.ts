export type GameState = GameStateBeforeLogin | GameStateLoggedIn;

export interface GameStateBeforeLogin {
  id: string;
  type: "beforeLogin";
}

export interface GameStateLoggedIn {
  id: string;
  type: "loggedIn";
  token: string;
}

export type GameStateWithoutId =
  | Omit<GameStateBeforeLogin, "id">
  | Omit<GameStateLoggedIn, "id">;
