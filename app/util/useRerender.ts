import { useState } from "react";

export function useRerender(): () => void {
  const [, rerender] = useState({});

  return () => {
    rerender({});
  };
}
