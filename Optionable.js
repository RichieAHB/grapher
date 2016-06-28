export default class Optionable {

  constructor(options) {

    const {optionTypes} = this.constructor;

    this.settings = {};

    this.settings = Object.assign({}, optionTypes, options);
  }
}