import Vector2 from '../math/Vector2';

export function pxToCoord(px, pxSize, coordCenter, pxPerUnit) {
  return (px - (pxSize / 2)) / pxPerUnit + coordCenter;
}

export function coordToPx(coord, pxSize, coordCenter, pxPerUnit) {
  return Math.round(((coord - coordCenter) * pxPerUnit) + (pxSize / 2));
}

export function lerp(a, b, factor) {
  return a + ((b - a) * factor);
}

export function getVisibleAxisRange(pxSize, centerCoord, pxPerUnit) {
  return [
    pxToCoord(0, pxSize, centerCoord, pxPerUnit),
    pxToCoord(pxSize, pxSize, centerCoord, pxPerUnit),
  ].sort();
}

export function getCenterFromRange(range) {
  const [x1, x2, y1, y2] = range;
  const xRange = [x1, x2].sort();
  const yRange = [y1, y2].sort();
  return new Vector2(lerp(xRange[0], xRange[1], .5), lerp(yRange[0], yRange[1], .5));
}