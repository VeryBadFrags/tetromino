import { Player, GamePiece } from './player'

const pieces = 'ILJOTSZ'
let bagOfPieces: string[] = []

export function collide (gameArena: number[][], piece: GamePiece): boolean {
  const [m, o] = [piece.matrix, piece.pos]
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (
        m[y][x] !== 0 &&
        (gameArena[y + o.y] && gameArena[y + o.y][x + o.x]) !== 0
      ) {
        return true
      }
    }
  }
  return false
}

export function merge (gameArena: number[][], currPlayer: Player): void {
  currPlayer.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        gameArena[y + currPlayer.pos.y][x + currPlayer.pos.x] = value
      }
    })
  })
}

export let nextPiece: number[][]
export function playerReset (arena: number[][], currPlayer: Player): number[][] {
  if (nextPiece == null) {
    nextPiece = generateNextPiece()
  }

  currPlayer.matrix = nextPiece
  currPlayer.pos.y = 0
  currPlayer.pos.x =
    ((arena[0].length / 2) | 0) - ((currPlayer.matrix[0].length / 2) | 0)
  if (collide(arena, currPlayer)) {
    arena.forEach((row) => row.fill(0))
    currPlayer.score = 0
  }
  nextPiece = generateNextPiece()
  return nextPiece
}

function generateNextPiece (): number[][] {
  if (bagOfPieces.length === 0) {
    bagOfPieces = [...pieces]
  }
  const pieceIndex = (bagOfPieces.length * Math.random()) | 0

  const newPiece = createPiece(bagOfPieces[pieceIndex])
  bagOfPieces.splice(pieceIndex, 1)
  return newPiece
}

// Check for completed rows
export function scanArena (arena: number[][], currPlayer: Player): void {
  let rowCount = 1
  for (let y = arena.length - 1; y >= 0; y--) {
    let completedRow = true
    for (const cell of arena[y]) {
      if (cell === 0) {
        completedRow = false
        break
      }
    }

    if (completedRow) {
      const row = arena.splice(y, 1)[0].fill(0)
      arena.unshift(row)
      y++

      currPlayer.score += rowCount * 10
      rowCount *= 2
    }
  }
}

export function generateShadow (
  arena: number[][],
  currPlayer: Player
): GamePiece {
  const shadow = {
    pos: { x: currPlayer.pos.x, y: currPlayer.pos.y },
    matrix: currPlayer.matrix
  }
  while (!collide(arena, shadow)) {
    shadow.pos.y++
  }
  shadow.pos.y--
  return shadow
}

function createPiece (type: string): number[][] {
  if (type === 'T') {
    return [
      [1, 1, 1],
      [0, 1, 0]
    ]
  } else if (type === 'O') {
    return [
      [2, 2],
      [2, 2]
    ]
  } else if (type === 'L') {
    return [
      [3, 0],
      [3, 0],
      [3, 3]
    ]
  } else if (type === 'J') {
    return [
      [0, 4],
      [0, 4],
      [4, 4]
    ]
  } else if (type === 'I') {
    return [[5], [5], [5], [5]]
  } else if (type === 'S') {
    return [
      [0, 6, 6],
      [6, 6, 0]
    ]
  } else if (type === 'Z') {
    return [
      [7, 7, 0],
      [0, 7, 7]
    ]
  }
  return []
}
