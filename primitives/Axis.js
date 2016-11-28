import Primitive from './Primitive';
import Line from '../renderables/Line';
import Text from '../renderables/Text';
import Sprite from '../renderables/Sprite';
import Vector2 from '../math/Vector2';
import * as SpriteUtils from '../utils/SpriteUtils';

export default class Axis extends Primitive {

  make() {
    const { settings, context } = this;
    const { strokeColor, lineWidth, showX, showY, xLabel, yLabel, arrows } = settings;
    const { minX, maxX, minY, maxY } = context.visibleAxisRange;

    this.elements = [];

    const xAxisMax = new Vector2(maxX, 0);
    const yAxisMax = new Vector2(0, maxY);

    if (showX) {
      const xAxis = new Line({
        color: strokeColor,
        width: lineWidth,
      });


      xAxis.addPoint(new Vector2(minX, 0));
      xAxis.addPoint(xAxisMax);

      this.elements.push(xAxis);
    }

    if (showY) {
      const yAxis = new Line({
        color: strokeColor,
        width: lineWidth,
      });

      yAxis.addPoint(new Vector2(0, minY));
      yAxis.addPoint(yAxisMax);

      this.elements.push(yAxis);
    }

    if (xLabel && showX) {
      const _xLabel = xLabel === 'x' ? '𝑥' : xLabel;

      const xAxisLabel = new Text({
        fontSize: 16,
        offset: [-16, 16],
        textAlign: 'right',
        textBaseline: 'bottom',
      });

      xAxisLabel.addPoint(_xLabel, xAxisMax);

      this.elements.push(xAxisLabel);
    }

    if (yLabel && showY) {
      const _yLabel = yLabel === 'y' ? '𝑦' : yLabel;

      const yAxisLabel = new Text({
        fontSize: 16,
        offset: [16, -16],
        textAlign: 'left',
        textBaseline: 'top',
      });

      yAxisLabel.addPoint(_yLabel, yAxisMax);

      this.elements.push(yAxisLabel);
    }

    if (arrows) {
      const size = 10;

      const xMap = SpriteUtils.createArrowMap(size, 90, strokeColor);
      const yMap = SpriteUtils.createArrowMap(size, 0, strokeColor);

      const xAxisArrow = new Sprite({
        height: size * 2,
        map: xMap,
        origin: new Vector2(size, size),
        width: size * 2,
      });

      xAxisArrow.addPoint(xAxisMax);

      const yAxisArrow = new Sprite({
        height: size * 2,
        map: yMap,
        origin: new Vector2(size, size),
        width: size * 2,
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
  showX: true,
  showY: true,
  strokeColor: '#555',
  xLabel: false,
  yLabel: false,
  lineWidth: 2,
};
