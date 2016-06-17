import Renderable from './Renderable';

export default class Point extends Renderable {
  constructor(options = {}) {
    super(options);

    this.points = [];
  }

  addPoint(point) {
    this.points.push(point);
  }
}

Point.optionTypes = {
  color: '#333',
  size: 5,
};