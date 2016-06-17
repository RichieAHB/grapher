export default class Optionable {

  constructor(options) {

    const {optionTypes} = this.constructor;

    this.settings = {};

    for (let type in optionTypes) {
      this.settings[type] = options[type] || optionTypes[type];
    }
  }
}