import Renderable from './Renderable';

export default class Arrow extends Renderable {
  constructor(options = {}) {
    super(options);

    this.points = [];
  }

  addPoint(point) {
    this.points.push(point);
  }
}

Arrow.optionTypes = {
  color: '#333',
  rotation: 0,
  size: 10,
};