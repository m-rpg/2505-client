import { useEffect, useState } from "react";
import { onSessionStorageChange } from "../events";
import { getSessionStorage } from "./getSessionStorage";

export function useSessionStorage(pollingRateInMs: number) {
  const [value, setValue] = useState<string[]>(getSessionStorage);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function timeoutFunc() {
      timeoutId = setTimeout(timeoutFunc, pollingRateInMs);
      setValue((prev) => {
        const next = getSessionStorage();
        if (prev.join("\n") === next.join("\n")) {
          return prev;
        }
        return next;
      });
    }

    timeoutId = setTimeout(timeoutFunc, pollingRateInMs);

    const cleanup = onSessionStorageChange(() => setValue(getSessionStorage()));
    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  }, [pollingRateInMs]);

  return value;
}
