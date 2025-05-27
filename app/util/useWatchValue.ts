import { useEffect, useState } from "react";
import { Watch } from "./watchTarget";

export function useWatchValue<T>(watch: Watch<T>) {
  const [value, setValue] = useState<T>(() => {
    let value: T;
    watch((t) => (value = t))();
    return value!;
  });
  useEffect(() => watch((t) => setValue(t)), [watch]);
  return value;
}
