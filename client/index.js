import styles from './helpers/style.css';
import { keys } from './helpers/keys';
import PlayerInstance from './player-creator';
import Connector from './connector';

const gameManager = new PlayerInstance(document);
const initPlayer = gameManager.createPlayer();
initPlayer.element.classList.add('local');
initPlayer.run();

const connector = new Connector(gameManager);
connector.connect('wss://' + window.location.hostname + ':8008');

const gameControls = (e) => {
  keys.forEach((key, idx) => {
    const player = initPlayer.player;

    if (event.type === 'keydown') {
      switch(e.keyCode) {
      case key[0]:
        player.move(-1);
        break;
      case key[1]:
        player.move(1);
        break;
      case key[2]:
        player.rotate(-1);
        break;
      case key[3]:
        player.rotate(1);
        break;
      }
    }

    if (event.keyCode === key[4]) {
      if (event.type === 'keydown') {
        if (player.dropInterval !== player.DROP_FAST) {
          player.drop();
          player.dropInterval = player.DROP_FAST;
        }
      } else {
        player.dropInterval = player.DROP_SLOW;
      }
    }

  });
};

document.addEventListener('keydown', gameControls);
document.addEventListener('keyup', gameControls);
