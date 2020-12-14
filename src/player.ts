import * as Game from './game.js';
import * as Engine from './engine.js';

export function move(arena, player, direction) {
    player.pos.x += direction;
    if (Game.collide(arena, player)) {
        player.pos.x -= direction;
    }
}

export function playerRotate(arena, player, direction) {
    const initPosition = player.pos.x;
    let offset = 1;
    rotate(player.matrix, direction);
    while (Game.collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -direction);
            player.pos.x = initPosition;
            return;
        }
    }
}

export function drop(arena, player) {
    player.pos.y++;
    if (Game.collide(arena, player)) {
        player.pos.y--;
        Game.merge(arena, player);
        Game.playerReset(arena, player);
        Engine.drawNextPiece(Game.nextPiece);
        Game.scanArena(arena, player);
        Engine.updateScore(player);
        return true;
    }
    return false;
}

export function instantDrop(arena, player) {
    while (!drop(arena, player)) {
        player.score += 2;
        Engine.updateScore(player);
    }
}

function rotate(matrix, direction) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [matrix[x][y], matrix[y][x]]
                = [matrix[y][x], matrix[x][y]]
        }
    }

    if (direction > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}
