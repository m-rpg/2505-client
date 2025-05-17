export function hsvToRgb(
  h: number,
  s: number,
  v: number
): [r: number, g: number, b: number] {
  let r = 0;
  let g = 0;
  let b = 0;

  let type = Math.floor(h * 6);
  let progress = h * 6 - type;
  let p = v * (1 - s);
  let q = v * (1 - progress * s);
  let t = v * (1 - (1 - progress) * s);

  switch (type % 6) {
    case 0:
      [r, g, b] = [v, t, p];
      break;
    case 1:
      [r, g, b] = [q, v, p];
      break;
    case 2:
      [r, g, b] = [p, v, t];
      break;
    case 3:
      [r, g, b] = [p, q, v];
      break;
    case 4:
      [r, g, b] = [t, p, v];
      break;
    case 5:
      [r, g, b] = [v, p, q];
      break;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
