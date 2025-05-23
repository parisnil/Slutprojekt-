const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameOver = false;
let score = 0;

// Fisk
const fish = {
  x: 100,
  y: 200,
  width: 40,
  height: 20,
  speed: 3,
  direction: "right",
};

// Rörning
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

// Hinder
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

  const nextInterval = 500 + Math.random() * 1000; // 1–3 sekunder
  setTimeout(createObstacle, nextInterval);
}

// Coins
let coins = [];
function createCoin() {
  const y = Math.random() * (canvas.height - 20) + 10;
  coins.push({ x: canvas.width, y, radius: 8 });
}
setInterval(createCoin, 3000);

function updateFish() {
  if (keys.ArrowUp) {
    fish.y = Math.max(fish.y - fish.speed, fish.height);
  }
  if (keys.ArrowDown) {
    fish.y = Math.min(fish.y + fish.speed, canvas.height - fish.height);
  }
  if (keys.ArrowLeft) {
    fish.x = Math.max(fish.x - fish.speed, fish.width);
    fish.direction = "left";
  }
  if (keys.ArrowRight) {
    fish.x = Math.min(fish.x + fish.speed, canvas.width - fish.width);
    fish.direction = "right";
  }
}

//Rita
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
  ctx.fillStyle = ob.color || "red"; // Om färg saknas, använd röd som reserv
  ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
}

function drawCoin(coin) {
  ctx.beginPath();
  ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
  ctx.fillStyle = "gold";
  ctx.fill();
  ctx.strokeStyle = "#ccaa00";
  ctx.stroke();
}

function collision(ob) {
  return (
    fish.x + fish.width > ob.x &&
    fish.x - fish.width < ob.x + ob.width &&
    fish.y + fish.height > ob.y &&
    fish.y - fish.height < ob.y + ob.height
  );
}

// Fisk dör
function collectCoin(coin) {
  const dx = coin.x - fish.x;
  const dy = coin.y - fish.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < coin.radius + fish.width / 2;
}

function gameEnd() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.408)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#88ddee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Hinder
  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i];
    ob.x -= 2;
    drawObstacle(ob);
    if (collision(ob)) {
      gameOver = true;
    }
  }
  obstacles = obstacles.filter((ob) => ob.x + ob.width > 0);

  // Coins
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    coin.x -= 2;
    drawCoin(coin);
    if (collectCoin(coin)) {
      coins.splice(i, 1);
      score += 1;
      i--;
    }
  }
  coins = coins.filter((c) => c.x + c.radius > 0);

  // Poäng
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Poäng: " + score, 10, 25);

  updateFish();
  drawFish();

  requestAnimationFrame(gameEnd);
}

createObstacle();
gameEnd();
