import Primitive from './Primitive';
import Sprite from '../renderables/Sprite';
import * as SpriteUtils from '../utils/SpriteUtils';
import Vector2 from '../math/Vector2';

export default class Points extends Primitive {

  make() {

    const {settings, context} = this;
    const {color, size, buffer} = settings;
    const {data} = buffer._buffer;

    this.elements = [];

    const point = SpriteUtils.createPointSprite(size, color);

    for (let i = 0; i < data.length; i += 2) {
      point.addPoint(new Vector2(data[i], data[i+1]));
    }

    this.elements.push(point);
  }
}

Points.optionTypes = {
  buffer: null,
  color: '#555',
  size: 5,
};