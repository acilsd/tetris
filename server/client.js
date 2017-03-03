/*eslint no-console: "off"*/

class Client {
  constructor(connection) {
    this.connection = connection;
    this.session = null;
  }
  send(msg) {
    console.info(`Sending message ${msg}`);
    this.connection.send(msg, (err) => {
      if (err) console.error('Sending failed', msg, err);
    });
  }
}

module.exports = Client;
