export default class Connector {
  constructor() {
    this.connection = null;
  }

  connect = (address) => {
    this.connection = new WebSocket(address);
  }
}
