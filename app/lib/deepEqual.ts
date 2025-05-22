export function deepEqual(x: unknown, y: unknown) {
  if (x === y) {
    return true;
  } else if (
    typeof x == "object" &&
    x != null &&
    typeof y == "object" &&
    y != null
  ) {
    if (Object.keys(x).length != Object.keys(y).length) return false;

    for (const prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop as never], y[prop as never])) return false;
      } else return false;
    }

    return true;
  } else return false;
}
