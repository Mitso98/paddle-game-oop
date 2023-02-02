// Abstract class
class GameManager {
  static gameStarted = false;
  static score = 0;
  static level;
  static gameMode;
  static paddleWidth = 150;
  static paddleHieght = 20;
  static brickWidth = 75;
  static brickHeight = 20;
  static bricksArr = [];
  static maxSpeed = 15;
  static won = false;

  // return: array of Bricks objects
  static createStar() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 6; j++) {
        const random = Math.floor(Math.random() * 3 + 1);

        GameManager.bricksArr.push(
          new Bricks({
            position: {
              x: (GameManager.brickWidth + 50) * (j + 1),
              y: (GameManager.brickHeight + 50) * (i + 1),
            },
            width: GameManager.brickWidth,
            height: GameManager.brickHeight,
            hitCount: random,
          })
        );
      }
    }
    return GameManager.bricksArr;
  }
  static startGame(ball) {
    if (!GameManager.gameStarted) {
      GameManager.gameStarted = true;
      ball.position.y -= -10;
    }
  }
  static endGame(animationID) {
    GameManager.gameStarted = false;

    window.cancelAnimationFrame(animationID);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    // declare the score
    const getScore = document.getElementById("score");
    getScore.style.color = "white";

    if (GameManager.won) {
      getScore.innerHTML = `<h1>Congratualtions your score is ${GameManager.score}</h1><h1>Press r to restart</h1>`;
    } else {
      getScore.innerHTML = `<h1>Score is ${GameManager.score}</h1><h1>Press r to restart</h1>`;
    }

    this.restartGame();
  }
  static restartGame() {
    // restart game
    window.addEventListener("keydown", (e) => {
      if (e.key == "r" && !GameManager.gameStarted) {
        location.reload();
      }
    });
  }
}

