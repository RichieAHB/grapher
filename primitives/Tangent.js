import Primitive from './Primitive';
import Buffer from './Buffer';
import Line from '../renderables/Line';
import Point from '../renderables/Point';
import Vector2 from '../math/Vector2';

export default class Tangent extends Primitive {

  constructor(context, options = {}) {
    super(context, options);

    this.context.events.listen('mousemove', () => {
      this.make();
    });
  }

  make() {

    const {settings, context} = this;
    const {lineColor, lineWidth, expr, pointColor, pointSize} = settings;
    const {minX, maxX} = context.visibleAxisRange;

    const {x} = this.context.mouseCoord;
    const y = expr(x);

    const buffer = context.primitiveFactory.make('buffer', {
      expr: this._getTanFunc(x, y),
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

      const point = new Point({
        color: pointColor,
        size: pointSize,
      });

      point.addPoint(new Vector2(x, y));

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
  pointSize: false,
};

Tangent.traits = [
  'mousemove',
];