import Primitive from './Primitive';
import Text from '../renderables/Text';
import Vector2 from '../math/Vector2';

export default class Scale extends Primitive {

  make() {
    const { settings, context } = this;
    const { fontSize, interval, intervalX, intervalY, showX, showY } = settings;
    const { minX, maxX, minY, maxY } = context.visibleAxisRange;

    this.elements = [];

    if (showX) {
      const intX = intervalX || interval;

      let minXLine = Math.ceil(minX + intX) - intX;
      let maxXLine = Math.floor(maxX + intX) - intX;

      minXLine += +(Math.round(minX) === minXLine);
      maxXLine += -(Math.round(maxX) === maxXLine);

      // Make sure it falls on the interval
      minXLine -= minXLine % intX;
      maxXLine -= maxXLine % intX;

      for (let x = minXLine; x <= maxXLine; x += intX) {
        if (x !== 0) {
          const text = new Text({
            fontSize,
            offset: [0, -14],
          });

          text.addPoint(x, new Vector2(x, 0));

          this.elements.push(text);
        }
      }
    }

    if (showY) {
      const intY = intervalY || interval;

      let minYLine = Math.ceil(minY + intY) - intY;
      let maxYLine = Math.floor(maxY + intY) - intY;

      minYLine += +(Math.round(minY) === minYLine);
      maxYLine += -(Math.round(maxY) === maxYLine);

      minYLine -= minYLine % intY;
      maxYLine -= maxYLine % intY;

      for (let y = minYLine; y <= maxYLine; y += intY) {
        if (y !== 0) {
          const text = new Text({
            fontSize,
            offset: [-10, 0],
          });

          text.addPoint(y, new Vector2(0, y));

          this.elements.push(text);
        }
      }
    }

    if (showX || showY) {
      const text = new Text({
        fontSize,
        offset: [-10, -14],
      });

      text.addPoint(0, new Vector2(0, 0));

      this.elements.push(text);
    }
  }
}

Scale.optionTypes = {
  fontSize: 14,
  interval: 1,
  intervalX: null,
  intervalY: null,
  showX: true,
  showY: true,
  zIndex: 0,
};
