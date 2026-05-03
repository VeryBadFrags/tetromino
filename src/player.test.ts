import { vi, describe, it, expect } from "vitest";
import type { Player } from "./player.ts";

// engine.ts touches the DOM at import time, so mock it before importing player.ts
vi.mock("./engine.ts", () => ({
  draw: vi.fn(),
  drawShadow: vi.fn(),
  drawNextPiece: vi.fn(),
  updateScore: vi.fn(),
}));

// game.ts uses module-level nextPiece state; mock playerReset to avoid that
vi.mock("./game.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./game.ts")>();
  return {
    ...actual,
    playerReset: vi.fn(),
  };
});

const { move, playerRotate } = await import("./player.ts");

function makeArena(width: number, height: number): number[][] {
  return Array.from({ length: height }, () => new Array(width).fill(0));
}

function makePlayer(matrix: number[][], x = 0, y = 0): Player {
  return { pos: { x, y }, matrix, score: 0 };
}

// ─── move ────────────────────────────────────────────────────────────────────

describe("move", () => {
  it("moves the player right in open space", () => {
    const arena = makeArena(10, 20);
    const player = makePlayer([[1]], 3, 0);
    move(arena, player, 1);
    expect(player.pos.x).toBe(4);
  });

  it("moves the player left in open space", () => {
    const arena = makeArena(10, 20);
    const player = makePlayer([[1]], 3, 0);
    move(arena, player, -1);
    expect(player.pos.x).toBe(2);
  });

  it("does not move past the right wall", () => {
    const arena = makeArena(5, 10);
    const player = makePlayer([[1]], 4, 0);
    move(arena, player, 1);
    expect(player.pos.x).toBe(4);
  });

  it("does not move past the left wall", () => {
    const arena = makeArena(5, 10);
    const player = makePlayer([[1]], 0, 0);
    move(arena, player, -1);
    expect(player.pos.x).toBe(0);
  });

  it("does not move into a filled cell", () => {
    const arena = makeArena(10, 10);
    arena[0][5] = 1;
    const player = makePlayer([[1]], 4, 0);
    move(arena, player, 1);
    expect(player.pos.x).toBe(4);
  });
});

// ─── playerRotate ────────────────────────────────────────────────────────────

describe("playerRotate", () => {
  // T-piece standing upright:
  // [1, 1, 1]
  // [0, 1, 0]
  const tPiece = [
    [1, 1, 1],
    [0, 1, 0],
  ];

  it("rotates a piece clockwise in open space", () => {
    const arena = makeArena(10, 20);
    const player = makePlayer(tPiece, 4, 4);
    playerRotate(arena, player, 1);
    // After clockwise rotation the matrix dimensions should be transposed
    expect(player.matrix.length).toBe(3);
    expect(player.matrix[0].length).toBe(2);
  });

  it("rotates a piece counter-clockwise in open space", () => {
    const arena = makeArena(10, 20);
    const player = makePlayer(tPiece, 4, 4);
    playerRotate(arena, player, -1);
    expect(player.matrix.length).toBe(3);
    expect(player.matrix[0].length).toBe(2);
  });

  it("clockwise and counter-clockwise are inverses", () => {
    const arena = makeArena(10, 20);
    const original = tPiece.map((row) => [...row]);
    const player = makePlayer(tPiece.map((row) => [...row]), 4, 4);
    playerRotate(arena, player, 1);
    playerRotate(arena, player, -1);
    expect(player.matrix).toEqual(original);
  });

  it("reverts rotation when no valid position exists", () => {
    // Fill the arena so that any rotated position collides
    const width = 5;
    const height = 10;
    const arena = makeArena(width, height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        arena[y][x] = 1;
      }
    }
    // Leave only a narrow column for the piece
    arena[5][2] = 0;

    const original = [[1], [1], [1], [1]]; // I-piece vertical
    const player = makePlayer(
      original.map((row) => [...row]),
      2,
      2,
    );
    const beforeX = player.pos.x;
    playerRotate(arena, player, 1);
    // Rotation should have been reverted
    expect(player.matrix).toEqual(original);
    expect(player.pos.x).toBe(beforeX);
  });

  it("wall-kick adjusts position when rotation is against a wall", () => {
    const arena = makeArena(10, 20);
    // Place the T-piece at the far left, rotated, so one rotation would go OOB
    const player = makePlayer(tPiece.map((row) => [...row]), 0, 5);
    playerRotate(arena, player, 1);
    // The piece should have been wall-kicked to a valid x >= 0
    expect(player.pos.x).toBeGreaterThanOrEqual(0);
  });
});
