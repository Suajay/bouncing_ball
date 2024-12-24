// Setup canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Function to generate a random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

//start here
class Shape {
  constructor(x, y, velx, vely) {
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
  }
}


class Ball extends Shape {
  constructor(x, y, velx, vely, color, size) {
    super(x, y, velx, vely);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width || this.x - this.size <= 0) {
      this.velx = -this.velx;
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
      this.vely = -this.vely;
    }
    this.x += this.velx;
    this.y += this.vely;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// Class for EvilCircle
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 10;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velx;
          break;
        case "d":
          this.x += this.velx;
          break;
        case "w":
          this.y -= this.vely;
          break;
        case "s":
          this.y += this.vely;
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if(this.x + this.size >= width){
      this.velx = -Math.abs(this.velx);
    }
    
    if(this.x - this.size <= 0){
      this.velx = Math.abs(this.velx);
    }

    if(this.y + this.size >= height){
      this.vely = -Math.abs(this.vely);
    }

    if(this.y - this.size <= 0){
      this.vely = Math.abs(this.vely);
    }
  }


  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          ballCount--;
          ballCountDisplay.textContent = ballCount;
        }
      }
    }
  }
}


const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(size, width - size),
    random(size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
}


const ballCountDisplay = document.getElementById("ballCount");
let ballCount = balls.length;
ballCountDisplay.textContent = ballCount;


const evilCircle = new EvilCircle(width / 2, height / 2);


function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

loop(); 