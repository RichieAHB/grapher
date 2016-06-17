import Primitive from './Primitive';
import _Line from '../renderables/Line';
import Vector2 from '../math/Vector2';
import * as ScaleUtils from '../utils/ScaleUtils';

export default class Line extends Primitive {

  make() {

    const {settings, context} = this;
    const {color, width, expr} = settings;
    const {step, visibleAxisRange} = context;
    const {minX, maxX} = visibleAxisRange;

    this.elements = [];

    const _minX = Math.round(minX / step) * step - step;
    const _maxX = Math.round(maxX / step) * step + step;

    const line = new _Line({
      color,
      width,
    });

    for (let x = _minX; x <= _maxX; x += step) {
      const y = expr(x);
      line.addPoint(new Vector2(x, y));
    }

    this.elements.push(line);
  }
}

Line.optionTypes = {
  color: '#555',
  expr: () => {},
  width: 2,
};
