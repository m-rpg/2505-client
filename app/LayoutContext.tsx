import { useApplication } from "@pixi/react";
import { createContext, PropsWithChildren, useEffect, useMemo } from "react";
import { useRerender } from "./util/useRerender";

export interface LayoutContextType {
  scale: number;
}

export const LayoutContext = createContext<LayoutContextType>(
  new Proxy(
    {},
    {
      get() {
        throw new Error("LayoutContext should be used inside its Provider");
      },
    }
  ) as unknown as LayoutContextType
);

export function LayoutContextProvider({ children }: PropsWithChildren) {
  const rerender = useRerender();
  useEffect(() => {
    const handleResize = () => {
      rerender();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { app } = useApplication();
  const { width, height } = app.canvas;

  console.log(width, height);

  const value = useMemo(() => ({ scale: width / 100 }), [width]);

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}
