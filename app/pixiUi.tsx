import { extend } from "@pixi/react";
import { FancyButton, Input } from "@pixi/ui";
import { Padding } from "@pixi/ui/lib/utils/HelpTypes";
import { Container, Graphics, PointData, Sprite, Texture } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import { watchTarget } from "./util/watchTarget";

export namespace pixiUi {
  export interface InputProps {
    // input
    initialBg: Sprite | Graphics | Texture | string;
    initialPadding?: Padding;

    // container
    position?: PointData;

    // custom
    value: string;
    setValue?: (value: string) => void;
    onEnter?: (text: string) => void;
  }

  export interface ButtonProps {
    // button
    initialBg: string | Texture | Container | Sprite | Graphics;

    // container
    position?: PointData;
  }
}

extend({ Container });

export const pixiUi = {
  // TODO: value === initialValue??
  Input: ({
    initialBg,
    initialPadding,
    position,
    value,
    setValue,
    onEnter,
  }: pixiUi.InputProps) => {
    const cleanupRef = useRef<[Container, Input]>(null);

    const [watchValue, changeValue] = useRef(watchTarget("")).current;
    useEffect(() => {
      changeValue(value);
    }, [value]);

    const [watchSetValue, changeSetValue] = useRef(
      watchTarget(setValue)
    ).current;
    useEffect(() => {
      changeSetValue(setValue);
    }, [setValue]);
    const setValueCleanupRef = useRef<(() => void) | null>(null);

    const [watchOnEnter, changeOnEnter] = useRef(watchTarget(onEnter)).current;
    useEffect(() => {
      changeOnEnter(onEnter);
    }, [onEnter]);
    const onEnterCleanupRef = useRef<(() => void) | null>(null);

    const ref = useCallback((container: Container | null) => {
      if (!container) {
        if (cleanupRef.current) {
          const [container, input] = cleanupRef.current;
          container.removeChild(input);
          input.destroy();
          cleanupRef.current = null;
        }
        return;
      }

      const input = new Input({ bg: initialBg, padding: initialPadding });
      container.addChild(input);
      cleanupRef.current = [container, input];

      watchSetValue((setValue) => {
        if (setValueCleanupRef.current) {
          setValueCleanupRef.current();
        }
        setValueCleanupRef.current = null;
        if (setValue) {
          input.onChange.connect(setValue);
          setValueCleanupRef.current = () => {
            input.onChange.disconnect(setValue);
          };
        }
      });

      watchOnEnter((onEnter) => {
        if (onEnterCleanupRef.current) {
          onEnterCleanupRef.current();
        }
        onEnterCleanupRef.current = null;
        if (onEnter) {
          input.onEnter.connect(onEnter);
          onEnterCleanupRef.current = () => {
            input.onEnter.disconnect(onEnter);
          };
        }
      });

      watchValue((value) => {
        if (cleanupRef.current) {
          cleanupRef.current[1].value = value;
        }
      });
    }, []);

    return <pixiContainer ref={ref} position={position} />;
  },

  Button: ({ position, initialBg }: pixiUi.ButtonProps) => {
    const cleanupRef = useRef<[Container, FancyButton]>(null);

    const ref = useCallback((container: Container | null) => {
      if (!container) {
        if (cleanupRef.current) {
          const [container, button] = cleanupRef.current;
          container.removeChild(button);
          button.destroy();
          cleanupRef.current = null;
        }
        return;
      }

      const button = new FancyButton({
        defaultView: initialBg,
      });
      container.addChild(button);
      cleanupRef.current = [container, button];
    }, []);

    return <pixiContainer ref={ref} position={position} />;
  },
};
