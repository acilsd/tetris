import { colors } from '../helpers/colors';
import Player from './player';
import Arena from './arena';

export default class Tetris {
  constructor(el) {
    this.element = el;
    this.canvas = el.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.context.scale(20, 20);
    this.colors = colors;

    this.arena = new Arena(12, 20);
    this.player = new Player(this);

    this.player.events.listen('score', score => {
      this.updateScore(score);
    });

    let lastTime = 0;
    this.update = (time = 0) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      this.player.update(deltaTime);
      this.draw();
      requestAnimationFrame(this.update);
    };
    this.updateScore(0);
  }

  draw = () => {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMatrix(this.arena.matrix, {x: 0, y: 0});
    this.drawMatrix(this.player.matrix, this.player.pos);
  }

  drawMatrix = (matrix, offset) =>  {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.context.fillStyle = this.colors[value];
          this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  }

  run = () => {
    this.update();
  }

  updateScore = (score) => this.element.querySelector('.score').innerText = score;

}
