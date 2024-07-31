const score = document.querySelector(".score");
const startBtn = document.querySelector(".startBtn");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");

startBtn.addEventListener("click", start);
gameMessage.addEventListener("click", start);
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

let keys = {};
let bird = document.createElement("div");
let wing = document.createElement("div");
let player = {
  x: 0,
  y: 0,
  speed: 3,
  score: 0,
  inplay: false,
};

let pipe = {
  startPos: 0,
  spaceBetweenRow: 0,
  spaceBetweenCol: 0,
  pipeCount: 0,
};

function start() {
  console.log("game start");
  player.inplay = true;
  player.score = 0;
  gameArea.innerHTML = "";
  gameMessage.classList.add("hide");
  startBtn.classList.add("hide");
  let bird = document.createElement("div");
  let wing = document.createElement("div");
  bird.setAttribute("class", "bird");
  wing.setAttribute("class", "wing");
  wing.pos = 15;
  wing.style.top = wing.pos + "px";
  bird.appendChild(wing);
  gameArea.appendChild(bird);
  player.x = bird.offsetLeft;
  player.y = bird.offsetTop;

  pipe.startPos = 0;
  pipe.spaceBetweenRow = 400;
  pipe.pipeCount = Math.floor(gameArea.offsetWidth / pipe.spaceBetweenRow);
  for (let i = 0; i < pipe.pipeCount; i++) {
    makePipe(pipe.startPos * pipe.spaceBetweenRow);
    pipe.startPos++;
  }

  window.requestAnimationFrame(playGame);
}

function makePipe(pipePos) {
  let totalHeight = gameArea.offsetHeight;
  let totalWidth = gameArea.offsetWidth;
  let pipeUp = document.createElement("div");
  pipeUp.classList.add("pipe");
  pipeUp.height = Math.floor(Math.random() * 350);
  pipeUp.style.height = pipeUp.height + "px";
  pipeUp.style.left = totalWidth + pipePos + "px";
  pipeUp.x = totalWidth + pipePos;
  pipeUp.style.top = "0px";
  pipeUp.style.backgroundColor = "red";

  gameArea.appendChild(pipeUp);

  pipe.spaceBetweenCol = Math.floor(Math.random() * 250) + 150;

  let pipeDown = document.createElement("div");
  pipeDown.classList.add("pipe");
  pipeDown.style.height =
    totalHeight - pipeUp.height - pipe.spaceBetweenCol + "px";
  pipeDown.style.left = totalWidth + pipePos + "px";
  pipeDown.x = totalWidth + pipePos;
  pipeDown.style.bottom = "0px";
  pipeDown.style.backgroundColor = "black";
  gameArea.appendChild(pipeDown);
}

function movePipes(bird) {
  let pipes = document.querySelectorAll(".pipe");
  let counter = 0;
  pipes.forEach(function (item) {
    item.x -= player.speed;
    item.style.left = item.x + "px";
    if (item.x < 0) {
      item.parentElement.removeChild(item);
      counter++;
    }

    if (isCollide(item, bird)) {
      console.log("충돌");
    }
  });

  for (let i = 0; i < counter / 2; i++) {
    makePipe(0);
  }
}

function isCollide(pipe, bird) {
  let pipeRect = pipe.getBoundingClientRect();
  let birdRect = bird.getBoundingClientRect();
  console.log(birdRect);
  return (
    pipeRect.bottom > birdRect.top &&
    pipeRect.top < birdRect.bottom &&
    pipeRect.left < birdRect.right &&
    pipeRect.right > birdRect.left
  );
}

function playGame() {
  if (player.inplay) {
    let bird = document.querySelector(".bird");
    let wing = document.querySelector(".wing");
    movePipes(bird);
    let move = false;
    if (keys.ArrowLeft && player.x < gameArea.offsetWidth - bird.offsetWidth) {
      player.x += player.speed;
      move = true;
    }
    if (keys.ArrowRight && player.x > 0) {
      player.x -= player.speed;
      move = true;
    }
    if (keys.ArrowUp && player.y < gameArea.offsetHeight - bird.offsetHeight) {
      player.y += player.speed;
      move = true;
    }
    if (keys.ArrowDown && player.y > 0) {
      player.y -= player.speed;
      move = true;
    }

    if (move) {
      wing.pos = wing.pos === 15 ? 25 : 15;
      wing.style.top = wing.pos + "px";
    }

    player.y += player.speed * 0.4;
    if (player.y > gameArea.offsetHeight - bird.offsetHeight) {
      console.log("game over");
      playGameOver();
    }
    bird.style.left = player.x + "px";
    bird.style.top = player.y + "px";
    window.requestAnimationFrame(playGame);
    player.score++;
    player.speed = 3 + player.score / 1000;
    score.innerText = "SCORE : " + player.score;
  }
}

function playGameOver() {
  player.inplay = false;
  gameMessage.classList.remove("hide");
  gameMessage.innerHTML =
    "GAME OVER<br/>당신의 점수는 " +
    player.score +
    "점 입니다.<br/> To Be Continue?";
}

function pressOff(e) {
  keys[e.code] = true;
}

function pressOn(e) {
  keys[e.code] = false;
}
