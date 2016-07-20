import bufferOptionTypes from './bufferOptionTypes';
import EventEmitter from '../EventEmitter';

let id = 1;

export default class Primtive {

  constructor(context, options = {}) {

    // The context for the Grapher
    this.context = context;

    // Allow the buffer options to be passed directly to the primitive
    const optionTypes = Object.assign({ id: false }, this.constructor.optionTypes, bufferOptionTypes);

    this.settings = {};

    this.settings = Object.assign({}, optionTypes, options);

    // If there is no buffer (and the primitive needs one) then assume the
    // buffer options have been passed here, this may cause issues!
    if (this.constructor.optionTypes.hasOwnProperty('buffer') && !this.settings.buffer) {
      this.settings.buffer = this.context.primitiveFactory.make('Buffer', this.settings);
    }

    this._id = this.settings.id || id++;

    this.events = new EventEmitter();

    // Add a resize listener for remaking this when the grapher changes size
    // TODO: only do this for elements that cover the grapher
    this.context.events.listen('grapher:resize', this.make.bind(this));

    if (this.settings.buffer) {
      this.settings.buffer.events.listen('update', this.make.bind(this));
    }

    // Init empty elements array
    this.elements = [];

    // Build all the elements
    this.make();
  }

  update(options, exprTime) {
    // Update the settings
    this.settings = Object.assign({}, this.settings, options);

    // TODO : Rebuild shouldn't need to do whole rebuild unless buffer changes
    this.make();

    this.events.trigger('update');
  }
}