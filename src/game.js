import { createMatrix, createPiece } from './helpers/create';
import { colors } from './helpers/colors';

export default class Tetris {
  constructor(node, score, ctx) {
    this.canvas = node;
    this.score = score;
    this.context = ctx;
    this.dropCounter = 0;
    this.dropInterval = 1000;
    this.lastTime = 0;

    this.arena = createMatrix(12, 20);
    this.player = {
      pos: {x: 0, y: 0},
      matrix: null,
      score: 0,
    };
  }

  draw = ()  => {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMatrix(this.arena, {x: 0, y: 0});
    this.drawMatrix(this.player.matrix, this.player.pos);
  };

  arenaSweep = () => {
    let rowCount = 1;
    outer: for (let y = this.arena.length -1; y > 0; --y) {
      for (let x = 0; x < this.arena[y].length; ++x) {
        if (this.arena[y][x] === 0) {
          continue outer;
        }
      }
      const row = this.arena.splice(y, 1)[0].fill(0);
      this.arena.unshift(row);
      ++y;
      this.player.score += rowCount * 10;
      rowCount *= 2;
    }
  };

  drawMatrix = (matrix, offset) => {
    matrix.map((row, y) => {
      row.map((value, x) => {
        if (value !== 0) {
          this.context.fillStyle = colors[value];
          this.context.fillRect( x + offset.x,
                                 y + offset.y,
                                 1, 1);
        }
      });
    });
  };

  collide = (arena, player) => {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 &&
           (arena[y + o.y] &&  arena[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  };

  merge = (arena, player) => {
    player.matrix.map((row, y) => {
      row.map((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  };

  rotate = (matrix, dir) => {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [
          matrix[x][y],
          matrix[y][x],
        ] = [
          matrix[y][x],
          matrix[x][y],
        ];
      }
    }

    if (dir > 0) {
      matrix.map(row => row.reverse());
    } else {
      matrix.reverse();
    }
  };

  playerDrop = () => {
    this.player.pos.y++;
    if (this.collide(this.arena, this.player)) {
      this.player.pos.y--;
      this.merge(this.arena, this.player);
      this.playerReset();
      this.arenaSweep();
      this.updateScore();
    }
    this.dropCounter = 0;
  };

  playerMove = (offset) => {
    this.player.pos.x += offset;
    if (this.collide(this.arena, this.player)) {
      this.player.pos.x -= offset;
    }
  };

  playerReset = () => {
    const pieces = 'TJLOSZI';
    this.player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    this.player.pos.y = 0;
    this.player.pos.x = (this.arena[0].length / 2 | 0) -
                     (this.player.matrix[0].length / 2 | 0);
    if (this.collide(this.arena, this.player)) {
      this.arena.forEach(row => row.fill(0));
      this.player.score = 0;
      this.updateScore();
    }
  };

  playerRotate = (dir) => {
    const pos = this.player.pos.x;
    let offset = 1;
    this.rotate(this.player.matrix, dir);
    while (this.collide(this.arena, this.player)) {
      this.player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.player.matrix[0].length) {
        this.rotate(this.player.matrix, -dir);
        this.player.pos.x = pos;
        return;
      }
    }
  };

  update = (time = 0) => {
    const deltaTime = time - this.lastTime;
    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval) {
      this.playerDrop();
    }
    this.lastTime = time;
    this.draw();
    requestAnimationFrame(this.update);
  };

  updateScore = () => {
    this.score.innerText = this.player.score;
  };

  init = () => {
    this.playerReset();
    this.updateScore();
    this.update();
  }
}
