import styles from './helpers/style.css';
import Tetris from './components/game';
import { keys } from './helpers/keys';

const gameField = [];
const players = Array.from(document.querySelectorAll('.player'));

players.forEach((el) => {
  const gameInstance = new Tetris(el);
  gameField.push(gameInstance);
});

//console.log(gameField);
const gameControls = (e) => {
  keys.forEach((key, idx) => {
    const player = gameField[idx].player;

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
