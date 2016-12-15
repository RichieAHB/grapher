import Primitive from './Primitive';
import Text from '../renderables/Text';
import Vector2 from '../math/Vector2';

export default class Label extends Primitive {

  make() {
    const { settings } = this;
    const { color, size, buffer, text } = settings;
    const { data } = buffer._buffer;

    this.elements = [];

    let _text;

    if (text instanceof Array) {
      _text = text;
    } else if (typeof text === 'string') {
      _text = [text];
    } else {
      return;
    }

    const point = new Text({
      fontColor: color,
      fontSize: size,
    });

    for (let i = 0; i < data.length; i += 2) {
      point.addPoint(
        _text[i % _text.length],
        new Vector2(data[i], data[i + 1])
      );
    }

    this.elements.push(point);
  }
}

Label.optionTypes = {
  buffer: null,
  color: '#555',
  text: null,
  size: 16,
};
