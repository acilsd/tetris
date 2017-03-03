/*eslint no-console: "off"*/

class Client {
  constructor(connection, id) {
    this.connection = connection;
    this.id = id;
    this.session = null;
    this.state = {
      arena: {
        matrix: [],
      },
      player: {
        matrix: [],
        pos: {x: 0, y: 0},
        score: 0,
      },
    };
  }

  broadcast(data) {
    if (!this.session) {
      throw new Error('No observable session available');
    }

    data.clientId = this.id;

    [...this.session.clients]
    .filter(client => client !== this)
    .forEach(client => client.send(data));
  }

  send(data) {
    const msg = JSON.stringify(data);
    this.connection.send(msg, function ack (err) {
      if (err) {
        console.error('Sending failed', msg, err);
      }      
    });
  }
}

module.exports = Client;
