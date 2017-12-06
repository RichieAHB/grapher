import Primitive from './Primitive';
import _Buffer from '../buffers/Buffer';
import optionTypes from './bufferOptionTypes';

export default class Buffer extends Primitive {

  make() {
    const { context, settings } = this;

    this._buffer = new _Buffer(context, settings);
  }
}

Buffer.optionTypes = optionTypes;
