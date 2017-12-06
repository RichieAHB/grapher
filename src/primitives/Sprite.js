import Primitive from './Primitive';
import Vector2 from '../math/Vector2';
import _Sprite from '../renderables/Sprite';

export default class Sprite extends Primitive {

  make() {
    const { settings } = this;
    const { origin, height, map, width, data, fill } = settings;
    const { canvas } = this.context.renderer;

    this.elements = [];

    const sprite = new _Sprite({
      origin: fill ?
        new Vector2(canvas.width / 2, canvas.height / 2) :
        Vector2.fromArray(origin),
      height: fill ? canvas.height : height,
      map,
      width: fill ? canvas.width : width,
    });

    if (fill) {
      sprite.addPoint(new Vector2(0, 0));
    } else {
      for (let i = 0; i < data.length; i += 2) {
        sprite.addPoint(new Vector2(data[i], data[i + 1]));
      }
    }

    this.elements.push(sprite);
  }
}

Sprite.optionTypes = {
  buffer: null,
  fill: false,
  origin: [0, 0],
  height: 0,
  map: null,
  width: 0,
};
