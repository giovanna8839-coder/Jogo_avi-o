const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerName = "";
let gameRunning = false;

// Player
let player = {
  x: 180,
  y: 500,
  width: 40,
  height: 40,
  speed: 5,
  life: 100,
  maxLife: 100
};

let bullets = [];
let enemies = [];
let keys = {};

// Controle de tiro
let lastShot = 0;
let shootDelay = 250;

// Controles
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Start game
function startGame() {
  const input = document.getElementById("playerName").value;

  if (input.trim() === "") {
    alert("Digite um nome!");
    return;
  }

  playerName = input;

  document.getElementById("menu").style.display = "none";
  canvas.style.display = "block";

  gameRunning = true;
  gameLoop();
}

// Atirar
function shoot() {
  bullets.push({
    x: player.x + 18,
    y: player.y,
    width: 5,
    height: 10,
    speed: 7
  });
}

// Criar inimigos
function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 40),
    y: -40,
    width: 40,
    height: 40,
    speed: 2
  });
}

// Colisão
function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// Update
function update() {
  if (!gameRunning) return;

  // Movimento
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // Limites da tela
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
  }

  // Tiro com delay
  let now = Date.now();
  if (keys[" "] && now - lastShot > shootDelay) {
    shoot();
    lastShot = now;
  }

  // Atualiza tiros
  bullets.forEach((b, i) => {
    b.y -= b.speed;
    if (b.y < 0) bullets.splice(i, 1);
  });

  // Atualiza inimigos
  enemies.forEach((e, i) => {
    e.y += e.speed;

    // Colisão com tiros
    bullets.forEach((b, bi) => {
      if (isColliding(b, e)) {
        enemies.splice(i, 1);
        bullets.splice(bi, 1);
      }
    });

    // Colisão com player
    if (isColliding(player, e)) {
      enemies.splice(i, 1);
      player.life -= 10;

      if (player.life <= 0) {
        gameRunning = false;
        alert("GAME OVER");
      }
    }
  });

  // Spawn inimigos
  if (Math.random() < 0.02) spawnEnemy();
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Barra de vida
  let lifeWidth = (player.life / player.maxLife) * player.width;

  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y - 10, player.width, 5);

  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y - 10, lifeWidth, 5);

  // Tiros
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });

  // Inimigos
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });

  // Nome do jogador
  ctx.fillStyle = "white";
  ctx.fillText("Jogador: " + playerName, 10, 20);
}

// Loop
function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();
  requestAnimationFrame(gameLoop);
}