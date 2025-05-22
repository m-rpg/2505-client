import { extend } from "@pixi/react";
import { Button } from "@pixi/ui";
import { Container, Graphics, Text } from "pixi.js";
import { ComponentType, useContext, useMemo, useState } from "react";
import { LayoutContext } from "../LayoutContext";
import { SceneProps } from "../SceneProps";
import { pixiUi } from "../pixiUi";

extend({ Text, Container, Button });

export function loginScene(id: string): ComponentType<SceneProps> {
  return ({ setScene }) => {
    const { scale } = useContext(LayoutContext);
    const bg = useMemo(() => {
      const width = 90 * scale;
      const height = 10 * scale;
      const radius = 5 * scale;
      const border = 1 * scale;
      const borderColor = 0x333333;
      const backgroundColor = 0xffffff;
      const bg = new Graphics()
        .roundRect(0, 0, width, height, radius + border)
        .fill(borderColor)
        .roundRect(
          border,
          border,
          width - border * 2,
          height - border * 2,
          radius
        )
        .fill(backgroundColor);
      return bg;
    }, [scale]);
    const [value, setValue] = useState("");

    return (
      <pixiContainer style={{ fill: 0xbbff88 }}>
        <pixiText
          text={`Login to ${id}`}
          style={{ fontSize: 5 * scale, fill: 0xffffff }}
        />
        <pixiUi.Input
          initialBg={bg}
          initialPadding={2 * scale}
          value={value}
          setValue={setValue}
          // onEnter={handleLogin}
          position={{ x: 0, y: 10 * scale }}
        />
        <pixiUi.Button initialBg={bg} position={{ x: 0, y: 20 * scale }} />
      </pixiContainer>
    );
  };
}
