import Primitive from './Primitive';
import Line from '../renderables/Line';
import Arrow from '../renderables/Arrow';
import Text from '../renderables/Text';
import Vector2 from '../math/Vector2';

export default class Axis extends Primitive {

  make() {

    const {settings, context} = this;
    const {strokeColor, lineWidth, xLabel, yLabel, arrows} = settings;
    const {minX, maxX, minY, maxY} = context.visibleAxisRange;

    this.elements = [];

    const xAxis = new Line({
      color: strokeColor,
      width: lineWidth,
    });

    const xAxisMax = new Vector2(maxX, 0);

    xAxis.addPoint(new Vector2(minX, 0));
    xAxis.addPoint(xAxisMax);

    const yAxis = new Line({
      color: strokeColor,
      width: lineWidth,
    });

    const yAxisMax = new Vector2(0, maxY);

    yAxis.addPoint(new Vector2(0, minY));
    yAxis.addPoint(yAxisMax);

    this.elements.push(
      xAxis,
      yAxis
    );

    if (xLabel) {

      const xAxisLabel = new Text({
        fontSize: 25,
      });

      xAxisLabel.addPoint(xLabel, xAxisMax.add(new Vector2(-.5, .5)));

      this.elements.push(xAxisLabel);
    }

    if (yLabel) {

      const yAxisLabel = new Text({
        fontSize: 25,
      });

      yAxisLabel.addPoint(yLabel, yAxisMax.add(new Vector2(.5, -.5)));

      this.elements.push(yAxisLabel);
    }

    if (arrows) {

      const xAxisArrow = new Arrow({
        color: strokeColor,
        rotation: -90,
      });

      xAxisArrow.addPoint(xAxisMax);

      const yAxisArrow = new Arrow({
        color: strokeColor,
        rotation: 0,
      });

      yAxisArrow.addPoint(yAxisMax);

      this.elements.push(
        xAxisArrow,
        yAxisArrow
      );
    }
  }
}

Axis.optionTypes = {
  arrows: false,
  strokeColor: '#555',
  xLabel: '𝑥',
  yLabel: '𝑦',
  lineWidth: 2,
};