import { GameStateWithoutId } from "../GameState";

export interface ClientComponentProps {
  setState: (state: GameStateWithoutId) => void;
}
