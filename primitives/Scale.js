import Primitive from './Primitive';
import Text from '../renderables/Text';
import Vector2 from '../math/Vector2';

export default class Scale extends Primitive {

  make() {

    const {settings, context} = this;
    const {strokeColor, lineWidth} = settings;
    const {minX, maxX, minY, maxY} = context.visibleAxisRange;

    const minXLine = Math.ceil(minX);
    const maxXLine = Math.floor(maxX);

    this.elements = [];

    for (let x = minXLine; x <= maxXLine; x++) {

      const text = new Text();

      text.addPoint(x, new Vector2(x, 0));

      this.elements.push(text);
    }

    const minYLine = Math.ceil(minY);
    const maxYLine = Math.floor(maxY);

    for (let y = minYLine; y <= maxYLine; y++) {

      const text = new Text();

      text.addPoint(y, new Vector2(0, y));

      this.elements.push(text);
    }
  }
}

Scale.optionTypes = {
  strokeColor: '#ccc',
  lineWidth: 1,
  zIndex: 0,
};