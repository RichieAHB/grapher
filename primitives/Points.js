import Primitive from './Primitive';
import _Point from '../renderables/Point';
import Vector2 from '../math/Vector2';

export default class Point extends Primitive {

  make() {

    const {settings, context} = this;
    const {color, size, buffer} = settings;
    const {data} = buffer._buffer;

    this.elements = [];

    const point = new _Point({
      color,
      size,
    });

    for (let i = 0; i < data.length; i += 2) {
      point.addPoint(new Vector2(data[i], data[i+1]));
    }

    this.elements.push(point);
  }
}

Point.optionTypes = {
  buffer: false,
  color: '#555',
  size: 5,
};