// Abstract class
class Sprite {
  constructor({
    position = { x: 0, y: 0 },
    velocity = { x: 0, y: 0 },
    width = GameManager.paddleWidth,
    height = GameManager.paddleHieght,
  }) {
    this.position = position;
    this.velocity = velocity;
    this.width = width;
    this.height = height;
  }
  draw() {
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Paddle extends Sprite {
  constructor({ position, velocity, width, height }) {
    super({ position, velocity, width, height });
  }
  detectObject(ball, animationID) {
    // detect ball
    if (
      ball.position.x >= this.position.x &&
      ball.position.x <= this.position.x + this.width &&
      this.position.y <= ball.position.y
    ) {
      this.determineAngelForPaddel(ball);
      ball.reverseBallDirction();
    }
    //detect boundries could be added to ball class
    else if (
      ball.position.y <= 0 ||
      ball.position.x <= 0 ||
      ball.position.x >= canvas.width
    ) {
      // I will reverse direction inside this function
      // as I need to customise this
      this.determineAngelForBoundries(ball);
    } else if (ball.position.y > this.position.y) {
      //TODO: implement game over function
      GameManager.endGame(animationID);
      return true;
    }
  }
  // will be called by detectObject
  determineAngelForPaddel(ball) {
    // paddle width is 150
    // sides 1 2 3 4 5 6
    // when the ball hit side  (1)
    // 0 to 25
    if (
      ball.position.x >= this.position.x &&
      ball.position.x <= this.position.x + this.width / 6
    ) {
      ball.hitBy = "side1";
      ball.velocity.x = ball.maxSpeed * 0.8;
      ball.velocity.y = ball.maxSpeed * 0.2;
    }
    // when the ball hit side (2)
    // 26 to 50
    else if (
      ball.position.x >= this.position.x + this.width / 6 + 1 &&
      ball.position.x <= this.position.x + (this.width / 6) * 2
    ) {
      ball.hitBy = "side2";
      ball.velocity.x = ball.maxSpeed * 0.6;
      ball.velocity.y = ball.maxSpeed * 0.4;
    }
    // when the ball hit side (3)
    // 51 to 75
    else if (
      ball.position.x >= this.position.x + (this.width / 6) * 2 + 1 &&
      ball.position.x <= this.position.x + (this.width / 6) * 3
    ) {
      ball.hitBy = "side3";
      ball.velocity.y = ball.maxSpeed / 2;
      ball.velocity.x = 2;
    }
    // when the ball hit side (4)
    // 76 to 100
    else if (
      ball.position.x >= this.position.x + (this.width / 6) * 3 + 1 &&
      ball.position.x <= this.position.x + (this.width / 6) * 4
    ) {
      ball.hitBy = "side4";
      ball.velocity.x = ball.maxSpeed * 0.45 * -1;
      ball.velocity.y = ball.maxSpeed * 0.55;
    }
    // when the ball hit side (5)
    // 101 to 125
    else if (
      ball.position.x >= this.position.x + (this.width / 6) * 4 + 1 &&
      ball.position.x <= this.position.x + (this.width / 6) * 5
    ) {
      ball.hitBy = "side5";
      ball.velocity.x = ball.maxSpeed * 0.7 * -1;
      ball.velocity.y = ball.maxSpeed * 0.3;
    }
    // when the ball hit side (6)
    // 126 to 150
    else if (
      ball.position.x >= this.position.x + (this.width / 6) * 5 + 1 &&
      ball.position.x <= this.position.x + (this.width / 6) * 6
    ) {
      ball.hitBy = "side6";
      ball.velocity.x = ball.maxSpeed * 0.8 * -1;
      ball.velocity.y = ball.maxSpeed * 0.2;
    }
  }
  //TODO:
  determineAngelForBoundries(ball) {
    if (ball.position.x <= 0) {
      switch (ball.hitBy) {
        case "top":
          ball.velocity.x *= -1;
          break;
        case "right":
          ball.velocity.x *= -1;
          break;

        default:
          ball.velocity.x *= -1;

          break;
      }
      ball.hitBy = "left";
    } else if (ball.position.x >= canvas.width) {
      switch (ball.hitBy) {
        case "top":
          ball.velocity.x *= -1;
          break;

        case "left":
          ball.velocity.x *= -1;
          break;

        default:
          ball.velocity.x *= -1;
          break;
      }
      ball.hitBy = "right";
    } else if (ball.position.y <= 0) {
      console.log(ball.hitBy);
      console.log(ball.velocity.x, ball.velocity.y);
      switch (ball.hitBy) {
        // when the ball touches the 90 degree
        // it touches both right and top
        // this condition "top" fix that
        case "top":
          ball.velocity.x *= -1;
          break;
        case "right":
          ball.velocity.y *= -1;
          break;
        case "left":
          ball.velocity.y *= -1;
          break;
        case "side1":
        case "side2":
          ball.velocity.x *= -1;
          break;
        case "side3":
        case "side4":
        case "side5":
        case "side6":
          ball.velocity.y *= -1;
          break;
        default:
          ball.velocity.y *= -1;
          break;
      }
      ball.hitBy = "top";
    }
  }
}

class Ball extends Sprite {
  constructor({
    position,
    velocity,
    angel = 0,
    radius = 10,
    maxSpeed = GameManager.maxSpeed,
    hitBy = "none",
  }) {
    super({ position, velocity });
    this.angel = angel;
    this.radius = radius;
    this.direction = 1; // will be either 1 or -1, down or up
    this.maxSpeed = maxSpeed;
    this.hitBy = hitBy;
  }
  reverseBallDirction() {
    if (this.hitBy === "paddle") this.direction = 1;
    else this.direction = -1;
  }
  draw() {
    c.fillStyle = "white";
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    c.fill();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x * this.direction;
    this.position.y += this.velocity.y * this.direction;
  }
}

class Bricks extends Sprite {
  static counter = 0;
  constructor({ position, width, height, hitCount }) {
    super({ position, width, height });
    this.counter = Bricks.counter;
    this.hitCount = hitCount;
    switch (this.hitCount) {
      case 3:
        this.color = "red";
        break;
      case 2:
        this.color = "yellow";
        break;
      case 1:
        this.color = "green";
        break;

      default:
        break;
    }
    Bricks.counter++;
  }
  isHit(ball) {
    if (
      ball.position.x + ball.radius >= this.position.x &&
      ball.position.x + ball.radius <= this.position.x + this.width &&
      ball.position.y + ball.radius >= this.position.y &&
      ball.position.y <= this.position.y + this.height
    ) {
      // prevent brick from hitting it self
      if (this.counter == ball.hitBy) {
        //ball.velocity.y *= -1;
        ball.velocity.x *= -1;
        return false;
      }

      ball.hitBy = this.counter;

      if (
        ball.position.x + ball.radius < this.position.x ||
        ball.position.x + ball.radius > this.position.x + this.width
      ) {
        // left & right side
        ball.velocity.x *= -1;
      } else {
        ball.velocity.y *= -1;
      }

      // switch bricks color
      if (this.hitCount === 1) {
        GameManager.score++;
        return true;
      } else {
        this.hitCount--;
        switch (this.hitCount) {
          case 2:
            this.color = "yellow";
            break;
          case 1:
            this.color = "green";
            break;
          default:
            break;
        }
      }
    }

    return false;
  }

  draw() {
    c.beginPath();
    c.lineWidth = "2";
    c.strokeStyle = this.color;
    c.rect(this.position.x, this.position.y, this.width, this.height);
    c.stroke();
  }
}
