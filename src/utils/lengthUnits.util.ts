export function pxToInches(px: number) {
  return px / 96;
}

// export function inchesToPx(inches: number) {
//   return inches * 96;
// }

export function inchesToPt(inches: number) {
  return inches * 72;
}

// export function ptToInches(pt: number) {
//   return pt / 72;
// }

// export function cmToPx(cm: number) {
//   return (cm * 4800) / 127;
// }

export function pxToCm(px: number) {
  return (px * 127) / 4800;
}

// export function cmToPt(cm: number) {
//   return inchesToPt(pxToInches(cmToPx(cm)));
// }

export function pxToPt(px: number) {
  return inchesToPt(pxToInches(px));
}
