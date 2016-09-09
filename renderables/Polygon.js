import Renderable from './Renderable';

export default class Polygon extends Renderable {
  constructor(options = {}) {
    super(options);

    this.points = [];
  }

  addPoint(point) {
    this.points.push(point);
  }
}

Polygon.optionTypes = {
  color: '#333',
};