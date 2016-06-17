import Context from './Context';
import Primitives from './primitives';

import * as ScaleUtils from './utils/ScaleUtils';

const _baseScaleFactor = 50;

export default class Grapher {

  constructor(options = {}) {
    const settings = Object.assign({}, this.constructor.defaultOptions, options);
    this.context = new Context(settings);
    this.primitives = [];

    this._updateDimensions();
    this._addAPI();
    this._addListeners();

    this.draw();
  }

  _addAPI() {
    for (let type in Primitives) {

      if (!Primitives.hasOwnProperty(type)) continue;

      // Change the API to use lowercase
      const _type = `${type.charAt(0).toLowerCase()}${type.substring(1)}`;

      this.constructor.prototype[_type] = (options) => {

        const primtive = this.context.primitiveFactory.make(type, options);
        this._add(primtive);

        return this;
      };
    }
  }

  _add(primtive) {
    this.primitives.push(primtive);
  }

  _addListeners() {
    this.context.wrapper.addEventListener('mousewheel', e => {
      e.preventDefault();
      this.zoom = Math.max(0.5, this.zoom + (e.deltaY / 10));
    });

    window.addEventListener('resize', e => this._updateDimensions());
  }

  _updateDimensions() {
    const {wrapper, center, width, height} = this.context;
    const hasWrapper = wrapper !== document.body;

    const oldWidth = width;
    const oldHeight = height;

    const newWidth  = this.context.width  = hasWrapper ? wrapper.offsetWidth  : window.innerWidth;
    const newHeight = this.context.height = hasWrapper ? wrapper.offsetHeight : window.innerHeight;

    if (oldWidth !== newWidth || oldHeight !== newHeight) {

      const pxPerUnit = this._getPxPerUnit();

      const [minX, maxX] = ScaleUtils.getVisibleAxisRange(newWidth,  center.x, pxPerUnit);
      const [minY, maxY] = ScaleUtils.getVisibleAxisRange(newHeight, center.y, pxPerUnit);

      this.context.visibleAxisRange = {
        minX,
        maxX,
        minY,
        maxY,
      };

      this.context.events.trigger('grapher:resize');

      // TODO: Only rebuild if they require dimensions
      this.primitives.forEach(primitive => primitive.make());
    }
  }

  draw() {
    const {renderer} = this.context;

    renderer.clear();

    this.primitives.forEach(primitive => {
      primitive.elements.forEach(el => renderer.render(el));
    });

    window.requestAnimationFrame(() =>  this.draw());
  }

  _getPxPerUnit() {
    return this.context.zoom * _baseScaleFactor;
  }
}

Grapher.defaultOptions = {
  wrapper: document.body,
  step: 1,
};
