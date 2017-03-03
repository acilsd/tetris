export default class Connector {
  constructor(game) {
    this.connection = null;
    this.peers = new Map;
    this.game = game;
  }

  updateGame = (peers) => {
    const me = peers.you;
    const clients = peers.clients.filter((id) => id !== me);
    clients.forEach(id => {
      if (!this.peers.has(id)) {
        const tetris = this.game.createPlayer();
        this.peers.set(id, tetris);
      }
    });
    [...this.peers.entries()].forEach(([id, tetris]) => {
      if (clients.indexOf(id) === -1) {
        this.game.removePlayer(tetris);
        this.peers.delete(id);
      }
    });
  }

  connect = (address) => {
    this.connection = new WebSocket(address);
    this.connection.addEventListener('open', () => {
      this.init();
    });
    this.connection.addEventListener('message', e => {
      console.info(`Message ${e.data} recieved`);/*eslint no-console: "off"*/
      this.recieve(e.data);
    });
  }

  send = (data) => {
    const msg = JSON.stringify(data);
    this.connection.send(msg);
  }

  recieve = (msg) => {
    const data = JSON.parse(msg);
    if (data.type === 'session-created') {
      window.location.hash = data.id;
    } else if (data.type === 'session-broadcast') {
      this.updateGame(data.peers);
    }
  }

  init = () => {
    const sessionId = window.location.hash.split('#')[1];
    if (sessionId) {
      this.send({
        type: 'join-session',
        id: sessionId
      });
    } else {
      this.send({
        type: 'create-session'
      });
    }
  }
}
