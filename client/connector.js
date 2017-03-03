export default class Connector {
  constructor(game) {
    this.connection = null;
    this.peers = new Map;
    this.game = game;
    this.initGame = [...game.instances][0];
  }

  updateGame = (peers) => {
    const me = peers.you;
    const clients = peers.clients.filter(client => me !== client.id);
    clients.forEach(client => {
      if (!this.peers.has(client.id)) {
        const tetris = this.game.createPlayer();
        tetris.deserialize(client.state);
        this.peers.set(client.id, tetris);
      }
    });
    [...this.peers.entries()].forEach(([id, tetris]) => {
      if (!clients.some(client => client.id === id)) {
        this.game.removePlayer(tetris);
        this.peers.delete(id);
      }
    });
  }

  connect = (address) => {
    this.connection = new WebSocket(address);
    this.connection.addEventListener('open', () => {
      this.init();
      this.observeEvents();
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
    } else if (data.type === 'state-update') {
      this.updatePeer(data.clientId, data.fragment, data.state);
    }
  }

  observeEvents = () => {
    const initGame = this.initGame;
    const player = initGame.player;
    const arena = initGame.arena;

    ['pos', 'matrix', 'score'].forEach(type => {
      player.events.listen(type, value => {
        this.send({
          type: 'state-update',
          fragment: 'player',
          state: [type, value]
        });
      });
    });

    ['arena'].forEach(type => {
      player.events.listen(type, value => {
        this.send({
          type: 'state-update',
          fragment: 'arena',
          state: [type, value]
        });
      });
    });
  }

  updatePeer = (id, fragment, [prop, value]) => {
    if (!this.peers.has(id)) {
      console.error('no such id: ', id);
      return;
    }

    const tetris = this.peers.get(id);
    tetris[fragment][prop] = value;
    if (prop === 'score') {
      tetris.updateScore(value);
    } else {
      tetris.draw();
    }
  }

  init = () => {
    const sessionId = window.location.hash.split('#')[1];
    const state = this.initGame.serialize();
    if (sessionId) {
      this.send({
        type: 'join-session',
        id: sessionId,
        state,
      });
    } else {
      this.send({
        type: 'create-session',
        state,
      });
    }
  }
}
