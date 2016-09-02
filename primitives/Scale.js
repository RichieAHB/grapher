import Primitive from './Primitive';
import Text from '../renderables/Text';
import Vector2 from '../math/Vector2';

export default class Scale extends Primitive {

  make() {

    const {settings, context} = this;
    const {interval, intervalX, intervalY, showX, showY} = settings;
    const {minX, maxX, minY, maxY} = context.visibleAxisRange;

    this.elements = [];

    if (showX) {

      const intX = intervalX || interval;

      let minXLine = Math.ceil(minX);
      let maxXLine = Math.floor(maxX);

      minXLine += +(Math.round(minX) === minXLine);
      maxXLine += -(Math.round(maxX) === maxXLine);

      // Make sure it falls on the interval
      minXLine = minXLine - (minXLine % intX);
      maxXLine = maxXLine - (maxXLine % intX);

      for (let x = minXLine; x <= maxXLine; x += intX) {

        const text = new Text();

        text.addPoint(x, new Vector2(x, 0));

        this.elements.push(text);
      }
    }

    if (showY) {

      const intY = intervalY || interval;

      let minYLine = Math.ceil(minY);
      let maxYLine = Math.floor(maxY);

      minYLine += +(Math.round(minY) === minYLine);
      maxYLine += -(Math.round(maxY) === maxYLine);

      minYLine = minYLine - (minYLine % intY);
      maxYLine = maxYLine - (maxYLine % intY);

      for (let y = minYLine; y <= maxYLine; y += intY) {

        const text = new Text();

        text.addPoint(y, new Vector2(0, y));

        this.elements.push(text);
      }
    }
  }
}

Scale.optionTypes = {
  interval: 1,
  intervalX: null,
  intervalY: null,
  showX: true,
  showY: true,
  zIndex: 0,
};