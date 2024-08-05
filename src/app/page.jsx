'use client'

import { Board } from '@/components/Board'
import { logout } from '@/lib/authActions'
import { useEffect, useState } from 'react'

const levels = {
  beginner: { width: 9, height: 9, numMines: 10 },
  intermediate: { width: 16, height: 16, numMines: 40 },
  expert: { width: 30, height: 16, numMines: 99 },
}

export default function HomePage() {
  const [level, setLevel] = useState('beginner')
  const [grid, setGrid] = useState([])
  const [flagsUsed, setFlagsUsed] = useState(0)
  const [gameStatus, setGameStatus] = useState('waiting')
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    newGame()
  }, [])

  useEffect(() => {
    if (!grid.length) {
      return
    }

    checkGameStatus()
  }, [grid])

  useEffect(() => {
    if (gameStatus !== 'playing') {
      return
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [gameStatus])

  const checkGameStatus = () => {
    const numRevealed = grid.reduce(
      (acc, row) => acc + row.filter((cell) => cell.revealed).length,
      0,
    )
    const numMinesRevealed = grid.reduce(
      (acc, row) =>
        acc + row.filter((cell) => cell.revealed && cell.mine).length,
      0,
    )
    const numFlags = grid.reduce(
      (acc, row) => acc + row.filter((cell) => cell.flagged).length,
      0,
    )

    if (
      numRevealed + numMinesRevealed + numFlags ===
      levels[level].width * levels[level].height
    ) {
      setGameStatus('win')
    } else if (numMinesRevealed > 0) {
      setGameStatus('lose')
    }
  }

  const newGame = () => {
    setFlagsUsed(0)
    setTimer(0)
    setGameStatus('waiting')

    const nextGrid = Array.from({ length: levels[level].height }, (_, row) =>
      Array.from({ length: levels[level].width }, (_, col) => ({
        row,
        col,
        mine: false,
        flagged: false,
        revealed: false,
        count: 0,
      })),
    )

    let numMinesPlaced = 0
    while (numMinesPlaced < levels[level].numMines) {
      const row = Math.floor(Math.random() * levels[level].height)
      const col = Math.floor(Math.random() * levels[level].width)

      if (!nextGrid[row][col].mine) {
        nextGrid[row][col].mine = true
        numMinesPlaced++
      }
    }

    // count adjacent mines
    for (let x = 0; x < levels[level].height; x++) {
      for (let y = 0; y < levels[level].width; y++) {
        let count = 0

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (nextGrid[x + dx]?.[y + dy]?.mine) {
              count++
            }
          }
        }

        nextGrid[x][y].count = count
      }
    }

    setGrid(nextGrid)
  }

  const handleClick = (row, col, flag = false) => {
    if (gameStatus === 'waiting') {
      setGameStatus('playing')
    } else if (gameStatus !== 'playing') {
      return
    }

    const nextGrid = [...grid]

    // If cell is already revealed, do nothing
    if (nextGrid[row][col].revealed) {
      return
    }

    // If cell is flagged, toggle flag
    if (flag) {
      nextGrid[row][col].flagged = !nextGrid[row][col].flagged
      setFlagsUsed((prev) => prev + (nextGrid[row][col].flagged ? 1 : -1))
      setGrid(nextGrid)
      return
    }

    // Reveal cell
    nextGrid[row][col].revealed = true

    // If cell is a mine, game over
    if (nextGrid[row][col].mine) {
      for (let i = 0; i < nextGrid.length; i++) {
        for (let j = 0; j < nextGrid[i].length; j++) {
          if (nextGrid[i][j].mine) {
            nextGrid[i][j].revealed = true
          }
        }
      }

      // If cell is empty, reveal adjacent cells
    } else if (nextGrid[row][col].count === 0) {
      const revealLoop = (row, col) => {
        // Reveal adjacent cells
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const cell = nextGrid[row + dx]?.[col + dy]
            if (cell && !cell.revealed) {
              cell.revealed = true

              if (cell.count === 0) {
                revealLoop(row + dx, col + dy)
              }
            }
          }
        }
      }

      revealLoop(row, col)
    }

    setGrid(nextGrid)
  }

  return (
    <div>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1>Minesweeper</h1>
        <form action={logout}>
          <button type='submit'>Logout</button>
        </form>
      </header>

      <div>
        <label htmlFor='level'>Level</label>
        <select
          id='level'
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          disabled={gameStatus !== 'waiting'}
        >
          <option value='beginner'>Beginner</option>
          <option value='intermediate'>Intermediate</option>
          <option value='expert'>Expert</option>
        </select>
        <button onClick={() => newGame()} disabled={gameStatus !== 'waiting'}>
          New Game
        </button>
      </div>
      <p>Game Status: {gameStatus}</p>
      <p>Time: {timer}</p>
      <p>Flags remaining: {levels[level].numMines - flagsUsed}</p>

      <Board grid={grid} handleClick={handleClick} />

      {grid.length === 0 && <p>Loading...</p>}
      {gameStatus === 'lose' && (
        <p>
          You lost! <button onClick={() => newGame()}>Play again</button>
        </p>
      )}

      {gameStatus === 'win' && (
        <p>
          You won! <button onClick={() => newGame()}>Play again</button>
        </p>
      )}

      {gameStatus === 'playing' && (
        <p>
          <button onClick={() => newGame()}>Restart</button>
        </p>
      )}
    </div>
  )
}
