import Primitive from './Primitive';
import Line from '../renderables/Line';
import Vector2 from '../math/Vector2';

export default class Axis extends Primitive {

  make() {

    const {settings, context} = this;
    const {strokeColor, strokeWidth} = settings;
    const {minX, maxX, minY, maxY} = context.visibleAxisRange;

    this.elements = [];

    const xAxis = new Line({
      color: strokeColor,
      width: strokeWidth,
    });

    xAxis.addPoint(new Vector2(0, minY));
    xAxis.addPoint(new Vector2(0, maxY));

    this.elements.push(xAxis);

    const yAxis = new Line({
      color: strokeColor,
      width: strokeWidth,
    });

    yAxis.addPoint(new Vector2(minX, 0));
    yAxis.addPoint(new Vector2(maxX, 0));

    this.elements.push(yAxis);
  }
}

Axis.optionTypes = {
  strokeColor: '#555',
  strokeWidth: 2,
};