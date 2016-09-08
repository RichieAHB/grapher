import Primitive from './Primitive';
import Buffer from './Buffer';
import Line from '../renderables/Line';
import * as SpriteUtils from '../utils/SpriteUtils';
import Vector2 from '../math/Vector2';

export default class Tangent extends Primitive {

  constructor(context, options = {}) {
    super(context, options);

    this.context.events.listen('mousemove', (x, y) => {
      this.update({ xPos: x });
    });
  }

  make() {

    const {settings, context} = this;
    const {lineColor, lineWidth, expr, pointColor, pointSize, xPos} = settings;
    const {minX, maxX} = context.visibleAxisRange;

    const y = expr(xPos);

    const buffer = context.primitiveFactory.make('buffer', {
      expr: this._getTanFunc(xPos, y),
      width: 2,
    });

    const {data} = buffer._buffer;

    this.elements = [];

    const line = new Line({
      color: lineColor,
      width: lineWidth,
    });

    for (let i = 0; i < data.length; i += 2) {
      line.addPoint(new Vector2(data[i], data[i+1]));
    }

    this.elements.push(line);

    if (pointSize) {

      const point = SpriteUtils.createPointSprite(pointSize, pointColor);

      point.addPoint(new Vector2(xPos, y));

      this.elements.push(point);
    }
  }

  _getTanFunc(x, y) {
    const {expr} = this.settings;

    const dx = .0000001;
    const m = (expr(x + dx) - y) / dx;

    return x2 => m * (x2 - x) + y;
  }
}

Tangent.optionTypes = {
  lineColor: '#555',
  expr: () => {},
  lineWidth: 2,
  pointColor: '#333',
  pointSize: null,
  xPos: 0,
};

Tangent.traits = [
  'mousemove',
];