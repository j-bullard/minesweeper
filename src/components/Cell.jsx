'use client'

export function Cell({
  row,
  col,
  revealed,
  mine,
  count,
  flagged,
  handleClick,
}) {
  const _handleClick = (e) => {
    e.preventDefault()

    handleClick(row, col, e.type === 'contextmenu')
  }

  return (
    <div
      data-row={row}
      data-col={col}
      style={{
        width: 36,
        height: 36,
        border: '1px solid rgba(0, 0, 0, 0.4)',
        display: 'grid',
        placeItems: 'center',
        fontSize: '0.875rem',
        backgroundColor: revealed ? 'lightgray' : 'gray',
      }}
      onClick={_handleClick}
      onContextMenu={_handleClick}
    >
      {revealed
        ? mine
          ? '💣'
          : count === 0
            ? null
            : count
        : flagged
          ? '🚩'
          : null}
    </div>
  )
}
