import * as Player from "./player.ts";
import * as Game from "./game.ts";
import * as Engine from "./engine.ts";

import Plausible from "plausible-tracker";
const plausible = Plausible({
  domain: "tetromino.verybadfrags.com",
  apiHost: "/ps",
  hashMode: false,
});
plausible.trackPageview();

const player: Player.Player = {
  pos: { x: 0, y: 0 },
  matrix: [],
  score: 0,
};

function createMatrix(w: number, h: number): number[][] {
  const matrix = [];
  let counter = h;
  while (counter > 0) {
    matrix.push(new Array(w).fill(0));
    counter--;
  }
  return matrix;
}

const arena = createMatrix(12, 20);

const dropInterval = 1000;
const dropShortInterval = 70;

let dropTimer = 0;
let fastDrop = false;
let lastTime = 0;
function update(time = 0): void {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropTimer += deltaTime;
  const interval = fastDrop ? dropShortInterval : dropInterval;
  if (dropTimer > interval) {
    Player.drop(arena, player);
    dropTimer %= interval;
    if (fastDrop) {
      player.score++;
      Engine.updateScore(player);
    }
  }

  const shadow = Game.generateShadow(arena, player);
  Engine.draw(arena, player, shadow);
  requestAnimationFrame(update);
}

const controlsQwerty = {
  left: ["ArrowLeft".toUpperCase(), "A"],
  right: ["ArrowRight".toUpperCase(), "D"],
  down: ["ArrowDown".toUpperCase(), "S"],
  up: ["ArrowUp".toUpperCase(), "W"],
  rotateLeft: ["Q"],
  rotateRight: ["E"],
};
const controlsAzerty = {
  left: ["ArrowLeft".toUpperCase(), "Q"],
  right: ["ArrowRight".toUpperCase(), "D"],
  down: ["ArrowDown".toUpperCase(), "S"],
  up: ["ArrowUp".toUpperCase(), "Z"],
  rotateLeft: ["A"],
  rotateRight: ["E"],
};
let controls = controlsQwerty;

document.getElementById("azerty")?.addEventListener("click", () => {
  controls = controlsAzerty;
  updateControls();
});

function updateControls(): void {
  const controlsLeft = document.getElementById("controlsLeft");
  if (controlsLeft != null) controlsLeft.textContent = controls.left.join(", ");
  const controlsRight = document.getElementById("controlsRight");
  if (controlsRight != null) {
    controlsRight.textContent = controls.right.join(", ");
  }
  const controlsUp = document.getElementById("controlsUp");
  if (controlsUp != null) controlsUp.textContent = controls.up.join(", ");
  const controlsDown = document.getElementById("controlsDown");
  if (controlsDown != null) controlsDown.textContent = controls.down.join(", ");
  const controlsRLeft = document.getElementById("controlsRLeft");
  if (controlsRLeft != null) {
    controlsRLeft.textContent = controls.rotateLeft.join(", ");
  }
  const controlsRRight = document.getElementById("controlsRRight");
  if (controlsRRight != null) {
    controlsRRight.textContent = controls.rotateRight.join(", ");
  }
}
updateControls();

document.addEventListener("keydown", (event) => {
  const keyUpper = event.key.toUpperCase();
  if (controls.left.includes(keyUpper)) {
    Player.move(arena, player, -1);
  } else if (controls.right.includes(keyUpper)) {
    Player.move(arena, player, 1);
  } else if (controls.down.includes(keyUpper)) {
    fastDrop = true;
  } else if (controls.rotateLeft.includes(keyUpper)) {
    Player.playerRotate(arena, player, -1);
  } else if (controls.rotateRight.includes(keyUpper)) {
    Player.playerRotate(arena, player, 1);
  } else if (controls.up.includes(keyUpper)) {
    Player.instantDrop(arena, player);
  } else {
    return true;
  }
  event.preventDefault();
  return false;
});

document.addEventListener("keyup", (event) => {
  const keyUpper = event.key.toUpperCase();
  if (controls.down.includes(keyUpper)) {
    fastDrop = false;
  }
  event.preventDefault();
  return false;
});

Game.playerReset(arena, player);
Engine.drawNextPiece(Game.nextPiece);
Engine.updateScore(player);
update();
