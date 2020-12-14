import * as Game from './game.js';
import * as Engine from './engine.js';

export interface player {
    pos: { x: number, y: number };
    matrix: number[][];
    score: number;
}

export function move(arena: number[][], currPlayer: player, direction: number) {
    currPlayer.pos.x += direction;
    if (Game.collide(arena, currPlayer)) {
        currPlayer.pos.x -= direction;
    }
}

export function playerRotate(arena: number[][], currPlayer: player, direction: number) {
    const initPosition = currPlayer.pos.x;
    let offset = 1;
    rotate(currPlayer.matrix, direction);
    while (Game.collide(arena, currPlayer)) {
        currPlayer.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > currPlayer.matrix[0].length) {
            rotate(currPlayer.matrix, -direction);
            currPlayer.pos.x = initPosition;
            return;
        }
    }
}

export function drop(arena: number[][], currPlayer: player) {
    currPlayer.pos.y++;
    if (Game.collide(arena, currPlayer)) {
        currPlayer.pos.y--;
        Game.merge(arena, currPlayer);
        Game.playerReset(arena, currPlayer);
        Engine.drawNextPiece(Game.nextPiece);
        Game.scanArena(arena, currPlayer);
        Engine.updateScore(currPlayer);
        return true;
    }
    return false;
}

export function instantDrop(arena: number[][], player: player) {
    while (!drop(arena, player)) {
        player.score += 2;
        Engine.updateScore(player);
    }
}

function rotate(matrix: number[][], direction: number) {
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
