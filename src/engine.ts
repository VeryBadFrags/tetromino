import { Player, GamePiece } from './player'

const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById('game')
)
const context: CanvasRenderingContext2D = canvas.getContext('2d')

const nextPieceCanvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById('nextPiece')
)
const nextPieceContext: CanvasRenderingContext2D = nextPieceCanvas.getContext(
  '2d'
)

const background = '#263238'

canvas.tabIndex = 1

const colors = [
  null,
  '#AB47BC', // T purple
  '#FFEE58', // O yellow
  '#FB8C00', // L orange
  '#1565C0', // J blue
  '#26C6DA', // I cyan
  '#4CAF50', // S green
  '#ef5350' // Z red
]

export function draw (
  arena: number[][],
  currPlayer: Player,
  shadow: GamePiece
): void {
  // context.fillStyle = '#263238';
  context.clearRect(0, 0, canvas.width, canvas.height)

  drawMatrix(context, arena, { x: 0, y: 0 })
  drawShadow(shadow)
  drawMatrix(context, currPlayer.matrix, currPlayer.pos)
}

export function drawShadow (shadow: GamePiece): void {
  drawMatrix(context, shadow.matrix, shadow.pos, true)
}

export function drawNextPiece (nextPiece: number[][]): void {
  nextPieceContext.clearRect(0, 0, canvas.width, canvas.height)
  drawNextPieceMatrix(nextPieceContext, nextPiece)
}

export function updateScore (currPlayer: Player): void {
  document.getElementById('score').innerText = currPlayer.score.toString()
}

const blockWidth = canvas.height / 20
const blockPaddingFactor = 0.9
function drawMatrix (
  ctx: CanvasRenderingContext2D,
  piece: number[][],
  offset: { x: number, y: number },
  hollow = false
) {
  const paddedBlock = blockWidth * blockPaddingFactor

  piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = colors[value]
        // context.globalAlpha = 0.9;
        // // Transparent outter rectangle
        // fillRectangle(ctx, x + offset.x, y + offset.y, blockWidth, paddedBlock);

        // context.globalAlpha = 1.0;
        // Full inner rectangle
        fillRectangle(ctx, x + offset.x, y + offset.y, blockWidth, paddedBlock)

        if (hollow) {
          // Remove innermost rectangle
          ctx.fillStyle = background
          const actualSize = paddedBlock * 0.85
          const bOffset = (blockWidth - actualSize) / 2
          ctx.clearRect(
            (x + offset.x) * blockWidth + bOffset,
            (y + offset.y) * blockWidth + bOffset,
            actualSize,
            actualSize
          )
        }
      }
    })
  })
}

function fillRectangle (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  blockSize: number,
  actualSize: number
) {
  ctx.fillRect(
    x * blockSize + (blockSize - actualSize) / 2,
    y * blockSize + (blockSize - actualSize) / 2,
    actualSize,
    actualSize
  )
}

const nextPieceOffset = 2
function drawNextPieceMatrix (ctx: CanvasRenderingContext2D, piece: number[][]) {
  piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        const nextPieceBlockWidth =
          nextPieceCanvas.width / (row.length + nextPieceOffset)
        const nextPieceBlockHeight =
          nextPieceCanvas.height / (piece.length + nextPieceOffset)
        const nextPieceBlockSize = Math.min(
          nextPieceBlockWidth,
          nextPieceBlockHeight
        )

        ctx.fillStyle = colors[value]
        ctx.fillRect(
          (x + nextPieceOffset / 2) * nextPieceBlockSize,
          (y + nextPieceOffset / 2) * nextPieceBlockSize,
          nextPieceBlockSize * blockPaddingFactor,
          nextPieceBlockSize * blockPaddingFactor
        )
      }
    })
  })
}
