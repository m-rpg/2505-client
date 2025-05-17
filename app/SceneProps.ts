import { ComponentType } from "react";

export interface SceneProps {
  setScene: (scene: ComponentType<SceneProps>) => void;
}
