export default class EventEmitter {

  constructor() {
    this.events = {};
  }

  listen(name, listener) {
    this.events[name] = this.events[name] || [];
    this.events[name].push(listener);
  }

  trigger(name, args = [], _this = null) {
    (this.events[name] || []).forEach(listener => {
      listener.apply(_this, args);
    });
  }
}