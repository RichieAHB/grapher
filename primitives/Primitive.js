export default class Layer {

  constructor(context, options = {}) {

    this.context = context;

    const {optionTypes} = this.constructor;

    this.settings = {};

    for (let type in optionTypes) {
      this.settings[type] = options[type] || optionTypes[type];
    }

    this.elements = [];

    this.context.events.listen('grapher:resize', () => {
      this.make();
    });

    this.make();
  }
}