'use client'

import { Cell } from '@/components/Cell'

export function Board({ grid, handleClick }) {
  return grid.map((_, i) => (
    <div key={i} style={{ display: 'flex' }}>
      {grid[i].map((_, j) => (
        <Cell key={i + j} {...grid[i][j]} handleClick={handleClick} />
      ))}
    </div>
  ))
}
