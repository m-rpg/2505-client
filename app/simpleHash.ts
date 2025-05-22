export function simpleHash(str: string): [hue: number, other: number] {
  let hash = 42;

  for (const char of str) {
    hash =
      (hash << 3) -
      hash +
      char.charCodeAt(0) * 0x42042042 +
      char.charCodeAt(0) * 0x424242;
    hash = hash & hash;
  }

  const hue = (hash & 0xffff) / 0x10000;
  const other = (hash & 0xff0000) / 0x1000000;

  return [hue, other];
}
