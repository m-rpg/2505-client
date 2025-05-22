import { PixiReactElementProps } from "@pixi/react";
import { Button, Input } from "@pixi/ui";

declare module "@pixi/react" {
  interface PixiElements {
    pixiInput: PixiReactElementProps<typeof Input>;
    pixiButton: PixiReactElementProps<typeof Button>;
  }
}
