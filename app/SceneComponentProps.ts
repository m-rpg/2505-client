import { ComponentType } from "react";
import { GameStateWithoutId } from "./lib/GameState";

export interface SceneComponentProps {
  setState: (newState: GameStateWithoutId) => void;
  setScene: (newScene: ComponentType<SceneComponentProps>) => void;
}
