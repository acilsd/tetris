import Tetris from './game';
import styles from './helpers/style.css';

const canvas = document.getElementById('mount');
const score = document.getElementById('score');
const context = canvas.getContext('2d');

context.scale(20, 20);

const newGame = new Tetris(canvas, score, context);

newGame.init();

document.addEventListener('keydown', e => {
  switch (e.keyCode) {
  case 37:
    newGame.playerMove(-1);
    break;
  case 39:
    newGame.playerMove(1);
    break;
  case 40:
    newGame.playerDrop();
    break;
  case 65:
    newGame.playerRotate(-1);
    break;
  case 68:
    newGame.playerRotate(1);
    break;
  }
});
