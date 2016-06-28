import PrimitiveFactory from './primitives/PrimitiveFactory';
import CanvasRenderer from './renderers/CanvasRenderer';
import Vector2 from './math/Vector2';
import EventEmitter from './EventEmitter';

export default class Context {
  constructor(options) {

    this.wrapper = options.wrapper;
    this.startRange = options.startRange;
    this.zoomEnabled = options.zoomEnabled;
    this.live = options.live;

    this.zoom = 1;
    this.center = new Vector2();

    this.events = new EventEmitter();
    this.primitiveFactory = new PrimitiveFactory(this);

    this.renderer = new CanvasRenderer(this.wrapper);
    this.interactionRenderer = new CanvasRenderer();

    this.mousePos = new Vector2(-1, -1);
    this.mouseCoord = new Vector2(-1, -1);

    this.clock = Date.now();
  }
}