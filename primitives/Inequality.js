import Primitive from './Primitive';
import Buffer from './Buffer';
import Polygon from '../renderables/Polygon';
import Line from '../renderables/Line';
import * as SpriteUtils from '../utils/SpriteUtils';
import Vector2 from '../math/Vector2';

export default class Inequality extends Primitive {

  make() {

    const {settings, context} = this;
    const {lineColor, lineWidth, expr, surfaceColor, type, variable, width} = settings;
    const {minX, maxX, minY, maxY} = context.visibleAxisRange;

    if (!type) {
      return false;
    }

    const buffer = context.primitiveFactory.make('buffer', {
      expr: expr,
      transpose: variable === 'y',
      width,
    });

    const data = buffer._buffer.data;

    this.elements = [];

    const polygon = new Polygon({
      color: surfaceColor,
    });

    let lineDash = false;

    if (~['>', '<'].indexOf(type)) {
      lineDash = [10, 10];
    }

    const line = new Line({
      color: lineColor,
      lineDash,
      width: lineWidth,
    });

    for (let i = 0; i < data.length; i += 2) {
      polygon.addPoint(new Vector2(data[i], data[i+1]));
      line.addPoint(new Vector2(data[i], data[i+1]));
    }

    let corner1;
    let corner2;

    switch (type) {
      case '>':
      case '>=':
        if (variable === 'y') {
          corner1 = new Vector2(maxX, maxY);
          corner2 = new Vector2(minX, maxY);
        } else {
          corner1 = new Vector2(maxX, maxY);
          corner2 = new Vector2(maxX, minY);
        }
        break;
      case '<':
      case '<=':
        if (variable === 'y') {
          corner1 = new Vector2(maxX, minY);
          corner2 = new Vector2(minX, minY);
        } else {
          corner1 = new Vector2(minX, maxY);
          corner2 = new Vector2(minX, minY);
        }
        break;
    }

    polygon.addPoint(corner1);
    polygon.addPoint(corner2);

    this.elements.push(polygon);
    this.elements.push(line);
  }
}

Inequality.optionTypes = {
  expr: () => {},
  lineColor: '#555',
  lineWidth: 2,
  surfaceColor: 'rgba(100, 100, 100, 0.5)',
  type: false,
  variable: 'x',
  width: 1,
};