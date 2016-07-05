import Vector2 from '../math/Vector2';
import Line from '../renderables/Line';
import Text from '../renderables/Text';
import Point from '../renderables/Point';

export default class CanvasRenderer {

  constructor(wrapper) {

    const canvas = this.canvas = document.createElement('canvas');
    const ctx = this.ctx = canvas.getContext('2d');

    if (wrapper) {
      wrapper.appendChild(canvas);
    }
  }

  resize(width, height) {
    const {ctx, canvas} = this;
    canvas.width = width;
    canvas.height = height;
    ctx.translate(Math.round(width / 2), Math.round(height / 2));
  }

  render(renderable, scaleX = 50, scaleY = 50, center = new Vector2()) {
    if (renderable instanceof Line) {
      this._renderLine(renderable, scaleX, scaleY, center);
    } else if (renderable instanceof Text) {
      this._renderText(renderable, scaleX, scaleY, center);
    } else if (renderable instanceof Point) {
      this._renderPoint(renderable, scaleX, scaleY, center);
    }
  }

  getPixel(x, y) {
    const data = this.ctx.getImageData(x, y, 1, 1).data;
    return data;
  }

  _renderLine(line, scaleX, scaleY, center) {

    const {canvas, ctx} = this;
    const {points, settings} = line;
    const {color, lineWidth} = settings;

    if (lineWidth % 2) {
      ctx.save();
      ctx.translate(.5, .5);
    }

    const firstPoint = points[0].subtract(center).scale(scaleX, -scaleY);

    ctx.beginPath();
    ctx.moveTo(Math.round(firstPoint.x), Math.round(firstPoint.y));

    for (let i = 1; i < points.length; i++) {
      const point = points[i].subtract(center).scale(scaleX, -scaleY);
      ctx.lineTo(Math.round(point.x), Math.round(point.y));
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.stroke();

    if (lineWidth % 2) {
      ctx.restore();
    }
  }

  _renderPoint(point, scaleX, scaleY, center) {

    const {canvas, ctx} = this;
    const {points, settings} = point;
    const {size, color} = settings;

    for (let i = 0; i < points.length; i++) {
      const _point = points[i].subtract(center).scale(scaleX, -scaleY);
      ctx.beginPath();
      ctx.arc(Math.round(_point.x), Math.round(_point.y), size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  _renderText(text, scaleX, scaleY, center) {

    const {canvas, ctx} = this;
    const {points, settings} = text;
    const {fontFamily, fontColor, fontSize, outlineColor, outlineWidth} = settings;

    for (let i = 0; i < points.length; i++) {
      let { point, text } = points[i];
      point = point.subtract(center).scale(scaleX, -scaleY);

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = fontColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = outlineWidth * 2;

      if (settings.lineWidth % 2) {
        ctx.save();
        ctx.translate(.5, .5);
        ctx.strokeText(text, point.x, point.y);
        ctx.restore();
      } else {
        ctx.strokeText(text, point.x, point.y);
      }

      ctx.fillText(text, point.x, point.y);
    }
  }

  clear() {
    const {canvas, ctx} = this;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}