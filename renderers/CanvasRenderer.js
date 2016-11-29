import Vector2 from '../math/Vector2';
import Line from '../renderables/Line';
import Text from '../renderables/Text';
import Polygon from '../renderables/Polygon';
import Sprite from '../renderables/Sprite';
import Circle from '../renderables/Circle';
import { canvasToImage } from '../utils/CanvasUtils';

export default class CanvasRenderer {

  constructor(wrapper) {
    const canvas = this.canvas = document.createElement('canvas');
    this.ctx = canvas.getContext('2d');

    if (wrapper) {
      wrapper.appendChild(canvas);
    }
  }

  resize(width, height) {
    const { ctx, canvas } = this;
    canvas.width = width;
    canvas.height = height;
    ctx.translate(Math.round(width / 2), Math.round(height / 2));
  }

  render(renderable, scaleX = 50, scaleY = 50, center = new Vector2()) {
    if (renderable instanceof Line) {
      this._renderLine(renderable, scaleX, scaleY, center);
    } else if (renderable instanceof Text) {
      this._renderText(renderable, scaleX, scaleY, center);
    } else if (renderable instanceof Polygon) {
      this._renderPolygon(renderable, scaleX, scaleY, center);
    } else if (renderable instanceof Sprite) {
      this._renderSprite(renderable, scaleX, scaleY, center);
    } else if (renderable instanceof Circle) {
      this._renderCircle(renderable, scaleX, scaleY, center);
    }
  }

  getPixel(x, y) {
    const data = this.ctx.getImageData(x, y, 1, 1).data;
    return data;
  }

  _renderLine(lineEl, scaleX, scaleY, center) {
    const { ctx } = this;
    const { points, settings } = lineEl;
    const { color, width, lineDash } = settings;

    ctx.save();

    if (width % 2) {
      ctx.translate(0.5, 0.5);
    }

    const firstPoint = points[0]
       .subtract(center)
       .scale(scaleX, -scaleY);

    ctx.beginPath();
    ctx.moveTo(Math.round(firstPoint.x), Math.round(firstPoint.y));

    for (let i = 1; i < points.length; i += 1) {
      const point = points[i]
        .subtract(center)
        .scale(scaleX, -scaleY);
      ctx.lineTo(Math.round(point.x), Math.round(point.y));
    }

    ctx.restore();

    if (ctx.setLineDash) {
      ctx.setLineDash(lineDash || []);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.stroke();
  }

  _renderText(textEl, scaleX, scaleY, center) {
    const { ctx } = this;
    const { points, settings } = textEl;
    const {
      fontFamily,
      fontColor,
      fontSize,
      offset,
      outlineColor,
      outlineWidth,
      textAlign,
      textBaseline,
    } = settings;

    for (let i = 0; i < points.length; i += 1) {
      let { point, text } = points[i];
      point = point
        .subtract(center)
        .scale(scaleX, -scaleY)
        .add(new Vector2(offset[0], -offset[1]));

      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = fontColor;
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;

      if (ctx.setLineDash) {
        ctx.setLineDash([]);
      }

      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = outlineWidth * 2;

      if (settings.lineWidth % 2) {
        ctx.save();
        ctx.translate(0.5, 0.5);
        ctx.strokeText(text, point.x, point.y);
        ctx.restore();
      } else {
        ctx.strokeText(text, point.x, point.y);
      }

      ctx.fillText(text, point.x, point.y);
    }
  }

  _renderPolygon(polygonEl, scaleX, scaleY, center) {
    const { ctx } = this;
    const { points, settings } = polygonEl;
    const { color } = settings;

    ctx.fillStyle = color;

    const firstPoint = points[0]
      .subtract(center)
      .scale(scaleX, -scaleY);

    ctx.beginPath();
    ctx.moveTo(Math.round(firstPoint.x), Math.round(firstPoint.y));

    for (let i = 1; i < points.length; i += 1) {
      const point = points[i]
        .subtract(center)
        .scale(scaleX, -scaleY);

      ctx.lineTo(Math.round(point.x), Math.round(point.y));
    }

    ctx.fill();
  }

  _renderSprite(spriteEl, scaleX, scaleY, center) {
    const map = spriteEl.settings.map;

    if (map.nodeName === 'CANVAS' || (map.complete && map.naturalHeight !== 0)) {
      this._actuallyRenderSprite(spriteEl, scaleX, scaleY, center);
    } else {
      map.addEventListener('load', () => this._actuallyRenderSprite(spriteEl, scaleX, scaleY, center));
    }
  }

  _actuallyRenderSprite(spriteEl, scaleX, scaleY, center) {
    const { ctx } = this;
    const { points, settings } = spriteEl;
    const { height, map, origin, width } = settings;

    for (let i = 0; i < points.length; i += 1) {
      const point = points[i]
        .subtract(center)
        .scale(scaleX, -scaleY)
        .subtract(origin);

      // Math.floor for safari bug not rendering when width and height are
      // outside the bounds of the source image
      ctx.drawImage(map, point.x, point.y, width, height);
    }
  }

  _renderCircle(pointEl, scaleX, scaleY, center) {
    const { ctx } = this;
    const { points, settings } = pointEl;
    const { radius, color, lineWidth } = settings;

    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];

      ctx.save();
      ctx.scale(scaleX, -scaleY);
      ctx.translate(-center.x, -center.y);
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.restore();

      ctx.lineWidth = lineWidth;

      if (ctx.setLineDash) {
        ctx.setLineDash([]);
      }

      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }

  clear() {
    const { canvas, ctx } = this;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  toImage() {
    return canvasToImage(this.canvas);
  }
}
