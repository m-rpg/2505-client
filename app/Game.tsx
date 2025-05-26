import { Canvas } from "@react-three/fiber";
import { ComponentType, useMemo, useState } from "react";
import styles from "./Game.module.css";
import { contrastColor } from "./lib/color/contrastColor";
import { GameState, GameStateWithoutId } from "./lib/GameState";
import { simpleHashColor } from "./lib/simpleHashColor";
import { SceneComponentProps } from "./SceneComponentProps";
import { sceneRouter } from "./scenes/sceneRouter";

export interface GameProps {
  state: GameState;
  setState: (newState: GameStateWithoutId) => void;
}

interface SplashProps {
  id: string;
  color: string;
}

function Splash({ id, color }: SplashProps) {
  return (
    <div className={styles["container"]}>
      <div className={styles["content"]} style={{ backgroundColor: color }}>
        <div className={styles["titleContainer"]}>
          <div
            className={styles["title"]}
            style={{ color: contrastColor(color) }}
          >
            {id}
          </div>
        </div>

        <div className={styles["navbar"]}>
          <div className={styles["navButton"]} />
          <div className={styles["navButtonWide"]} />
          <div className={styles["navButton"]} />
        </div>
      </div>
    </div>
  );
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
