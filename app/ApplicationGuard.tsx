import { useApplication } from "@pixi/react";
import { PropsWithChildren } from "react";

export function ApplicationGuard({ children }: PropsWithChildren) {
  const { isInitialised } = useApplication();

  if (!isInitialised) {
    return null;
  }

  return <>{children}</>;
}
