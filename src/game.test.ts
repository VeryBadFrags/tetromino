import { beforeEach, describe, expect, it } from "vitest";
import { collide, generateShadow, merge, scanArena } from "./game.ts";
import type { Player } from "./player.ts";

function makeArena(width: number, height: number): number[][] {
	return Array.from({ length: height }, () => new Array(width).fill(0));
}

function makePlayer(matrix: number[][], x = 0, y = 0): Player {
	return { pos: { x, y }, matrix, score: 0 };
}

// ─── collide ────────────────────────────────────────────────────────────────

describe("collide", () => {
	it("returns false for a piece in an empty arena", () => {
		const arena = makeArena(5, 5);
		const piece = { pos: { x: 1, y: 1 }, matrix: [[1]] };
		expect(collide(arena, piece)).toBe(false);
	});

	it("returns true when piece falls off the bottom", () => {
		const arena = makeArena(5, 5);
		const piece = { pos: { x: 0, y: 5 }, matrix: [[1]] };
		expect(collide(arena, piece)).toBe(true);
	});

	it("returns true when piece is off the right edge", () => {
		const arena = makeArena(5, 5);
		const piece = { pos: { x: 5, y: 0 }, matrix: [[1]] };
		expect(collide(arena, piece)).toBe(true);
	});

	it("returns true when piece is off the left edge", () => {
		const arena = makeArena(5, 5);
		const piece = { pos: { x: -1, y: 0 }, matrix: [[1]] };
		expect(collide(arena, piece)).toBe(true);
	});

	it("returns true when piece overlaps a filled cell", () => {
		const arena = makeArena(5, 5);
		arena[2][2] = 1;
		const piece = { pos: { x: 2, y: 2 }, matrix: [[1]] };
		expect(collide(arena, piece)).toBe(true);
	});

	it("returns false when only zero cells overlap a filled cell", () => {
		const arena = makeArena(5, 5);
		arena[1][0] = 1;
		// T-piece: top row has non-zero at x=0,1,2; bottom row has non-zero at x=1 only
		// Place it so that the zero at bottom-left aligns with the filled cell
		const piece = {
			pos: { x: 0, y: 0 },
			matrix: [
				[1, 1, 1],
				[0, 1, 0], // zero at (0,1) — aligns with arena[1][0]
			],
		};
		expect(collide(arena, piece)).toBe(false);
	});

	it("returns true when piece overlaps a filled cell via position offset", () => {
		const arena = makeArena(10, 20);
		arena[9][4] = 3;
		// piece at (x=3, y=9), matrix [[0, 1]] → cell [0][1] lands on arena[9][4]
		const piece = { pos: { x: 3, y: 9 }, matrix: [[0, 1]] };
		expect(collide(arena, piece)).toBe(true);
	});
});

// ─── merge ──────────────────────────────────────────────────────────────────

describe("merge", () => {
	it("writes piece values into the arena at the player position", () => {
		const arena = makeArena(5, 5);
		const player = makePlayer([[2]], 2, 3);
		merge(arena, player);
		expect(arena[3][2]).toBe(2);
	});

	it("respects x/y offset when merging", () => {
		const arena = makeArena(10, 10);
		const matrix = [
			[1, 1, 1],
			[0, 1, 0],
		];
		const player = makePlayer(matrix, 3, 5);
		merge(arena, player);
		expect(arena[5][3]).toBe(1);
		expect(arena[5][4]).toBe(1);
		expect(arena[5][5]).toBe(1);
		expect(arena[6][3]).toBe(0);
		expect(arena[6][4]).toBe(1);
		expect(arena[6][5]).toBe(0);
	});

	it("does not overwrite existing arena cells with piece zeros", () => {
		const arena = makeArena(5, 5);
		arena[1][0] = 7;
		const player = makePlayer([[0, 1]], 0, 1);
		merge(arena, player);
		expect(arena[1][0]).toBe(7);
		expect(arena[1][1]).toBe(1);
	});
});

// ─── scanArena ──────────────────────────────────────────────────────────────

describe("scanArena", () => {
	let arena: number[][];
	let player: Player;

	beforeEach(() => {
		arena = makeArena(5, 5);
		player = makePlayer([[1]]);
	});

	it("does not change score when no rows are complete", () => {
		arena[4][0] = 1;
		scanArena(arena, player);
		expect(player.score).toBe(0);
	});

	it("clears one complete row and adds 10 to score", () => {
		arena[4].fill(1);
		scanArena(arena, player);
		expect(player.score).toBe(10);
		expect(arena[4].every((v) => v === 0)).toBe(true);
	});

	it("shifts rows down after clearing", () => {
		arena[3].fill(2);
		arena[4].fill(1);
		scanArena(arena, player);
		// Both rows cleared; top rows should now be empty
		expect(arena[4].every((v) => v === 0)).toBe(true);
		expect(arena[3].every((v) => v === 0)).toBe(true);
	});

	it("doubles score for each additional cleared row", () => {
		// Two complete rows: 10 + 20 = 30
		arena[3].fill(1);
		arena[4].fill(1);
		scanArena(arena, player);
		expect(player.score).toBe(30);
	});

	it("clears a complete row in the middle of the arena", () => {
		arena[2].fill(1);
		scanArena(arena, player);
		expect(player.score).toBe(10);
		expect(arena[2].every((v) => v === 0)).toBe(true);
	});
});

// ─── generateShadow ─────────────────────────────────────────────────────────

describe("generateShadow", () => {
	it("drops shadow to the bottom of an empty arena", () => {
		const arena = makeArena(5, 10);
		const player = makePlayer([[1]], 0, 0);
		const shadow = generateShadow(arena, player);
		expect(shadow.pos.y).toBe(9);
	});

	it("shadow stops one row above a filled cell", () => {
		const arena = makeArena(5, 10);
		arena[5][0] = 1;
		const player = makePlayer([[1]], 0, 0);
		const shadow = generateShadow(arena, player);
		expect(shadow.pos.y).toBe(4);
	});

	it("shadow does not mutate the player position", () => {
		const arena = makeArena(5, 10);
		const player = makePlayer([[1]], 2, 0);
		generateShadow(arena, player);
		expect(player.pos.y).toBe(0);
		expect(player.pos.x).toBe(2);
	});

	it("shadow x matches the player x", () => {
		const arena = makeArena(10, 20);
		const player = makePlayer([[1]], 4, 3);
		const shadow = generateShadow(arena, player);
		expect(shadow.pos.x).toBe(4);
	});
});
