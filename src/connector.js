import Tetris from './components/game';

export default class Connector {
  constructor(document) {
    this.document = document;
    this.instances = new Set;
    this.template = document.getElementById('mount');    
  }

  createPlayer = () => {
    const element = this.document
                    .importNode(this.template.content, true)
                    .children[0];
    const gameInstance = new Tetris(element);
    this.instances.add(gameInstance);
    this.document.body.appendChild(gameInstance.element);
    return gameInstance;
  }

  removePlayer = (player) => {
    this.instances.delete(player);
    this.document.body.removeChild(player.element);
  }
}
