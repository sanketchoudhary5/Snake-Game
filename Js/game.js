// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Main Game Functions
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
  return false;
}

function gameEngine() {
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    alert('Game Over. Press any key to play again!');
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 13, y: 15 }];
    musicSound.play();
    score = 0;
    scoreBox.innerHTML = 'Score: ' + score;
    return;
  }

  // Food Eaten
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem('hiscore', JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = 'HiScore: ' + hiscoreval;
    }
    scoreBox.innerHTML = 'Score: ' + score;
    snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
    food = { x: Math.round(2 + 14 * Math.random()), y: Math.round(2 + 14 * Math.random()) };
  }

  // Move Snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Render Snake and Food
  board.innerHTML = '';
  snakeArr.forEach((e, index) => {
    let snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    snakeElement.classList.add(index === 0 ? 'head' : 'snake');
    board.appendChild(snakeElement);
  });

  let foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  board.appendChild(foodElement);
}

// Main Logic
musicSound.play();
let hiscore = localStorage.getItem('hiscore');
let hiscoreval = hiscore === null ? 0 : JSON.parse(hiscore);
hiscoreBox.innerHTML = 'HiScore: ' + hiscoreval;

window.requestAnimationFrame(main);
window.addEventListener('keydown', (e) => {
  moveSound.play();
  switch (e.key) {
    case 'ArrowUp':
      inputDir = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      inputDir = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      inputDir = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      inputDir = { x: 1, y: 0 };
      break;
  }
});
