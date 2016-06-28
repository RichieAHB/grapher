import * as Primitives from './';

export default class PrimitiveFactory {
  constructor(context) {
    this.context = context;
  }

  make(type, options) {
    const _type = `${type.charAt(0).toUpperCase()}${type.substring(1)}`;
    return new Primitives[_type](this.context, options);
  }
}