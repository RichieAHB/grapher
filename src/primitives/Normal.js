import Primitive from './Primitive';
import Line from '../renderables/Line';
import * as SpriteUtils from '../utils/SpriteUtils';
import Vector2 from '../math/Vector2';

export default class Normal extends Primitive {

  constructor(context, options = {}) {
    super(context, options);

    this.context.events.listen('mousemove', (x) => {
      this.update({ xPos: x });
    });
  }

  make() {
    const { settings, context } = this;
    const { lineColor, lineWidth, expr, pointColor, pointSize, xPos } = settings;

    const _xPos = xPos || 0.00001; // Make sure we don't get horrendous scales

    const y = expr(_xPos);

    const buffer = context.primitiveFactory.make('buffer', {
      expr: this._getNormFunc(_xPos, y),
      width: 2,
    });

    const { data } = buffer._buffer;

    this.elements = [];

    const line = new Line({
      color: lineColor,
      width: lineWidth,
    });

    for (let i = 0; i < data.length; i += 2) {
      line.addPoint(new Vector2(data[i], data[i + 1]));
    }

    this.elements.push(line);

    if (pointSize) {
      const point = SpriteUtils.createPointSprite(pointSize, pointColor);

      point.addPoint(new Vector2(_xPos, y));

      this.elements.push(point);
    }
  }

  _getNormFunc(x, y) {
    const { expr } = this.settings;
    const dx = 0.0000001;
    const m = (expr(x + dx) - y) / dx;

    return x2 => ((-1 / m) * (x2 - x)) + y;
  }
}

Normal.optionTypes = {
  lineColor: '#555',
  expr: () => {},
  lineWidth: 2,
  pointColor: '#333',
  pointSize: null,
  xPos: 0,
};

Normal.traits = [
  'mousemove',
];
