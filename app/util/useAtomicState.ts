import { RefObject, useRef } from "react";
import { useRerender } from "./useRerender";

export function useAtomicState<T>(
  initialValue: T,
): [ref: RefObject<T>, setValue: (value: T) => void] {
  const rerender = useRerender();
  const ref = useRef<T>(initialValue);
  const setValue = (value: T) => {
    ref.current = value;
    rerender();
  };
  return [ref, setValue];
}
