import PrimitiveFactory from './primitives/PrimitiveFactory';
import CanvasRenderer from './renderers/CanvasRenderer';
import Vector2 from './math/Vector2';
import EventEmitter from './EventEmitter';
import * as ScaleUtils from './utils/ScaleUtils';

export default class Context {
  constructor(options) {
    this.wrapper = options.wrapper;
    this.startRange = options.startRange;
    this.zoomEnabled = options.zoomEnabled;
    this.live = options.live;

    this.center = this.startRange ?
        ScaleUtils.getCenterFromRange(this.startRange) :
        new Vector2();

    this.zoom = 1;

    this.events = new EventEmitter();
    this.primitiveFactory = new PrimitiveFactory(this);

    this.renderer = new CanvasRenderer(this.wrapper);
    this.interactionRenderer = new CanvasRenderer();

    this.mousePos = new Vector2(-1, -1);
    this.mouseCoord = new Vector2(-1, -1);
    this.pxPerUnit = new Vector2(-1, -1);

    this.clock = Date.now();
  }
}
