export default class Connector {
  constructor(game) {
    this.connection = null;
    this.peers = new Map;
    this.game = game;
    this.initGame = [...game.instances][0];
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

    ['pos', 'matrix', 'score'].forEach(key => {
      player.events.listen(key, () => {
        this.send({
          type: 'state-update',
          fragment: 'player',
          state: [key, player[key]],
        });
      });
    });

    const arena = initGame.arena;

    ['matrix'].forEach(key => {
      arena.events.listen(key, () => {
        this.send({
          type: 'state-update',
          fragment: 'arena',
          state: [key, arena[key]],
        });
      });
    });
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

  updatePeer = (id, fragment, [key, value]) => {
    if (!this.peers.has(id)) {
      console.error('no such id: ', id);
      return;
    }
    const tetris = this.peers.get(id);
    tetris[fragment][key] = value;
    if (key === 'score') {
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
