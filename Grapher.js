import Context from './Context';
import * as ScaleUtils from './utils/ScaleUtils';

export default class Grapher {

  constructor(options = {}) {
    const settings = Object.assign({}, this.constructor.defaultOptions, options);
    this.context = new Context(settings);

    this.primitives = [];
    this.intersectingPrimitives = {};
    this.buffers = [];
    this.hovered = {
      primitive: null,
      elementIndex: null,
    };

    this._updateOnMouseMove = false;

    this._updateDimensions = this._updateDimensions.bind(this);
    this._onMousewheel = this._onMousewheel.bind(this);
    this._onMousemove = this._onMousemove.bind(this);

    this._updateDimensions(true);
    this._addListeners();

    if (this.context.wrapper) {
      this.frame();
    }
  }

  appendTo(node) {
    node.appendChild(this.canvas);
    this._removeWrapperListeners();
    this.context.wrapper = node;
    this._addWrapperListeners();
    this._updateDimensions();
    this.frame();
  }

  add(type, options, update = true) {
    const primitive = this.context.primitiveFactory.make(type, options);

    // Need a better way to do this
    if (primitive.hasTrait('mousemove') && !this._updateOnMouseMove) {
      this.context.events.listen('mousemove', this.frame.bind(this), -1);

      this._updateOnMouseMove = true;
    }

    const groupId = primitive.settings.intersectionGroup;

    if (groupId) {
      this.intersectingPrimitives[groupId] =
        this.intersectingPrimitives[groupId] || {};
      this.intersectingPrimitives[groupId].primitives =
        this.intersectingPrimitives[groupId].primitives || [];
      this.intersectingPrimitives[groupId].primitives.push(primitive);
      this.intersectingPrimitives[groupId].zIndex = Math.max(
        this.intersectingPrimitives[groupId].zIndex,
        primitive.zIndex,
      );
    } else {
      this.primitives.push(primitive);
      this.primitives.sort((a, b) =>
        ((a.settings.zIndex || 0) > (b.settings.zIndex || 0) ? 1 : -1)
      );
    }

    if (!this.context.live && update) {
      this.frame();
    }

    return primitive;
  }

  remove(primitive) {
    const newPrimitives = [];
    this.primitives.forEach((candidate) => {
      if (candidate !== primitive) {
        newPrimitives.push(candidate);
      }
    });
    this.primitives = newPrimitives;
  }

  select(id) {
    for (let i = 0; i < this.primitives.length; i += 1) {
      const primitive = this.primitives[i];

      if (primitive._id === id) {
        return primitive;
      }
    }

    return null;
  }

  _addListeners() {
    this._addWrapperListeners();
    window.addEventListener('resize', this._updateDimensions);
  }

  _removeListeners() {
    this._removeWrapperListeners();
    window.removeEventListener('resize', this._updateDimensions);
  }

  _addWrapperListeners() {
    const { context } = this;
    const { zoomEnabled } = context;

    if (context.wrapper) {
      if (zoomEnabled) {
        context.wrapper.addEventListener('mousewheel', this._onMousewheel.bind(this));
      }

      context.wrapper.addEventListener('mousemove', this._onMousemove.bind(this));
      context.wrapper.addEventListener('touchmove', this._onTouchmove.bind(this));
    }
  }

  _removeWrapperListeners() {
    const { context } = this;
    if (context.wrapper) {
      context.wrapper.removeEventListener('mousewheel', this._onMousewheel.bind(this));
      context.wrapper.removeEventListener('mousemove', this._onMousemove.bind(this));
      context.wrapper.removeEventListener('touchmove', this._onTouchmove.bind(this));
    }
  }

  _onMousewheel(e) {
    e.preventDefault();
    const { zoom } = this.context;
    const _zoom = Math.min(10, Math.max(0.5, zoom + (e.deltaY / 10)));
    this.context.zoom = _zoom;
    this._updateDimensions();
  }

  _onMousemove({ offsetX, offsetY }) {
    this._onMove(offsetX, offsetY);
  }

  _onTouchmove({ touches }) {
    const { clientX, clientY, target } = touches[0];
    const { left, top } = target.getBoundingClientRect();
    const offsetX = clientX - left;
    const offsetY = clientY - top;
    this._onMove(offsetX, offsetY);
  }

  _onMove(offsetX, offsetY) {
    const { context } = this;
    const { center, width, height } = context;
    context.mousePos.x = offsetX;
    context.mousePos.y = offsetY;
    const [pxX, pxY] = this._getPxPerUnit();
    context.mouseCoord.x = ScaleUtils.pxToCoord(offsetX, width, center.x, pxX);
    context.mouseCoord.y = ScaleUtils.pxToCoord(Math.abs(offsetY - height), height, center.y, pxY);

    window.requestAnimationFrame(() => {
      context.events.trigger('mousemove', [context.mouseCoord.x, context.mouseCoord.y]);
    });
  }

