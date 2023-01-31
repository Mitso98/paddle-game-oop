// Project setup
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// style canvas
canvas.width = 1024;
canvas.height = 576;

//////////////////////////////////////////////////////////////////
// create objects
const paddle = new Paddle({
  position: {
    x: canvas.width / 2 - GameManager.paddleWidth * 0.5,
    y: canvas.height - 50,
  },
});

const ball = new Ball({
  position: {
    x: canvas.width / 2,
    y: canvas.height - 60,
  },
  velocity: { x: 0, y: 0 },
});

// Create arr of bricks objects
GameManager.createStar();

///////////////////////////////////////////////////////////////
// controllers

const keyPressed = {
  a: false,
  w: false,
  d: false,
  s: false,
};

let lastKey;

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
    case "ArrowRight":
      lastKey = "d";
      keyPressed.d = true;
      break;
    case "a":
    case "ArrowLeft":
      lastKey = "a";
      keyPressed.a = true;
      break;
    case " ":
      GameManager.startGame(ball);
      break;
    default:
      break;
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
    case "ArrowRight":
      keyPressed.d = false;
      break;
    case "a":
    case "ArrowLeft":
      keyPressed.a = false;
      break;
    default:
      break;
  }
});

/////////////////////////////////////////////////////////////////////////////
// Animation

function animate() {
  const animationId = window.requestAnimationFrame(animate);

  // draw canvas
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // draw
  for (let i = 0; i < GameManager.bricksArr.length; i++) {
    GameManager.bricksArr[i].draw();
  }

  c.fillStyle = "white";
  paddle.update();
  ball.update();

  // detect win
  if (!GameManager.bricksArr.length) {
    GameManager.won = true;
    GameManager.endGame();
  }
  // check if brick was hit
  for (let i = 0; i < GameManager.bricksArr.length; i++) {
    if (GameManager.bricksArr[i].isHit(ball)) {
      GameManager.bricksArr.splice(i, 1);
    }
  }

  // add velocity only when conditions are met
  paddle.velocity.x = 0;

  if (
    keyPressed.d &&
    lastKey === "d" &&
    paddle.position.x + paddle.width < canvas.width
  ) {
    paddle.velocity.x = ball.maxSpeed * 0.7;
  } else if (keyPressed.a && lastKey === "a" && paddle.position.x > 0) {
    paddle.velocity.x = ball.maxSpeed * 0.7 * -1;
  }
  // move the ball a long with the paddle if game not started
  if (!GameManager.gameStarted) {
    ball.velocity.x = paddle.velocity.x;
  }

  paddle.detectObject(ball, animationId);
}

animate();
