import { Application } from "@pixi/react";
import { ComponentType, useMemo, useRef, useState } from "react";
import { ApplicationGuard } from "./ApplicationGuard";
import { contrastColor } from "./color/contrastColor";
import "./Game.css";
import { LayoutContextProvider } from "./LayoutContext";
import { loginScene } from "./scene/LoginScene";
import { SceneProps } from "./SceneProps";

export interface GameProps {
  id: string;
  color: string;
}

export default function Game({ id, color }: GameProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [Scene, setScene] = useState<ComponentType<SceneProps>>(() =>
    loginScene(id)
  );
  const value = useMemo(
    () => ({ color: parseInt(contrastColor(color).slice(1), 16) }),
    [color]
  );

  return (
    <div ref={parentRef} className="game">
      <Application resizeTo={parentRef}>
        <ApplicationGuard>
          <LayoutContextProvider>
            <Scene setScene={setScene} />
          </LayoutContextProvider>
        </ApplicationGuard>
      </Application>
    </div>
  );
}
