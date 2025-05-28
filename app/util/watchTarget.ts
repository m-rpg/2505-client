export type Watch<T> = (
  listener: (value: T) => void,
  skipInit?: boolean,
) => () => void;
export type Change<T> = (value: T) => void;
export type WatchGet<T> = () => T;

export function watchTarget<T>(
  initialValue: T,
): [Watch<T>, Change<T>, WatchGet<T>] {
  const watchers = new Set<(value: T) => void>();
  let value = initialValue;

  return [
    (watcher: (value: T) => void, skipInit?: boolean) => {
      const wrapped = (value: T) => watcher(value);

      if (!skipInit) {
        watcher(value);
      }

      watchers.add(wrapped);

      return () => {
        watchers.delete(wrapped);
      };
    },

    (newValue: T) => {
      value = newValue;
      for (const watcher of watchers) {
        watcher(newValue);
      }
    },

    () => value,
  ];
}
