import Primitive from './Primitive';
import Text from '../renderables/Text';
import Vector2 from '../math/Vector2';

export default class Scale extends Primitive {

  make() {

    const {settings, context} = this;
    const {interval, showX, showY} = settings;
    const {minX, maxX, minY, maxY} = context.visibleAxisRange;

    this.elements = [];

    if (showX) {

      let minXLine = Math.ceil(minX);
      let maxXLine = Math.floor(maxX);

      minXLine += +(Math.round(minX) === minXLine);
      maxXLine += -(Math.round(maxX) === maxXLine);

      // Make sure it falls on the interval
      minXLine = minXLine - (minXLine % interval);
      maxXLine = maxXLine - (maxXLine % interval);

      for (let x = minXLine; x <= maxXLine; x += interval) {

        const text = new Text();

        text.addPoint(x, new Vector2(x, 0));

        this.elements.push(text);
      }
    }

    if (showY) {

      let minYLine = Math.ceil(minY);
      let maxYLine = Math.floor(maxY);

      minYLine += +(Math.round(minY) === minYLine);
      maxYLine += -(Math.round(maxY) === maxYLine);

      minYLine = minYLine - (minYLine % interval);
      maxYLine = maxYLine - (maxYLine % interval);

      for (let y = minYLine; y <= maxYLine; y += interval) {

        const text = new Text();

        text.addPoint(y, new Vector2(0, y));

        this.elements.push(text);
      }
    }
  }
}

Scale.optionTypes = {
  interval: 1,
  showX: true,
  showY: true,
  zIndex: 0,
};