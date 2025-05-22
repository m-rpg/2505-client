import { useEffect, useState } from "react";
import { onLocalStorageChange } from "../events";
import { getLocalStorage } from "./getLocalStorage";

export function useLocalStorage(pollingRateInMs: number) {
  const [value, setValue] = useState<string[]>(getLocalStorage);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    function timeoutFunc() {
      timeoutId = setTimeout(timeoutFunc, pollingRateInMs);
      setValue((prev) => {
        const next = getLocalStorage();
        if (prev.join("\n") === next.join("\n")) {
          return prev;
        }
        return next;
      });
    }

    timeoutId = setTimeout(timeoutFunc, pollingRateInMs);

    const cleanup = onLocalStorageChange(() => setValue(getLocalStorage()));
    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  }, [pollingRateInMs]);

  return value;
}
