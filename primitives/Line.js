import Primitive from './Primitive';
import _Line from '../renderables/Line';
import Vector2 from '../math/Vector2';

export default class Line extends Primitive {

  make() {

    const {settings, context} = this;
    const {color, lineWidth, buffer} = settings;
    const {data} = buffer._buffer;

    this.elements = [];

    const line = new _Line({
      color,
      width: lineWidth,
    });

    // Could break if channels is set to anything other than 2!
    for (let i = 0; i < data.length; i += 2) {
      line.addPoint(new Vector2(data[i], data[i+1]));
    }

    this.elements.push(line);
  }
}

Line.optionTypes = {
  color: '#555',
  mouseenter: false,
  mouseleave: false,
  buffer: null,
  lineWidth: 2,
};