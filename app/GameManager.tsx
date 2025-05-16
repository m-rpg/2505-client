import { ModeContext } from "@-ft/mode-next";
import { useContext } from "react";

export function GameManager() {
  const { setMode, mode } = useContext(ModeContext);

  return (
    <div>
      <button
        onClick={() =>
          setMode(
            mode === "dark" ? "system" : mode === "system" ? "light" : "dark"
          )
        }
      >
        toggle dark mode (currently {mode})
      </button>
    </div>
  );
}
