const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const nextPieceCanvas = document.getElementById('nextPiece');
const nextPieceContext = nextPieceCanvas.getContext('2d');

const background = '#263238';

canvas.tabIndex = 1;

const colors = [
    null,
    '#AB47BC', // T purple
    '#FFEE58', // O yellow
    '#FB8C00', // L orange
    '#1565C0', // J blue
    '#26C6DA', // I cyan
    '#4CAF50', // S green
    '#ef5350', // Z red
];

export function draw(arena, player, shadow) {
    //context.fillStyle = '#263238';
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawMatrix(context, arena, { x: 0, y: 0 });
    drawShadow(shadow);
    drawMatrix(context, player.matrix, player.pos);
}

export function drawShadow(shadow) {
    drawMatrix(context, shadow.matrix, shadow.pos, true);
}

export function drawNextPiece(nextPiece) {
    nextPieceContext.clearRect(0, 0, canvas.width, canvas.height);
    drawNextPieceMatrix(nextPieceContext, nextPiece);
}

export function updateScore(player) {
    document.getElementById('score').innerText = player.score;
}

let blockWidth = canvas.height / 20;
let blockPaddingFactor = 0.9;
function drawMatrix(ctx, piece, offset, hollow = false) {
    let paddedBlock = blockWidth * blockPaddingFactor;

    piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = colors[value];
                // context.globalAlpha = 0.9;
                // // Transparent outter rectangle
                // fillRectangle(ctx, x + offset.x, y + offset.y, blockWidth, paddedBlock);

                // context.globalAlpha = 1.0;
                // Full inner rectangle
                fillRectangle(ctx, x + offset.x, y + offset.y, blockWidth, paddedBlock);

                if (hollow) {
                    // Remove innermost rectangle
                    ctx.fillStyle = background;
                    let actualSize = paddedBlock * 0.85;
                    let bOffset = (blockWidth - actualSize)/2;
                    ctx.clearRect((x + offset.x) * blockWidth + bOffset, (y + offset.y) * blockWidth + bOffset, actualSize, actualSize);
                }
            }
        });
    });
}

function fillRectangle(ctx, x, y, blockSize, actualSize) {
    ctx.fillRect(x * blockSize + (blockSize - actualSize) / 2,
        y * blockSize + (blockSize - actualSize) / 2,
        actualSize, actualSize);
}

let nextPieceOffset = 2;
function drawNextPieceMatrix(ctx, piece) {
    piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                let nextPieceBlockWidth = nextPieceCanvas.width / (row.length + nextPieceOffset);
                ctx.fillStyle = colors[value];
                ctx.fillRect((x + nextPieceOffset / 2) * nextPieceBlockWidth, (y + nextPieceOffset / 2) * nextPieceBlockWidth,
                    nextPieceBlockWidth * blockPaddingFactor, nextPieceBlockWidth * blockPaddingFactor);
            }
        });
    });
}
