import Primitive from './Primitive';
import Line from '../renderables/Line';
import Vector2 from '../math/Vector2';

export default class Grid extends Primitive {

  make() {

    const {settings, context} = this;
    const {lineWidth, interval, strokeColor} = settings;
    const {minX, maxX, minY, maxY} = context.visibleAxisRange;

    this.elements = [];

    let minXLine = Math.ceil(minX);
    let maxXLine = Math.floor(maxX);

    // Make sure it falls on the interval
    minXLine = minXLine - (minXLine % interval);
    maxXLine = maxXLine - (maxXLine % interval);

    for (let x = minXLine; x <= maxXLine; x += interval) {

      const line = new Line({
        color: strokeColor,
        width: lineWidth,
      });

      line.addPoint(new Vector2(x, minY));
      line.addPoint(new Vector2(x, maxY));

      this.elements.push(line);
    }

    let minYLine = Math.ceil(minY);
    let maxYLine = Math.floor(maxY);

    minYLine = minYLine - (minYLine % interval);
      maxYLine = maxYLine - (maxYLine % interval);

    for (let y = minYLine; y <= maxYLine; y += interval) {

      const line = new Line({
        color: strokeColor,
        width: lineWidth,
      });

      line.addPoint(new Vector2(minX, y));
      line.addPoint(new Vector2(maxX, y));

      this.elements.push(line);
    }
  }
}

Grid.optionTypes = {
  interval: 1,
  lineWidth: 1,
  strokeColor: '#ccc',
  zIndex: 0,
};