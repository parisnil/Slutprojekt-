const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver = false;
let score = 0;

const fish = {
  x: 100,
  y: 200,
  width: 40,
  height: 20,
  speed: 3,
  direction: "right",
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};
document.addEventListener("keydown", (e) => {
  if (e.key in keys) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key in keys) keys[e.key] = false;
});

let obstacles = [];

function getRandomColor() {
  const colors = ["red", "green", "blue", "purple", "orange", "pink"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function createObstacle() {
  const height = 40 + Math.random() * 50;
  const y = Math.random() * (canvas.height - height);
  const color = getRandomColor();

  obstacles.push({
    x: canvas.width,
    y,
    width: 30,
    height,
    color,
  });

  const nextInterval = 500 + Math.random() * 1000;
  setTimeout(createObstacle, nextInterval);
}

function drawFish() {
  const gradient = ctx.createLinearGradient(
    fish.x - 20,
    fish.y,
    fish.x + 20,
    fish.y
  );
  gradient.addColorStop(0, "#8400ff");
  gradient.addColorStop(1, "#ff6f00");
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(fish.x, fish.y, fish.width, fish.height, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  if (fish.direction === "right") {
    ctx.moveTo(fish.x - fish.width, fish.y);
    ctx.quadraticCurveTo(
      fish.x - fish.width - 15,
      fish.y,
      fish.x - fish.width - 5,
      fish.y - 12
    );
    ctx.lineTo(fish.x - fish.width - 5, fish.y + 12);
    ctx.quadraticCurveTo(
      fish.x - fish.width - 15,
      fish.y,
      fish.x - fish.width,
      fish.y
    );
  } else {
    ctx.moveTo(fish.x + fish.width, fish.y);
    ctx.quadraticCurveTo(
      fish.x + fish.width + 15,
      fish.y,
      fish.x + fish.width + 5,
      fish.y - 12
    );
    ctx.lineTo(fish.x + fish.width + 5, fish.y + 12);
    ctx.quadraticCurveTo(
      fish.x + fish.width + 15,
      fish.y,
      fish.x + fish.width,
      fish.y
    );
  }
  ctx.fillStyle = "#8400ff";
  ctx.fill();

  let eyeOffset = fish.direction === "right" ? 10 : -10;
  const eyeX = fish.x + eyeOffset;
  const eyeY = fish.y - 5;

  if (gameOver) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(eyeX - 7, eyeY - 7);
    ctx.lineTo(eyeX + 7, eyeY + 7);
    ctx.moveTo(eyeX + 7, eyeY - 7);
    ctx.lineTo(eyeX - 7, eyeY + 7);
    ctx.stroke();
  } else {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawObstacle(ob) {
  ctx.fillStyle = ob.color; 
  ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
}

function collision(ob) {
  return (
    fish.x + fish.width > ob.x &&
    fish.x - fish.width < ob.x + ob.width &&
    fish.y + fish.height > ob.y &&
    fish.y - fish.height < ob.y + ob.height
  );
}

for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i];
    ob.x -= 2;
    drawObstacle(ob);
    if (collision(ob)) {
      gameOver = true;
    }
  }
  obstacles = obstacles.filter((ob) => ob.x + ob.width > 0);

function gameEnd() {
  if (gameOver) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
    return;
  }
  
gameEnd();
