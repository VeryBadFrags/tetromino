import * as Player from './player.js';
import * as Game from './game.js';
import * as Engine from './engine.js';

const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

const arena = createMatrix(12, 20);

let dropTimer = 0;
let dropInterval = 1000;
let dropShortInterval = 70;
let fastDrop = false;
let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropTimer += deltaTime;
    let interval = fastDrop ? dropShortInterval : dropInterval;
    if (dropTimer > interval) {
        Player.drop(arena, player);
        dropTimer %= interval;
        if (fastDrop) {
            player.score++;
            Engine.updateScore(player);
        }
    }

    let shadow = Game.generateShadow(arena, player);
    Engine.draw(arena, player, shadow);
    requestAnimationFrame(update);
}

const controlsQwerty = {
    left: ['ArrowLeft'.toUpperCase(), 'A'],
    right: ['ArrowRight'.toUpperCase(), 'D'],
    down: ['ArrowDown'.toUpperCase(), 'S'],
    up: ['ArrowUp'.toUpperCase(), 'W'],
    rotateLeft: ['Q'],
    rotateRight: ['E'],
}
const controlsAzerty = {
    left: ['ArrowLeft'.toUpperCase(), 'Q'],
    right: ['ArrowRight'.toUpperCase(), 'D'],
    down: ['ArrowDown'.toUpperCase(), 'S'],
    up: ['ArrowUp'.toUpperCase(), 'Z'],
    rotateLeft: ['A'],
    rotateRight: ['E'],
}
let controls = controlsQwerty;

document.getElementById('azerty').addEventListener('click', () => {
    controls = controlsAzerty;
    updateControls();
});

function updateControls() {
    document.getElementById('controlsLeft').innerText = controls.left.join(', ');
    document.getElementById('controlsRight').innerText = controls.right.join(', ');
    document.getElementById('controlsUp').innerText = controls.up.join(', ');
    document.getElementById('controlsDown').innerText = controls.down.join(', ');
    document.getElementById('controlsRLeft').innerText = controls.rotateLeft.join(', ');
    document.getElementById('controlsRRight').innerText = controls.rotateRight.join(', ');
}
updateControls();

document.addEventListener('keydown', event => {
    let keyUpper = event.key.toUpperCase();
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

document.addEventListener('keyup', event => {
    let keyUpper = event.key.toUpperCase();
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
