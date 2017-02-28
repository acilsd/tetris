import Tetris from './components/game';

export default class Connector {
  constructor(document) {
    this.document = document;
    this.instances = [];
    const players = Array.from(document.querySelectorAll('.player'));
    players.forEach((el) => {
      const gameInstance = new Tetris(el);
      this.instances.push(gameInstance);
    });
  }
}
