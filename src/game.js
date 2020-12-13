const pieces = 'ILJOTSZ';
let bagOfPieces = [];

export function collide(gameArena, matrix) {
    const [m, o] = [matrix.matrix, matrix.pos];
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if (m[y][x] !== 0
                && (gameArena[y + o.y]
                    && gameArena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

export function merge(gameArena, currentPlayer) {
    currentPlayer.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                gameArena[y + currentPlayer.pos.y][x + currentPlayer.pos.x] = value;
            }
        });
    });
}

export let nextPiece;
export function playerReset(arena, player) {
    if (nextPiece == null) {
        nextPiece = generateNextPiece();
    }

    player.matrix = nextPiece;
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
        (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
    }
    nextPiece = generateNextPiece();
    return nextPiece;
}

function generateNextPiece() {
    if (bagOfPieces.length === 0) {
        bagOfPieces = [...pieces];
    }
    let pieceIndex = bagOfPieces.length * Math.random() | 0;

    let newPiece = createPiece(bagOfPieces[pieceIndex]);
    bagOfPieces.splice(pieceIndex, 1);
    return newPiece;
}

export function scanArena(arena, player) {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y >= 0; y--) {
        for (let x = 0; x < arena[y].length; x++) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        y++;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

export function generateShadow(arena, player) {
    let shadow = {
        pos: { x: player.pos.x, y: player.pos.y },
        matrix: player.matrix
    };
    while (!collide(arena, shadow)) {
        shadow.pos.y++;
    }
    shadow.pos.y--;
    return shadow;
}

function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    } else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ];
    } else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0]
        ];
    } else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0]
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ];
    }
}
