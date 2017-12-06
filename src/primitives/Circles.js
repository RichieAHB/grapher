import Primitive from './Primitive';
import Circle from '../renderables/Circle';
import Vector2 from '../math/Vector2';

export default class Circles extends Primitive {

  make() {
    const { settings } = this;
    const { color, radius, lineWidth, buffer } = settings;
    const { data } = buffer._buffer;

    this.elements = [];

    const circle = new Circle({
      color,
      radius,
      lineWidth,
    });

    for (let i = 0; i < data.length; i += 2) {
      circle.addPoint(new Vector2(data[i], data[i + 1]));
    }

    this.elements.push(circle);
  }
}

Circles.optionTypes = {
  buffer: null,
  color: '#555',
  lineWidth: 2,
  radius: 1,
};
