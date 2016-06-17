import Primitives from './';

export default class PrimitiveFactory {
  constructor(context) {
    this.context = context;
  }

  make(type, options) {
    return new Primitives[type](this.context, options);
  }
}