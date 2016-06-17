import Primitive from './Primitive';
import _Point from '../renderables/Point';
import Vector2 from '../math/Vector2';
import * as ScaleUtils from '../utils/ScaleUtils';

export default class Point extends Primitive {

  make() {

    const {settings, context} = this;
    const {color, size, expr} = settings;
    const {step, visibleAxisRange} = context;
    const {minX, maxX} = visibleAxisRange;

    this.elements = [];

    const _minX = Math.round(minX / step) * step - step;
    const _maxX = Math.round(maxX / step) * step + step;

    const point = new _Point({
      color,
      size,
    });

    for (let x = _minX; x <= _maxX; x += step) {
      const y = expr(x);
      point.addPoint(new Vector2(x, y));
    }

    this.elements.push(point);
  }
}

Point.optionTypes = {
  color: '#555',
  expr: () => {},
  size: 5,
};
