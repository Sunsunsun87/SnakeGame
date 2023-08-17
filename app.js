 const canvas = document.getElementById("myCanvas");
 const score = document.getElementById("myScore");
 const maxScore = document.getElementById("myScore2");
 const ctx = canvas.getContext("2d");  // ctx is a drawing context
 const unit = 20;
 const col = canvas.height / unit;
 const row = canvas.height / unit;

class Fruit {
  // generates a fruit at a random non-snake position
  constructor() {
    this.reFruit();
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.fruitX, this.fruitY, unit, unit);
  }

  // checks for snake body. If no overlapping, spawn the new fruit.
  // because snake pop / don't pop, add fruit / don't add fruit. new location 
  // is canvas - snake body.
  // thus a sequential check on the current snake body is 
  reFruit() {
    while (1) {
      let newX = Math.floor(Math.random() * col) * unit;
      let newY = Math.floor(Math.random() * col) * unit;
      let overlap = false;
      for (let i = 0; i < snake.length; i++) {  // check overlapping.
        if (newX == snake[i].x && newY == snake[i].y) {
          overlap = true;
          break;
        }
      }
      if (!overlap) {  // if non-overlap, valid, store and terminate.
        this.fruitX = newX;
        this.fruitY = newY;
        break;
      } 
    }
  }
}

// Initialize snake body: length 5 units, at row 0.
let snake = [];
for (let i = 0; i < 4; i++) {
  snake[i] = {
    x: 60 - i * 20,
    y: 0,
  };
}
// makes fruit
let fruit = new Fruit();

// listens for key press to change direction.
let dir = "R";
window.addEventListener("keydown", changeDir);

// runs the drawSnake method every 100 ms repeatedly.
let snakeGame = setInterval(drawSnake, 100);
function drawSnake() {
  // paints canvas black first.
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.height, canvas.height);

  // paints the snake array.
  for (let i = 0; i < snake.length; i++) {
    // draws the rectangular body units' insides
    i == 0 ? ctx.fillStyle = "red" : ctx.fillStyle = "lightblue";
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    // draws the rectangular body units' perimeters
    ctx.strokeStyle = "white";
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // paints fruit
  fruit.drawFruit();

  // shows score and max
  score.textContent = "Score  " + snake.length;  // score updates on each iteration of movement.
  let m = localStorage.getItem("max");  // retrieves local stored max.
  maxScore.textContent = "Max  " + Number(m);

  // updates the snake array using global direction var.
  let newHead = updateSnake();

  // check dead snake
  for (let i = 1; i < snake.length; i++) {  // snake[0] is new head, don't check on it.
    if (snake[i].x == newHead.x && snake[i].y == newHead.y) {
      // bites on self. terminate game.
      alert("Game ended. Score: " + (snake.length - 1));
      clearInterval(snakeGame);
      // updates max using score, and stores locally
      let m = localStorage.getItem("max");
      localStorage.setItem("max", Math.max(Number(m), snake.length - 1));
      return;
    }
  }

  // if eats fruit, increase length by retaining previous tail.
  if (newHead.x == fruit.fruitX && newHead.y == fruit.fruitY) {
    // if meets fruit, don't pop, and refruit.
    fruit.reFruit();
    return;
  }
  snake.pop();
}

// records keypress and map to dir
function changeDir(e) {
  if (e.key == "ArrowDown" && dir != "U") {
    dir = "D";
  } else if (e.key == "ArrowUp" && dir != "D") {
    dir = "U";
  } else if (e.key == "ArrowLeft" && dir != "R") {
    dir = "L";
  } else if (e.key == "ArrowRight" && dir != "L") {
    dir = "R";
  }
}

// updates the snake following dir direction.
function updateSnake() {
  let newX = snake[0].x;
  let newY = snake[0].y;  // retrieves snake head.
  switch(dir) {
    case "R":
      newX += unit;
      break;
    case "L":
      newX -= unit;
      break;
    case "U":
      newY -= unit;
      break;
    case "D":
      newY += unit;
      break;
  }
  newX = (newX + canvas.height) % canvas.height;
  newY = (newY + canvas.height) % canvas.height;
  let newHead = {x: newX, y: newY};
  snake.unshift(newHead);
  return newHead;
}
