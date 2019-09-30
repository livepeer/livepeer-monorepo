/** @jsx jsx */
import { jsx, Flex, Box } from 'theme-ui'
import { lighten } from '@theme-ui/color'
import React from 'react'
import { useTable, useFilters } from 'react-table'
import QRCode from 'qrcode.react'
import Link from 'next/link'
import * as Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import Orchestrators from '../../static/img/orchestrators.svg'
import Power from '../../static/img/power.svg'
import Search from '../../static/img/search.svg'
import { useApolloClient } from '@apollo/react-hooks'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import matchSorter from 'match-sorter'
import { Styled } from 'theme-ui'
import Textfield from '../Textfield'

export default ({ protocol, transcoders }) => {
  const client = useApolloClient()

  const GET_ROI = gql`
    {
      selectedTranscoder @client {
        __typename
        index
        id
      }
    }
  `

  const { data } = useQuery(GET_ROI)

  const columns: any = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'rank',
      },

      {
        Header: 'Account',
        accessor: 'id',
        filter: 'fuzzyText',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Active',
        accessor: 'active',
        show: false,
      },
      {
        Header: 'Stake',
        accessor: 'totalStake',
      },
      {
        Header: 'Reward Cut',
        accessor: 'rewardCut',
      },
      {
        Header: 'Fee Cut',
        accessor: 'feeShare',
      },
      {
        Header: 'Calls',
        accessor: 'pools',
      },
    ],
    [],
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    [],
  )

  const tableOptions = {
    columns,
    data: transcoders,
    defaultColumn,
    filterTypes,
  }

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    tableOptions,
    useFilters,
  )

  const accountColumn: any = headerGroups[0].headers[1]

  return (
    <Box sx={{ width: '100%' }}>
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          mb: 3,
          justifyContent: 'space-between',
        }}
      >
        <Styled.h1 sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <Orchestrators
            sx={{ width: 32, height: 32, mr: 2, color: 'primary' }}
          />{' '}
          Orchestrators
        </Styled.h1>
        <div>
          {accountColumn.canFilter ? accountColumn.render('Filter') : null}
        </div>
      </Flex>
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
              {headerGroup.headers.map((column: any, i) => (
                <th
                  sx={{
                    pb: 1,
                    pl: 2,
                    textTransform: 'uppercase',
                  }}
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
          {rows.map((row: any, rowIndex) => {
            return (
              prepareRow(row) || (
                <tr
                  {...row.getRowProps()}
                  key={rowIndex}
                  sx={{
                    '&:hover': {
                      bg: lighten('#1E2026', 0.05),
                      '.status': {
                        borderColor: lighten('#1E2026', 0.05),
                      },
                    },
                    '.status': {
                      borderColor:
                        rowIndex ==
                        (data &&
                          data.selectedTranscoder &&
                          data.selectedTranscoder.index)
                          ? 'surface'
                          : 'background',
                    },
                    bg:
                      rowIndex ==
                      (data &&
                        data.selectedTranscoder &&
                        data.selectedTranscoder.index)
                        ? 'surface'
                        : 'transparent',
                  }}
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <td
                        sx={{
                          width: i > 0 ? 'auto' : 1,
                          fontSize: 1,
                          pl: 2,
                          pr: 2,
                          py: '12px',
                        }}
                        {...cell.getCellProps()}
                        onClick={() =>
                          client.writeData({
                            data: {
                              selectedTranscoder: {
                                __typename: 'Transcoder',
                                index: rowIndex,
                                id: row.values.id,
                              },
                            },
                          })
                        }
                        key={i}
                      >
                        {renderSwitch(cell)}
                      </td>
                    )
                  })}
                </tr>
              )
            )
          })}
        </tbody>
      </table>
    </Box>
  )
}

const ActiveCircle = ({ active }, props) => (
  <div
    className="status"
    sx={{
      position: 'absolute',
      right: '-2px',
      bottom: '-2px',
      bg: active ? 'primary' : 'yellow',
      border: '3px solid',
      borderColor: 'background',
      boxSizing: 'border-box',
      width: 14,
      height: 14,
      borderRadius: 1000,
      ...props.sx,
    }}
  />
)

function renderSwitch(cell) {
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
          <Flex
            sx={{ minWidth: 32, minHeight: 32, position: 'relative', mr: 2 }}
          >
            <QRCode
              style={{
                borderRadius: 1000,
                width: 32,
                height: 32,
              }}
              fgColor={`#${cell.value.substr(2, 6)}`}
              value={cell.value}
            />
            <ActiveCircle active={cell.row.values.active} />
          </Flex>
          <Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
            <Link
              href="/account/[account]/[slug]"
              as={`/account/${cell.value}/campaign`}
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
                <Flex
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>{cell.value.replace(cell.value.slice(5, 39), '…')}</div>
                </Flex>
              </a>
            </Link>
            {cell.row.values.active && (
              <div
                sx={{
                  display: 'inline-flex',
                  padding: '0px 6px',
                  border: '1px solid',
                  borderColor: 'border',
                  color: 'muted',
                  fontWeight: 600,
                  borderRadius: 3,
                  fontSize: '10px',
                  alignItems: 'center',
                }}
              >
                ACTIVE
              </div>
            )}
          </Flex>
        </Flex>
      )
    case 'Stake':
      return (
        <span sx={{ fontFamily: 'monospace' }}>
          {abbreviateNumber(cell.value ? Utils.fromWei(cell.value) : 0, 4)}
        </span>
      )
    case 'Reward Cut':
      return <span sx={{ fontFamily: 'monospace' }}>{cell.value / 10000}%</span>
    case 'Fee Cut':
      return (
        <span sx={{ fontFamily: 'monospace' }}>
          {(100 - cell.value / 10000).toFixed(2).replace(/[.,]00$/, '')}%
        </span>
      )
    case 'Calls':
      let callsMade = cell.value.filter(r => r.rewardTokens != null).length
      return (
        <span sx={{ fontFamily: 'monospace' }}>
          {`${callsMade}/${cell.value.length}`}
        </span>
      )
    default:
      return null
  }
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
  return (
    <Textfield
      icon={<Search sx={{ width: 16, height: 16, mr: 1, color: 'muted' }} />}
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Filter`}
    />
  )
}
