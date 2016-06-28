function pxToCoord(px, pxSize, coordCenter, pxPerUnit) {
  return (px - (pxSize / 2)) / pxPerUnit - coordCenter;
}

function coordToPx(coord, pxSize, coordCenter, pxPerUnit) {
  return Math.round(((coord - coordCenter) * pxPerUnit) + (pxSize / 2));
}

function lerp(a, b, factor) {
  return a + ((b - a) * factor);
}

function getVisibleAxisRange(pxSize, centerCoord, pxPerUnit) {
  return [
    pxToCoord(0, pxSize, centerCoord, pxPerUnit),
    pxToCoord(pxSize, pxSize, centerCoord, pxPerUnit),
  ].sort();
}

export {
  pxToCoord,
  coordToPx,
  lerp,
  getVisibleAxisRange,
};