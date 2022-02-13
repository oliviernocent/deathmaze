let col = 6;
let row = 4;
let mazeHeight = 2;

let scene, player, portal, maze;

function createGround(w, h) {
  let ground = document.createElement('a-plane');

  ground.classList.add('removable');

  ground.setAttribute('static-body', '');
  ground.setAttribute('position', (w / 2 - 0.5) + ' 0 ' + (h / 2 - 0.5));
  ground.setAttribute('rotation', '-90 0 0');

  ground.setAttribute('width', w);
  ground.setAttribute('height', h);

  ground.setAttribute('roughness', 1);
  ground.setAttribute('metalness', 0);
  ground.setAttribute('src', "#ground-texture");
  ground.setAttribute('repeat', w + ' ' + h);

  return ground;
}

function createCeil(w, h) {
  let ceil = document.createElement('a-plane');

  ceil.classList.add('removable');

  ceil.setAttribute('static-body', '');
  ceil.setAttribute('position', (w / 2 - 0.5) + ' ' + mazeHeight + ' ' + (h / 2 - 0.5));
  ceil.setAttribute('rotation', '90 0 0');

  ceil.setAttribute('width', w);
  ceil.setAttribute('height', h);

  ceil.setAttribute('roughness', 1);
  ceil.setAttribute('metalness', 0);
  ceil.setAttribute('src', "#ceil-texture");
  ceil.setAttribute('repeat', w + ' ' + h);

  return ceil;
}

function createBlock(x, y) {
  let block = document.createElement('a-box');

  block.classList.add('removable');

  block.setAttribute('static-body', '');
  block.setAttribute('position', x + ' ' + mazeHeight / 2 + ' ' + y);

  block.setAttribute('width', 1);
  block.setAttribute('height', mazeHeight);
  block.setAttribute('depth', 1);

  block.setAttribute('roughness', 1);
  block.setAttribute('metalness', 0);
  block.setAttribute('src', "#wall-texture");
  block.setAttribute('repeat', '1 ' + mazeHeight);

  return block;
}

function createPebble(x, y, d) {
  let pebble = document.createElement('a-box');

  pebble.classList.add('removable');

  pebble.setAttribute('position', x + ' 0.5 ' + y);

  pebble.setAttribute('width', 0.2);
  pebble.setAttribute('height', 0.2);
  pebble.setAttribute('depth', 0.2);

  pebble.setAttribute('color', '#ffff13');
  pebble.setAttribute('roughness', 1);
  pebble.setAttribute('metalness', 0);
  pebble.setAttribute('opacity', 1);

  pebble.setAttribute('animation', 'property: position; from: ' + x + ' 0.8 ' + y + '; to: ' + x + ' 1 ' + y + '; dir: alternate; dur: 500; delay: ' + d + '; easing: easeInOutQuad; loop: true');

  /*
  let light = document.createElement('a-entity');
  light.setAttribute('light', 'type: point; color: white; intensity: 0.9; distance: 0.5');
  light.setAttribute('position', '0 0 0');

  pebble.appendChild(light);
  */

  return pebble;
}

function clearMaze() {
  for (let block of scene.querySelectorAll('.removable'))
    scene.removeChild(block);
}

function generateMaze() {
  maze = new Maze(col, row);
  maze.backTracker();

  let map = new Map(maze);

  scene.appendChild(createGround(map.col, map.row));
  scene.appendChild(createCeil(map.col, map.row));

  for (let y = 0; y < map.row; y++)
    for (let x = 0; x < map.col; x++) {
      if (map.grid[y * map.col + x])
        scene.appendChild(createBlock(x, y));
    }

  portal.setAttribute('position', (map.col - 2) + ' 0.05 ' + (map.row - 2));
  player.setAttribute('position', '1 0 1');
}

function triggerSound() {
  let i = Math.floor(Math.random() * 7) + 1;
  document.querySelector('#sound' + i).play();

  let time = Math.floor(Math.random() * 20) + 30;
  window.setTimeout(triggerSound, time * 1000);
}

window.addEventListener('load', () => {
  scene = document.querySelector('a-scene');
  player = scene.querySelector('#player');
  portal = scene.querySelector('#portal');

  portal.addEventListener('click', (event) => {
    clearMaze();
    col += 3;
    row += 3;
    generateMaze();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === "h") {
      let position = player.getAttribute('position');
      let x = Math.round(Math.floor(position.x + 1) / 2);
      let y = Math.round(Math.floor(position.z + 1) / 2);
      console.log(`x: ${x}, y: ${y}`);
      let path = maze.computePathTo(x, y);

      let delay = 0;
      for (let point of path) {
        scene.appendChild(createPebble(2 * (point.x - 1) + 1, 2 * (point.y - 1) + 1, delay));
        delay += 200;
      }
    }
  });

  generateMaze();

  document.querySelector('#start span').addEventListener('click', (event) => {
    document.querySelector('.splashscreen').style.display = 'none';

    document.querySelector('#theme').play();
    window.setTimeout(triggerSound, 10000);
  });
});