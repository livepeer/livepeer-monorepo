/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React from 'react'
import { useTable } from 'react-table'
import QRCode from 'qrcode.react'
import Link from 'next/link'
import * as Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'

function Table({ columns, data: { delegators, protocol } }) {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: delegators,
  })

  return (
    <table
      sx={{
        display: 'table',
        width: '100%',
        borderSpacing: '0',
        borderCollapse: 'collapse',
      }}
      {...getTableProps()}
    >
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr key={i}>
            {headerGroup.headers.map((column, i) => (
              <th
                sx={{ pb: 3 }}
                align="left"
                {...column.getHeaderProps()}
                key={i}
              >
                <span sx={{ fontSize: 0 }}>{column.render('Header')}</span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map(
          (row, i) =>
            prepareRow(row) || (
              <tr {...row.getRowProps()} key={i}>
                {row.cells.map((cell, i) => {
                  return (
                    <td
                      sx={{ fontSize: 1, pb: 3 }}
                      {...cell.getCellProps()}
                      key={i}
                    >
                      {renderSwitch(cell, protocol)}
                    </td>
                  )
                })}
              </tr>
            ),
        )}
      </tbody>
    </table>
  )
}

function renderSwitch(cell, protocol) {
  switch (cell.column.Header) {
    case 'Tokenholder':
      return (
        <Flex sx={{ alignItems: 'center' }}>
          <QRCode
            style={{
              borderRadius: 1000,
              width: 32,
              height: 32,
              marginRight: 16,
            }}
            fgColor={`#${cell.value.substr(2, 6)}`}
            value={cell.value}
          />
          <Link
            href="/[account]/staking"
            as={`/${cell.value}/staking`}
            passHref
          >
            <a
              sx={{
                color: 'text',
                cursor: 'pointer',
                transition: 'all .3s',
                borderBottom: '1px solid',
                borderColor: 'transparent',
                '&:hover': {
                  color: 'primary',
                  borderBottom: '1px solid',
                  borderColor: 'primary',
                  transition: 'all .3s',
                },
              }}
            >
              {cell.value.replace(cell.value.slice(7, 37), '…')}
            </a>
          </Link>
        </Flex>
      )
    case 'Stake':
      return (
        <span sx={{ fontFamily: 'monospace' }}>
          {abbreviateNumber(Utils.fromWei(cell.value), 4)}
        </span>
      )
    case 'Equity':
      return (
        <span sx={{ fontFamily: 'monospace' }}>{`${(
          (Utils.fromWei(cell.value) /
            Utils.fromWei(protocol.totalBondedToken)) *
          100
        ).toPrecision(2)}%`}</span>
      )
    default:
      return null
  }
}

function App({ protocol, delegators }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Tokenholder',
        accessor: 'id',
      },
      {
        Header: 'Stake',
        accessor: 'pendingStake',
      },
      {
        Header: 'Equity',
        accessor: 'pendingStake',
      },
    ],
    [],
  )

  return <Table columns={columns} data={{ delegators, protocol }} />
}

export default App
