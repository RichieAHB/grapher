import Primitive from './Primitive';
import Line from '../renderables/Line';
import Polygon from '../renderables/Polygon';
import Text from '../renderables/Text';
import Sprite from '../renderables/Sprite';
import Vector2 from '../math/Vector2';
import * as SpriteUtils from '../utils/SpriteUtils';

export default class Axis extends Primitive {

  make() {

    const {settings, context} = this;
    const {strokeColor, lineWidth, showX, showY, xLabel, yLabel, arrows} = settings;
    const {minX, maxX, minY, maxY} = context.visibleAxisRange;

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
        height: xMap.height,
        map: xMap,
        origin: new Vector2(xMap.width / 2, xMap.height / 2),
        width: xMap.width,
      });

      xAxisArrow.addPoint(xAxisMax);

      const yAxisArrow = new Sprite({
        height: yMap.height,
        map: yMap,
        origin: new Vector2(yMap.width / 2, yMap.height / 2),
        width: yMap.width,
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