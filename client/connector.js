export default class Connector {
  constructor() {
    this.connection = null;
  }

  connect = (address) => {
    this.connection = new WebSocket(address);
    this.connection.addEventListener('open', () => {
      this.connection.send('create-session');
    });
    this.connection.addEventListener('message', e => {
      console.info(`Message ${e.data} recieved`);/*eslint no-console: "off"*/
    });
  }
}
