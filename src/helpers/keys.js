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
