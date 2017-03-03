/*eslint no-console: "off"*/

class Client {
  constructor(connection, id) {
    this.connection = connection;
    this.id = id;
    this.session = null;
  }

  send(data) {
    const msg = JSON.stringify(data);
    this.connection.send(msg, (err) => {
      if (err) console.error('Sending failed', msg, err);
      console.info(`Sending message ${msg}`);
    });
  }
}

module.exports = Client;
