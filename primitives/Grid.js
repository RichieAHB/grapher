import Primitive from './Primitive';
import Line from '../renderables/Line';
import Vector2 from '../math/Vector2';

export default class Grid extends Primitive {

  make() {

    const {settings, context} = this;
    const {strokeColor, strokeWidth} = settings;
    const {minX, maxX, minY, maxY} = context.visibleAxisRange;

    this.elements = [];

    const minXLine = Math.ceil(minX);
    const maxXLine = Math.floor(maxX);

    for (let x = minXLine; x <= maxXLine; x++) {

      const line = new Line({
        color: strokeColor,
        width: strokeWidth,
      });

      line.addPoint(new Vector2(x, minY));
      line.addPoint(new Vector2(x, maxY));

      this.elements.push(line);
    }

    const minYLine = Math.ceil(minY);
    const maxYLine = Math.floor(maxY);

    for (let y = minYLine; y <= maxYLine; y++) {

      const line = new Line({
        color: strokeColor,
        width: strokeWidth,
      });

      line.addPoint(new Vector2(minX, y));
      line.addPoint(new Vector2(maxX, y));

      this.elements.push(line);
    }
  }
}

Grid.optionTypes = {
  strokeColor: '#ccc',
  strokeWidth: 1,
};