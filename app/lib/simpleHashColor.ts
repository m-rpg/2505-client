import { hsvToRgbHexCode } from "./color/hsvToRgbHexCode";
import { simpleHash } from "./simpleHash";

export function simpleHashColor(str: string): string {
  const [hue, others] = simpleHash(str);
  return hsvToRgbHexCode(hue, others, 1 - others);
}
