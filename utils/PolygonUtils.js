import Vector2 from '../math/Vector2';
import Polygon from '../renderables/Polygon';
import * as MathUtils from './MathUtils';

export function createArrow(tip, size, rotation, options = {}) {

  const _rotation = MathUtils.degToRad(rotation);

  const base1 = new Vector2(tip.x - (size / 2), tip.y - size);
  const base2 = new Vector2(tip.x + (size / 2), tip.y - size);

  const p1 = tip;

  const p2 = base1
    .rotateAround(tip, _rotation);

  const p3 = base2
    .rotateAround(tip, _rotation);

  const arrow = new Polygon(options);

  [p1, p2, p3].forEach(p => arrow.addPoint(p));

  return arrow;
}