  updateDimensions(width, height) {
    this._updateDimensions(false, width, height);
  }

  _updateDimensions(init = false, width = window.innerWidth, height = window.innerHeight) {
    const { wrapper, startRange, center } = this.context;
    const hasWrapper = wrapper;

    const newWidth = this.context.width = hasWrapper ? wrapper.offsetWidth : width;
    const newHeight = this.context.height = hasWrapper ? wrapper.offsetHeight : height;

    const [pxX, pxY] = this._getPxPerUnit();

    this.context.pxPerUnit.x = pxX;
    this.context.pxPerUnit.y = pxY;

    if (!startRange) {
      const [minX, maxX] = ScaleUtils.getVisibleAxisRange(newWidth, center.x, pxX);
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

  _createIntersectionSprites() {
    const { compositionRenderer } = this.context;
    const sprites = [];

    Object.keys(this.intersectingPrimitives).forEach((key) => {
      const { primitives, zIndex } = this.intersectingPrimitives[key];
      compositionRenderer.clear();
      compositionRenderer.ctx.globalCompositeOperation = 'source-over';

      primitives.forEach((primitive, index) => {
        if (index === 1) {
          compositionRenderer.ctx.globalCompositeOperation = 'source-in';
        }

        primitive.elements.forEach((element) => {
          const [pxX, pxY] = this._getPxPerUnit();
          compositionRenderer.render(element, pxX, pxY, this.context.center);
        });
      });

      const img = compositionRenderer.canvas;
      const primitive = this.context.primitiveFactory.make('sprite', {
        map: img,
        fill: true,
        zIndex,
      });

      sprites.push(primitive);
    });

    return sprites;
  }

  frame() {
    const { context, primitives } = this;
    const { renderer, interactionRenderer, compositionRenderer, width, height, mousePos } = context;

    context.clock = Date.now();

    renderer.resize(width, height);
    interactionRenderer.resize(width, height);
    compositionRenderer.resize(width, height);

    const _primitives = primitives.concat(this._createIntersectionSprites());

    _primitives.sort((a, b) => {
      const aZ = a.settings.zIndex || 0;
      const bZ = b.settings.zIndex || 0;
      if (aZ > bZ) {
        return 1;
      }
      if (aZ < bZ) {
        return -1;
      }
      return 0;
    });

    this.context.events.trigger('pre');

    const oldHovered = this.hovered;
    this.hovered = {
      primitive: null,
      elementIndex: null,
    };

    renderer.clear();
    _primitives.forEach((primitive) => {
      const { _id } = primitive;

      primitive.elements.forEach((element, i) => {
        const [pxX, pxY] = this._getPxPerUnit();

        renderer.render(element, pxX, pxY, this.context.center);

        primitive.events.trigger('afterRender', [primitive]);

        // Hacky interaction check
        // check in different way!
        if (primitive.settings.mouseenter) {
          const { settings } = element;
          const { color } = settings;

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

    this._runInteractionEvents(oldHovered);

    context.events.trigger('post');

    // Should this always be going?
    if (this.context.live) {
      window.requestAnimationFrame(() => this.frame.bind(this));
    }
  }

  _runInteractionEvents(oldHovered) {
    const oldPrimitive = oldHovered.primitive;
    const oldElementIndex = oldHovered.elementIndex;
    const newPrimitive = this.hovered.primitive;
    const newElementIndex = this.hovered.elementIndex;

    if (newPrimitive) {
      if (oldPrimitive !== newPrimitive) {
        document.body.style.cursor = 'pointer';

        newPrimitive.settings.mouseenter.call(
          null,
          newPrimitive.update.bind(newPrimitive),
          newElementIndex
        );
      }
    } else {
      document.body.style.cursor = 'auto';
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

  get canvas() {
    return this.context.renderer.canvas;
  }

  get ctx() {
    return this.context.renderer.ctx;
  }

  destroy() {
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this._removeListeners();
  }

  _getPxPerUnit() {
    const { startRange, width, height, zoom } = this.context;

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

    return [Math.abs((width / (maxX - minX)) * zoom), Math.abs((height / (maxY - minY)) * zoom)];
    // return this.context.zoom * _baseScaleFactor;
  }

  toImage() {
    return this.context.renderer.toImage();
  }

  listen(name, listener) {
    this.context.events.listen(name, listener);
  }

  get width() {
    return this.context.width;
  }

  get height() {
    return this.context.height;
  }
}

Grapher.defaultOptions = {
  live: false,
  startRange: false,
  wrapper: false,
  zoomEnabled: false,
};
