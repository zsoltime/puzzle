'use strict';

function Game() {
  const dom = {};
  const touch = {
    start: {
      x: null,
      y: null
    },
    end: {
      x: null,
      y: null
    }
  };
  let moves = 0;
  let size = 15;
  let tiles = [];

  function init() {
    cacheDom();
    bindEvents();
    addTiles();
    shuffleTiles();
    render();
    getFreePosition();
  }

  function cacheDom() {
    dom.game = document.getElementById('game');
    dom.tiles = document.getElementsByTagName('li');
    dom.moves = document.getElementById('moves');
  }

  function bindEvents() {
    document.addEventListener('keydown', moveTile);
    document.addEventListener('touchstart', touchStart);
    document.addEventListener('touchmove', moveTile);
  }

  function render() {
    for (let i = 0; i < dom.tiles.length; i++) {
      dom.tiles[i].classList = '';
      dom.tiles[i].classList.add('tile-' + tiles[i].pos());
    }
    dom.moves.textContent = moves;
    if(checkTiles() && moves > 0) {
      console.log('WIN');
    }
  }

  function touchStart(event) {
    touch.start.x = event.touches[0].clientX;
    touch.start.y = event.touches[0].clientY;
  }

  function getTouchDirection(event) {
    let xDiff;
    let yDiff;
    let direction;

    if (!touch.start.x || !touch.start.y) {
        return;
    }

    touch.end = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    }

    xDiff = touch.start.x - touch.end.x;
    yDiff = touch.start.y - touch.end.y;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      direction = xDiff > 0 ? 'left' : 'right';
    }
    else {
      direction = yDiff > 0 ? 'up' : 'down';
    }
    touch.start.x = null;
    touch.start.y = null;
    return direction;
  }

  function addTiles() {
    for (let i = 0; i < size; i++) {
      tiles.push(Tile(i));
    }
  }

  function getFreePosition() {
    const expected = size * (size + 1) / 2;
    let missing;
    let sum = 0;
    for (let i = 0; i < tiles.length; i++) {
      sum += tiles[i].pos();
    }
    missing = expected - sum;
    return missing;
  }

  function shuffleTiles() {
    let positions = [...Array(size).keys()];
    let newPositions = shuffle(positions);
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].move(newPositions[i]);
    }
  }

  function moveTile(event) {
    if (event.which > 40 || (event.which < 37 && event.which !== 0)) {
      return;
    }
    let touchDirection = getTouchDirection(event);
    const where = getFreePosition();
    let pos;
    // move up
    if (event.which === 38 || touchDirection === 'up') {
      pos = where + (Math.sqrt(size + 1));
      if (pos > size || pos < 0) {
        pos = undefined;
      }
    }
    // move right
    else if (event.which === 39 || touchDirection === 'right') {
      pos = where - 1;
      if (pos < 0 || pos % Math.sqrt(size + 1) === Math.sqrt(size + 1) - 1) {
        pos = undefined;
      }
    }
    // move down
    else if (event.which === 40 || touchDirection === 'down') {
      pos = where - (Math.sqrt(size + 1));
      if (pos > size || pos < 0) {
        pos = undefined;
      }
    }
    // move left
    else if (event.which === 37 || touchDirection === 'left') {
      pos = where + 1;
      if (pos > size || pos % Math.sqrt(size + 1) === 0) {
        pos = undefined;
      }
    }
    if (pos !== undefined) {
      moves += 1;
    }

    for (let i = 0; i < tiles.length; i++) {
      if (pos === tiles[i].pos()) {
        tiles[i].move(where);
      }
    }

    render();
  }

  function checkTiles() {
    for (let i = 0; i < tiles.length; i++) {
      if (i !== tiles[i].pos()) {
        return false;
      }
    }
    return true;
  }

  function shuffle(array) {
    let i = array.length;
    let temp;
    let random;
    while (i !== 0) {
      random = Math.floor(Math.random() * i);
      i -= 1;
      temp = array[i];
      array[i] = array[random];
      array[random] = temp;
    }
    return array;
  }

  return {
    init
  }
}

function Tile(pos) {
  let idx = pos;
  const value = pos;

  function move(pos) {
    idx = pos;
  }

  return {
    pos: _ => idx,
    move
  }
}

document.addEventListener('DOMContentLoaded', function(e) {
  const game = Game();
  game.init();
});
