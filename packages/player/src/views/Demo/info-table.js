import React from 'react'
import styled from 'styled-components'

export default ({ table }) => {
  if (!table || !table[0]) {
    return <TableBox columns={1} />
  }
  return (
    <TableBox columns={table[0].length}>
      {table.map((row, i) =>
        row.map((cell, j) => {
          if (cell.startsWith('#')) {
            return (
              <TableColor color={cell} key={`${i}-${j}`}>
                &nbsp;
              </TableColor>
            )
          }
          return <TableCell key={`${i}-${j}`}>{cell}</TableCell>
        }),
      )}
    </TableBox>
  )
}

export const TableBox = styled.div`
  display: grid;
  grid-template-columns: 2.1em auto auto;
  grid-template-rows: 1fr 1fr 1fr;
  min-height: 0;
  min-width: 0;
  width: auto;
`

export const TableCell = styled.div`
  font-size: 1.3em;
  line-height: 1.3em;
  padding: 0.1em 0.3em;
  align-self: center;
`
export const TableColor = styled.div`
  background-color: ${({ color }) => color};
  width: 2.1em;
  height: 2.1em;
  border-radius: 3px;
  margin: 0.2em 0;
`
