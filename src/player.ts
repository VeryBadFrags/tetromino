import * as Game from "./game.ts";
import * as Engine from "./engine.ts";

export interface Player {
  pos: { x: number; y: number };
  matrix: number[][];
  score: number;
}

export interface GamePiece {
  pos: { x: number; y: number };
  matrix: number[][];
}

export function move(
  arena: number[][],
  currPlayer: Player,
  direction: number
): void {
  currPlayer.pos.x += direction;
  if (Game.collide(arena, currPlayer)) {
    currPlayer.pos.x -= direction;
  }
}

export function playerRotate(
  arena: number[][],
  currPlayer: Player,
  direction: number
): void {
  const initPosition = currPlayer.pos.x;
  let offset = 1;
  currPlayer.matrix = rotate(currPlayer.matrix, direction);
  while (Game.collide(arena, currPlayer)) {
    currPlayer.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > currPlayer.matrix[0].length) {
      currPlayer.matrix = rotate(currPlayer.matrix, -direction);
      currPlayer.pos.x = initPosition;
      return;
    }
  }
}

export function drop(arena: number[][], currPlayer: Player): boolean {
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

export function instantDrop(arena: number[][], player: Player): void {
  while (!drop(arena, player)) {
    player.score += 2;
    Engine.updateScore(player);
  }
}

function rotate(matrix: number[][], direction: number): number[][] {
  const newMatrix: number[][] = [];

  if (direction > 0) {
    for (let y = 0; y < matrix[0].length; y++) {
      const row: number[] = [];
      for (let x = matrix.length - 1; x >= 0; x--) {
        row.push(matrix[x][y]);
      }
      newMatrix.push(row);
    }
  } else {
    for (let y = matrix[0].length - 1; y >= 0; y--) {
      const row: number[] = [];
      for (let x = 0; x < matrix.length; x++) {
        row.push(matrix[x][y]);
      }
      newMatrix.push(row);
    }
  }

  return newMatrix;
}
