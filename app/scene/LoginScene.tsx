import { extend } from "@pixi/react";
import { Container, Text } from "pixi.js";
import { ComponentType, useContext } from "react";
import { LayoutContext } from "../LayoutContext";
import { SceneProps } from "../SceneProps";

extend({ Text, Container });

export function loginScene(id: string): ComponentType<SceneProps> {
  return ({ setScene }) => {
    const { scale } = useContext(LayoutContext);

    return (
      <pixiContainer>
        <pixiText
          text={`Login to ${id}`}
          style={{ fontSize: 5 * scale, fill: 0xffffff }}
        />
      </pixiContainer>
    );
  };
}
