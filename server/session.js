class Session {
  constructor(id) {
    this.id = id;
    this.clients = new Set;
  }

  join (client) {
    if (client.session) {
      throw new Error('this client is already connected');
    }
    this.clients.add(client);
    client.session = this;
  }

  leave (client) {
    if (client.session !== this) {
      throw new Error('this client is not connected');
    }
    this.clients.delete(client);
    client.session = null;
  }
}

module.exports = Session;
