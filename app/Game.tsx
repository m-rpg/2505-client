import { Canvas } from "@react-three/fiber";
import { ComponentType, useMemo, useState } from "react";
import { GameState, GameStateWithoutId } from "./lib/GameState";
import { simpleHashColor } from "./lib/simpleHashColor";
import { SceneComponentProps } from "./SceneComponentProps";
import { sceneRouter } from "./scenes/sceneRouter";

export interface GameProps {
  state: GameState;
  setState: (newState: GameStateWithoutId) => void;
}

export default function Game({ state, setState }: GameProps) {
  const color = simpleHashColor(state.id); // XXX: ??
  const [scene, setScene] = useState<ComponentType<SceneComponentProps>>(() =>
    sceneRouter(state),
  );
  const setSceneWrapped = useMemo(
    () => (scene: ComponentType<SceneComponentProps>) => {
      setScene(() => scene);
    },
    [setScene],
  );

  const Scene = scene;

  return (
    <Canvas
      orthographic
      style={{ position: "absolute", inset: "0", touchAction: "none" }}
      gl={{ localClippingEnabled: true }}
    >
      <Scene setState={setState} setScene={setSceneWrapped} />
    </Canvas>
  );
}
