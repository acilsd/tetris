import { createMatrix, createPiece } from './helpers/create';
import { colors } from './helpers/draw';

//init canvas, draw entry state

const canvas = document.getElementById('mount');
const context = canvas.getContext('2d');

context.scale(20, 20);

const arena = createMatrix(12, 20);

const player = {
  pos: {x: 0, y: 0},
  matrix: null,
  score: 0,
};

const draw = ()  => {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);
};

//check for arena

const arenaSweep = () => {
  let rowCount = 1;
  outer: for (let y = arena.length -1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
    player.score += rowCount * 10;
    rowCount *= 2;
  }
};

//check for collisions

const collide = (arena, player) => {
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

//and megre if we have the case

const merge = (arena, player) => {
  player.matrix.map((row, y) => {
    row.map((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
};

//draw bg matrix

const drawMatrix = (matrix, offset) => {
  matrix.map((row, y) => {
    row.map((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect( x + offset.x,
                          y + offset.y,
                          1, 1);
      }
    });
  });
};

const rotate = (matrix, dir) => {
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

// NOTE: player moves
//drop teh brick

const playerDrop = () => {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter = 0;
};

const playerMove = (offset) => {
  player.pos.x += offset;
  if (collide(arena, player)) {
    player.pos.x -= offset;
  }
};

const playerReset = () => {
  const pieces = 'TJLOSZI';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
};

const playerRotate = (dir) => {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
};

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

// NOTE: main game loop

function update(time = 0) {
  const deltaTime = time - lastTime;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  lastTime = time;
  draw();
  requestAnimationFrame(update);
}

const updateScore = () => {
  document.getElementById('score').innerText = player.score;
};

document.addEventListener('keydown', e => {
  switch (e.keyCode) {
  case 37:
    playerMove(-1);
    break;
  case 39:
    playerMove(1);
    break;
  case 40:
    playerDrop();
    break;
  case 65:
    playerRotate(-1);
    break;
  case 68:
    playerRotate(1);
    break;
  }
});

playerReset();
updateScore();
update();
