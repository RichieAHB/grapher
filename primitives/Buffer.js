import Primitive from './Primitive';
import Line from '../renderables/Line';
import Vector2 from '../math/Vector2';
import _Buffer from '../buffers/Buffer';
import optionTypes from './bufferOptionTypes';

export default class Buffer extends Primitive {

  make() {

    const {context, settings} = this;

    const _buffer = this._buffer = new _Buffer(context, settings);
  }
}

Buffer.optionTypes = optionTypes;