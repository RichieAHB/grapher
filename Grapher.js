import Context from './Context';
import * as ScaleUtils from './utils/ScaleUtils';

const _baseScaleFactor = 50;
let id = 1;

export default class Grapher {

  constructor(options = {}) {
    const settings = Object.assign({}, this.constructor.defaultOptions, options);
    this.context = new Context(settings);

    this.primitives = [];
    this.buffers = [];
    this.hovered = {
      primitive: null,
      elementIndex: null,
    };

    this._updateDimensions(true);
    this._addListeners();

    this.frame();
  }

  appendTo(node) {
    node.appendChild(this.context.renderer.canvas);
    this._removeWrapperListeners();
    this.context.wrapper = node;
    this._addWrapperListeners();
    this._updateDimensions();
  }

  add(type, options) {
    const primitive = this.context.primitiveFactory.make(type, options);
    this.primitives.push(primitive);
    this.primitives.sort((a, b) => {
      return (a.settings.zIndex || 0) > (b.settings.zIndex || 0) ? 1 : -1;
    });

    if (!this.context.live) {
      this.frame();
    }

    return primitive;
  }

  _addListeners() {
    this._addWrapperListeners();
    window.addEventListener('resize', e => this._updateDimensions());
  }

  _addWrapperListeners() {
    const {context} = this;
    const {zoomEnabled} = context;

    if (context.wrapper) {
      if (zoomEnabled) {
        context.wrapper.addEventListener('mousewheel', this._onMousewheel.bind(this));
      }

      context.wrapper.addEventListener('mousemove', this._onMousemove.bind(this));
    }
  }

  _removeWrapperListeners() {
    const {context} = this;
    if (context.wrapper) {
      context.wrapper.removeEventListener('mousewheel', this._onMousewheel.bind(this));
      context.wrapper.removeEventListener('mousemove', this._onMousemove.bind(this));
    }
  }

  _onMousewheel(e) {
    e.preventDefault();
    const {zoom} = this.context;
    const _zoom = Math.min(10, Math.max(0.5, zoom + (e.deltaY / 10)));
    this.context.zoom = _zoom;
    this._updateDimensions();
  }

  _onMousemove({offsetX, offsetY}) {
    const {context} = this;
    const {center, width, height} = context;
    context.mousePos.x = offsetX;
    context.mousePos.y = offsetY;
    const [pxX, pxY] = this._getPxPerUnit();
    context.mouseCoord.x = ScaleUtils.pxToCoord(offsetX, width,  center.x, pxX);
    context.mouseCoord.y = ScaleUtils.pxToCoord(offsetY, height, center.y, pxY);
  }

  _updateDimensions(init = false) {
    const {wrapper, startRange, center, width, height} = this.context;
    const hasWrapper = wrapper;

    const oldWidth = width;
    const oldHeight = height;

    const newWidth  = this.context.width  = hasWrapper ? wrapper.offsetWidth  : window.innerWidth;
    const newHeight = this.context.height = hasWrapper ? wrapper.offsetHeight : window.innerHeight;

    if (!startRange) {

      const [pxX, pxY] = this._getPxPerUnit();

      const [minX, maxX] = ScaleUtils.getVisibleAxisRange(newWidth,  center.x, pxX);
      const [minY, maxY] = ScaleUtils.getVisibleAxisRange(newHeight, center.y, pxY);

      this.context.visibleAxisRange = {
        minX,
        maxX,
        minY,
        maxY,
      };

      this.context.events.trigger('grapher:resize');

    } else if (init) {
      const [minX, maxX, minY, maxY] = startRange;

      this.context.visibleAxisRange = {
        minX,
        maxX,
        minY,
        maxY,
      };
    }

    if (!this.context.live) {
      this.frame();
    }
  }

  frame() {
    const {_primitives, primitives, context} = this;
    const {renderer, interactionRenderer, width, height, mousePos} = context;

    context.clock = Date.now();

    renderer.resize(width, height);
    renderer.clear();

    interactionRenderer.resize(width, height);

    const oldHovered = this.hovered;
    this.hovered = {
      primitive: null,
      elementIndex: null,
    };

    primitives.forEach(primitive => {

      const {_id} = primitive;

      primitive.elements.forEach((element, i) => {
        const [pxX, pxY] = this._getPxPerUnit();

        renderer.render(element, pxX, pxY, this.context.center);

        // Hacky interaction check
        // check in different way!
        if (primitive.settings.mouseenter) {
          const {settings} = element;
          const {color} = settings;

          settings.color = `rgba(${_id}, ${i}, 0, 1)`;
          interactionRenderer.render(element);

          const imgData = interactionRenderer.ctx.getImageData(mousePos.x, mousePos.y, 1, 1);

          if (imgData.data[0]) {
            this.hovered = {
              primitive,
              elementIndex: i,
            };
          }

          interactionRenderer.clear();
          settings.color = color;
        }

      });
    });

    this._runInteractionEvents(oldHovered, this.hovered);

    context.events.trigger('post');

    // Should this always be going?
    if (this.context.live) {
      window.requestAnimationFrame(() =>  this.frame());
    }
  }

  _runInteractionEvents(oldHovered, newHovered) {
    const oldPrimitive    = oldHovered.primitive;
    const oldElementIndex = oldHovered.elementIndex;
    const newPrimitive    = newHovered.primitive;
    const newElementIndex = newHovered.elementIndex;

    if (newPrimitive) {
      if (oldPrimitive != newPrimitive) {
        document.body.style.cursor = "pointer";

        newPrimitive.settings.mouseenter.call(
          null,
          newPrimitive.update.bind(newPrimitive),
          newElementIndex
        );
      }
    } else {
      document.body.style.cursor = "auto";
    }

    if (
      oldPrimitive
      && newPrimitive !== oldPrimitive
      && oldPrimitive.settings.mouseleave
    ) {
      oldPrimitive.settings.mouseleave.call(
        null,
        oldPrimitive.update.bind(oldPrimitive),
        oldElementIndex
      );
    }
  }

  destroy() {
    this.context.renderer.canvas.remove();
  }

  _getPxPerUnit() {
    const {startRange, width, height, zoom} = this.context;

    let minX;
    let maxX;
    let minY;
    let maxY;

    if (startRange) {
      [minX, maxX, minY, maxY] = startRange;
    } else {
      const x = 10;
      const y = 10 * (height / width);
      [minX, maxX, minY, maxY] = [-x, x, -y, y];
    }

    return [width / (maxX - minX) * zoom, height / (maxY - minY) * zoom];
    // return this.context.zoom * _baseScaleFactor;
  }
}

Grapher.defaultOptions = {
  live: false,
  startRange: false,
  wrapper: false,
  zoomEnabled: false,
};
