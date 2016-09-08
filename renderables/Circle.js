import Renderable from './Renderable';

export default class Circle extends Renderable {
  constructor(options = {}) {
    super(options);

    this.points = [];
  }

  addPoint(point) {
    this.points.push(point);
  }
}

Circle.optionTypes = {
  color: '#333',
  lineWidth: 2,
  radius: 1,
};