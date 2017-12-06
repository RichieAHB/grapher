import Primitive from './Primitive';
import Vector2 from '../math/Vector2';
import Polygon from '../renderables/Polygon';

export default class Integral extends Primitive {
  make() {
    const { settings } = this;
    const { color, buffer } = settings;
    const { data } = buffer._buffer;

    this.elements = [];

    const polygon = new Polygon({
      color,
    });

    polygon.addPoint(new Vector2(data[0], 0));

    // Could break if channels is set to anything other than 2!
    for (let i = 0; i < data.length; i += 2) {
      polygon.addPoint(new Vector2(data[i], data[i + 1]));
    }

    polygon.addPoint(new Vector2(data[data.length - 2], 0));

    this.elements.push(polygon);
  }
}

Integral.optionTypes = {
  buffer: null,
  color: 'rgba(128, 128, 128, 0.5)',
  intersectionGroup: null,
};
