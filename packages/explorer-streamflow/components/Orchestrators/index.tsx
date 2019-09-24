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
        id
      }
    }
  `

  const { data } = useQuery(GET_ROI)

  const columns: any = React.useMemo(
    () => [
      {
        Header: 'Account',
        accessor: 'id',
        filter: 'fuzzyText',
        Filter: DefaultColumnFilter,
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

  const firstColumn: any = headerGroups[0].headers[0]

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
        <div>{firstColumn.canFilter ? firstColumn.render('Filter') : null}</div>
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
          {rows.map(
            (row: any, i) =>
              prepareRow(row) || (
                <tr
                  {...row.getRowProps()}
                  key={i}
                  sx={{
                    '&:hover': {
                      bg: lighten('#1E2026', 0.05),
                    },
                    bg:
                      row.values.id ==
                      (data &&
                        data.selectedTranscoder &&
                        data.selectedTranscoder.id)
                        ? 'surface'
                        : 'transparent',
                  }}
                >
                  {row.cells.map((cell, i) => {
                    return (
                      <td
                        sx={{ fontSize: 1, px: 2, py: '12px' }}
                        {...cell.getCellProps()}
                        onClick={() =>
                          client.writeData({
                            data: {
                              selectedTranscoder: {
                                __typename: 'Transcoder',
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
              ),
          )}
        </tbody>
      </table>
    </Box>
  )
}

function renderSwitch(cell) {
  switch (cell.column.Header) {
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
            href="/account/[account]/campaign"
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
              {cell.value.replace(cell.value.slice(7, 37), '…')}
            </a>
          </Link>
        </Flex>
      )
    case 'Stake':
      return (
        <span sx={{ fontFamily: 'monospace' }}>
          {abbreviateNumber(cell.value ? Utils.fromWei(cell.value) : 0, 5)}
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
