import Renderable from './Renderable';

export default class Line extends Renderable {
  constructor(options = {}) {
    super(options);

    this.points = [];
  }

  addPoint(point) {
    this.points.push(point);
  }
}

Line.optionTypes = {
  color: '#333',
  width: 1,
};