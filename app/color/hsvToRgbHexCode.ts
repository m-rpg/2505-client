import { hsvToRgb } from "./hsvToRgb";

function toHex(value: number): string {
  const hex = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function hsvToRgbHexCode(h: number, s: number, v: number): string {
  const [r, g, b] = hsvToRgb(h, s, v);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
