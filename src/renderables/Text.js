import Renderable from './Renderable';

export default class Text extends Renderable {

  constructor(options = {}) {
    super(options);

    this.points = [];
  }

  addPoint(text, point) {
    this.points.push({
      text,
      point,
    });
  }
}

Text.optionTypes = {
  fontColor: '#333',
  fontFamily: 'Arial',
  fontSize: 16,
  offset: [0, 0],
  outlineColor: '#fff',
  outlineWidth: 2,
  textAlign: 'center',
  textBaseline: 'middle',
};
