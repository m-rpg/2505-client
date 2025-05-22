export type On<T> = (listener: (event: T) => void) => () => void;
export type Trigger<T> = (event: T) => void;

export function eventBus<T>(): [On<T>, Trigger<T>] {
  const listeners = new Set<(event: T) => void>();

  return [
    (listener: (event: T) => void) => {
      const wrapped = (event: T) => listener(event);

      listeners.add(wrapped);

      return () => {
        listeners.delete(wrapped);
      };
    },

    (event: T) => {
      for (const listener of listeners) {
        listener(event);
      }
    },
  ];
}
