/*eslint no-console: "off"*/

class Client {
  constructor(connection, id) {
    this.connection = connection;
    this.id = id;
    this.session = null;
    this.state = null;
  }

  broadcast(data) {
    if (!this.session) throw new Error('No observable session available');
    data.clientId = this.id;
    this.session.clients.forEach(client => {
      if (this === client) return;
      client.send(data);
    });
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
