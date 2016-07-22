export default class EventEmitter {

  constructor() {
    this.events = {};
  }

  listen(name, listener, priority = 0) {
    this.events[name] = this.events[name] || [];
    this.events[name].push({
      listener,
      priority,
    });
    this.events[name].sort((a, b) => b.priority - a.priority);
  }

  trigger(name, args = [], _this = null) {
    (this.events[name] || []).forEach(({ listener }) => {
      listener.apply(_this, args);
    });
  }
}