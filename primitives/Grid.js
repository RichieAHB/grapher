import Primitive from './Primitive';
import Line from '../renderables/Line';
import Vector2 from '../math/Vector2';

export default class Grid extends Primitive {

  make() {

    const {settings, context} = this;
    const {lineWidth, interval, intervalX, intervalY, strokeColor} = settings;
    const {minX, maxX, minY, maxY} = context.visibleAxisRange;

    this.elements = [];

    let minXLine = Math.ceil(minX);
    let maxXLine = Math.floor(maxX);

    const intX = intervalX || interval;

    // Make sure it falls on the interval
    minXLine = minXLine - (minXLine % intX);
    maxXLine = maxXLine - (maxXLine % intX);

    for (let x = minXLine; x <= maxXLine; x += intX) {

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

    const intY = intervalY || interval;

    minYLine = minYLine - (minYLine % intY);
    maxYLine = maxYLine - (maxYLine % intY);

    for (let y = minYLine; y <= maxYLine; y += intY) {

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
  intervalX: null,
  intervalY: null,
  lineWidth: 1,
  strokeColor: '#ddd',
  zIndex: 0,
};