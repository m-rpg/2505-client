import { useState } from "react";

export function useRerender(): () => void {
  const [, rerender] = useState(0);

  return () => {
    rerender(0);
  };
}
