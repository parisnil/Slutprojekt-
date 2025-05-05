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

 let eye;
  if (fish.direction === "right") {
    eye = 10;
  } else {
    eye = -10;
  }
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(fish.x + eye, fish.y - 5, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(fish.x + eye, fish.y - 5, 7, 0, Math.PI * 2);
  ctx.fill();
}
