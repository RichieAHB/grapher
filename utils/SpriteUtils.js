import Vector2 from '../math/Vector2';
import * as MathUtils from './MathUtils';
import Sprite from '../renderables/Sprite';

function canvasToImage(canvas) {
  const img = new Image();
  img.src = canvas.toDataURL('image/png');
  return img;
}

export function createArrowMap(size, rotation, color) {

  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');

  const h = size;
  const b = h * 2;
  const hyp = Math.sqrt((h * h) + (h * h));

  canvas.height = 2 * hyp;
  canvas.width = 2 * hyp;


  const p1 = new Vector2(hyp, hyp);
  const b1 = new Vector2(hyp - h, hyp + h);
  const b2 = new Vector2(hyp + h, hyp + h);

  const _rotation = MathUtils.degToRad(rotation);
  const p2 = b1.rotateAround(p1, _rotation);
  const p3 = b2.rotateAround(p1, _rotation);

  ctx.beginPath();
  ctx.moveTo(Math.round(p1.x), Math.round(p1.y));
  ctx.lineTo(Math.round(p2.x), Math.round(p2.y));
  ctx.lineTo(Math.round(p3.x), Math.round(p3.y));
  ctx.fillStyle = color;
  ctx.fill();

  return canvasToImage(canvas);
}

function createPointMap(radius, color) {

  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');

  canvas.height = 2 * radius;
  canvas.width = 2 * radius;

  ctx.beginPath();
  ctx.arc(radius, radius, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  return canvasToImage(canvas);
}

export function createPointSprite(radius, color) {
  const pointMap = createPointMap(radius, color);

  return new Sprite({
    height: pointMap.height,
    map: pointMap,
    origin: new Vector2(pointMap.width / 2, pointMap.height / 2),
    width: pointMap.width,
  });
}
