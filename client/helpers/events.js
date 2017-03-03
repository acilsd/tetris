export default class Events {
  constructor() {
    this.listeners = new Set;
  }

  listen = (name, cb) => {
    this.listeners.add({
      name,
      cb
    });
  }

  emit = (name, ...data) => {
    this.listeners.forEach(listener => {
      if (listener.name === name) {
        listener.cb(...data);
      }
    });
  }
}
