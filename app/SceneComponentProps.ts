import { GameStateWithoutId } from "./lib/GameState";

export interface SceneComponentProps {
  setState: (newState: GameStateWithoutId) => void;
}
