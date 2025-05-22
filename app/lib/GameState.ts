export type GameState = GameStateBeforeLogin | GameStateLoggedIn;

export interface GameStateBeforeLogin {
  type: "beforeLogin";
}

export interface GameStateLoggedIn {
  type: "loggedIn";
  accessToken: string;
}
