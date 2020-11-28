import { Flex } from 'theme-ui'
import { useMemo } from 'react'
import { useTable } from 'react-table'
import QRCode from 'qrcode.react'
import Link from 'next/link'
import Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'

const Index = ({ protocol, delegators, ...props }) => {
  const columns: any = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'rank',
      },
      {
        Header: 'Account',
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
      {...props}
    >
      <thead>
        {headerGroups.map((headerGroup, i) => (
          <tr key={i}>
            {headerGroup.headers.map((column, i) => (
              <th
                sx={{ pb: 3, textTransform: 'uppercase' }}
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
        {rows.map((row, i) => {
          prepareRow(row)
          return (
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
          )
        })}
      </tbody>
    </table>
  )
}

export default Index

function renderSwitch(cell, protocol) {
  switch (cell.column.Header) {
    case '#':
      return (
        <Flex sx={{ alignItems: 'center', fontFamily: 'monospace' }}>
          {cell.row.index + 1}{' '}
        </Flex>
      )
    case 'Account':
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
            href="/accounts/[account]/[slug]"
            as={`/accounts/${cell.value}/staking`}
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
          {abbreviateNumber(parseFloat(Utils.fromWei(cell.value)), 4)}
        </span>
      )
    case 'Equity':
      return (
        <span sx={{ fontFamily: 'monospace' }}>{`${(
          (parseFloat(cell.value) / parseFloat(protocol.totalActiveStake)) *
          100
        ).toFixed(3)}%`}</span>
      )
    default:
      return null
  }
}
