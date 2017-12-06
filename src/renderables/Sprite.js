import Renderable from './Renderable';
import Vector2 from '../math/Vector2';

export default class Sprite extends Renderable {

  constructor(options = {}) {
    super(options);

    this.points = [];
  }

  addPoint(point) {
    this.points.push(point);
  }
}

Sprite.optionTypes = {
  origin: new Vector2(0, 0),
  height: 0,
  map: null,
  width: 0,
};
