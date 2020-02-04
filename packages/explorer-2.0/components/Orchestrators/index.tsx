import { Flex, Box } from 'theme-ui'
import { lighten } from '@theme-ui/color'
import { useMemo } from 'react'
import { useTable, useFilters } from 'react-table'
import * as Utils from 'web3-utils'
import { getDelegatorStatus, abbreviateNumber } from '../../lib/utils'
import Orchestrators from '../../public/img/orchestrators.svg'
import Search from '../../public/img/search.svg'
import Help from '../../public/img/help.svg'
import { useApolloClient } from '@apollo/react-hooks'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import matchSorter from 'match-sorter'
import { Styled } from 'theme-ui'
import AccountCell from '../AccountCell'
import ReactTooltip from 'react-tooltip'
import useWindowSize from 'react-use/lib/useWindowSize'
import Router from 'next/router'

export default ({ currentRound, transcoders }) => {
  const { width } = useWindowSize()
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

  const columns: any = useMemo(
    () => [
      {
        Header: 'Account',
        accessor: 'id',
        filter: 'fuzzyText',
        Filter: DefaultColumnFilter,
        mobile: true,
      },
      {
        Header: 'Activation Round',
        accessor: 'activationRound',
        show: false,
      },
      {
        Header: 'Deactivation Round',
        accessor: 'deactivationRound',
        show: false,
      },
      {
        Header: 'Active',
        accessor: 'active',
        show: false,
        mobile: true,
      },
      {
        Header: 'ThreeBoxSpace',
        accessor: 'threeBoxSpace',
        show: false,
      },
      {
        Header: 'Delegator',
        accessor: 'delegator',
        show: false,
      },
      {
        Header: 'Stake',
        accessor: 'totalStake',
        mobile: true,
      },
      {
        Header: 'Fees',
        accessor: 'accruedFees',
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

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const filterTypes = useMemo(
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

  const tableOptions: any = {
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
          position: ['sticky', 'sticky', 'sticky', 'relative'],
          width: '100%',
          top: [63, 63, 79, 0],
          bg: 'background',
          zIndex: 10,
          flexDirection: 'column',
          alignItems: 'flex-start',
          pt: [1, 1, 1, 0],
          pb: [1, 1, 1, 3],
          ml: 0,
          mr: 0,
          justifyContent: 'space-between',
        }}
      >
        <Styled.h1
          sx={{
            mb: [4, 4, 4, 5],
            display: ['none', 'none', 'none', 'flex'],
            alignItems: 'center',
          }}
        >
          <Orchestrators
            sx={{ width: 32, height: 32, mr: 2, color: 'primary' }}
          />{' '}
          Orchestrators
        </Styled.h1>
        <Box>
          {accountColumn.canFilter ? accountColumn.render('Filter') : null}
        </Box>
      </Flex>
      <Box>
        <table
          sx={{
            display: 'table',
            width: '100%',
            minWidth: ['100%', '100%', '100%', 650],
            borderSpacing: '0',
            borderCollapse: 'collapse',
            ml: [-1, -1, -1, 0],
            mr: [-1, -1, -1, 0],
          }}
          {...getTableProps()}
        >
          <thead
            sx={{ display: ['none', 'none', 'none', 'table-header-group'] }}
          >
            {headerGroups.map((headerGroup, i) => (
              <tr key={i}>
                {headerGroup.headers.map((column: any, i) => (
                  <th
                    sx={{
                      pb: 1,
                      pl: 2,
                      display: [
                        column.mobile ? 'table-cell' : 'none',
                        column.mobile ? 'table-cell' : 'none',
                        'table-cell',
                      ],
                      textTransform: 'uppercase',
                    }}
                    align="left"
                    {...column.getHeaderProps()}
                    key={i}
                  >
                    <Flex>
                      <span sx={{ fontSize: 0 }}>
                        {column.render('Header')}
                      </span>
                      {renderTooltip(column.render('Header'))}
                    </Flex>
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
                    onClick={() => {
                      if (width < 1020) {
                        Router.push(
                          '/accounts/[account]/[slug]',
                          `/accounts/${row.values.id}/campaign`,
                        )
                      }
                    }}
                    sx={{
                      height: 64,
                      'td:first-of-type': {
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      },
                      'td:last-of-type': {
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                      },
                      '&:hover': {
                        bg: [
                          'transparent',
                          'transparent',
                          'transparent',
                          lighten('#1E2026', 0.05),
                        ],
                        '.status': {
                          borderColor: lighten('#1E2026', 0.05),
                        },
                        '.orchestratorLink': {
                          borderColor: 'text',
                          display: 'inlineBlock',
                          transition: 'all .3s',
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
                          ? [
                              'transparent',
                              'transparent',
                              'transparent',
                              'surface',
                            ]
                          : 'transparent',
                    }}
                  >
                    {row.cells.map((cell, i) => {
                      return (
                        <td
                          sx={{
                            display: [
                              cell.column.mobile ? 'table-cell' : 'none',
                              cell.column.mobile ? 'table-cell' : 'none',
                              'table-cell',
                            ],
                            cursor:
                              i == 0
                                ? 'pointer'
                                : width < 1020
                                ? 'pointer'
                                : 'default',
                            width: 'auto',
                            fontSize: 1,
                            pl: 2,
                            pr: 2,
                            py: '24px',
                          }}
                          {...cell.getCellProps()}
                          onClick={() => {
                            if (i === 0 && width > 1020) {
                              Router.push(
                                '/accounts/[account]/[slug]',
                                `/accounts/${row.values.id}/campaign`,
                              )
                            } else {
                              client.writeData({
                                data: {
                                  selectedTranscoder: {
                                    __typename: 'Transcoder',
                                    index: rowIndex,
                                    id: row.values.id,
                                    threeBoxSpace: row.values.threeBoxSpace,
                                  },
                                },
                              })
                            }
                          }}
                          key={i}
                        >
                          {renderSwitch(cell, currentRound)}
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
    </Box>
  )
}

function renderTooltip(title) {
  switch (title) {
    case 'Stake':
      return (
        <>
          <ReactTooltip
            id="tooltip-stake"
            className="tooltip"
            place="bottom"
            type="dark"
            effect="solid"
          />
          <Help
            data-tip="Total LPT staked with an orchestrator, including its own stake."
            data-for="tooltip-stake"
            sx={{
              cursor: 'pointer',
              position: 'relative',
              ml: 1,
              top: '2px',
              width: 12,
              height: 12,
            }}
          />
        </>
      )
    case 'Fees':
      return (
        <>
          <ReactTooltip
            id="tooltip-fees"
            className="tooltip"
            place="bottom"
            type="dark"
            effect="solid"
          />
          <Help
            data-tip="Total ETH earned from transcoding."
            data-for="tooltip-fees"
            sx={{
              cursor: 'pointer',
              position: 'relative',
              ml: 1,
              top: '2px',
              width: 12,
              height: 12,
            }}
          />
        </>
      )
    case 'Reward Cut':
      return (
        <>
          <ReactTooltip
            id="tooltip-reward-cut"
            className="tooltip"
            place="bottom"
            type="dark"
            effect="solid"
          />
          <Help
            data-tip="The percent of the newly minted Livepeer token that the orchestrator will keep from the round’s inflation distribution. The remainder gets distributed across all staked tokenholders by how much you stake relative to others."
            data-for="tooltip-reward-cut"
            sx={{
              cursor: 'pointer',
              position: 'relative',
              ml: 1,
              top: '2px',
              width: 12,
              height: 12,
            }}
          />
        </>
      )
    case 'Fee Cut':
      return (
        <>
          <ReactTooltip
            id="tooltip-fee-cut"
            className="tooltip"
            place="bottom"
            type="dark"
            effect="solid"
          />
          <Help
            data-tip="The percent of the earned fees (ETH) that the orchestrator will keep. The remainder gets distributed across all delegators by how much they have staked relative to others."
            data-for="tooltip-fee-cut"
            sx={{
              cursor: 'pointer',
              position: 'relative',
              ml: 1,
              top: '2px',
              width: 12,
              height: 12,
            }}
          />
        </>
      )
    case 'Calls':
      return (
        <>
          <ReactTooltip
            id="tooltip-calls"
            className="tooltip"
            place="bottom"
            type="dark"
            effect="solid"
          />
          <Help
            data-tip="The number of times an orchestrator claimed its newly minted rewards on behalf of its delegators over the last 30 rounds."
            data-for="tooltip-calls"
            sx={{
              cursor: 'pointer',
              position: 'relative',
              ml: 1,
              top: '2px',
              width: 12,
              height: 12,
            }}
          />
        </>
      )

    default:
      return null
  }
}

function renderSwitch(cell, currentRound) {
  switch (cell.column.Header) {
    case 'Account':
      const status = getDelegatorStatus(cell.row.values.delegator, currentRound)
      const active =
        cell.row.values.activationRound <= currentRound.id &&
        cell.row.values.deactivationRound > currentRound.id
      return (
        <AccountCell
          status={status}
          active={active}
          threeBoxSpace={cell.row.values.threeBoxSpace}
          address={cell.value}
        />
      )
    case 'Stake':
      return (
        <span sx={{ fontFamily: 'monospace' }}>
          {abbreviateNumber(cell.value ? Utils.fromWei(cell.value) : 0, 4)}
        </span>
      )
    case 'Fees':
      return (
        <span sx={{ fontFamily: 'monospace' }}>
          {cell.value ? +parseFloat(Utils.fromWei(cell.value)).toFixed(2) : 0} Ξ
        </span>
      )
    case 'Reward Cut':
      return <span sx={{ fontFamily: 'monospace' }}>{cell.value / 10000}%</span>
    case 'Fee Cut':
      return (
        <span sx={{ fontFamily: 'monospace' }}>
          {!cell.value
            ? 0
            : (100 - cell.value / 10000).toFixed(2).replace(/[.,]00$/, '')}
          %
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
    <Flex
      sx={{
        alignItems: 'center',
        pl: 1,
      }}
    >
      <Search sx={{ width: 16, height: 16, mr: 1, color: 'muted' }} />
      <Box
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
        placeholder={`Filter`}
        as="input"
        type="text"
        variant="input"
        sx={{
          display: 'block',
          outline: 'none',
          width: '100%',

          appearance: 'none',
          fontSize: 2,
          lineHeight: 'inherit',
          border: 0,
          color: 'inherit',
          bg: 'transparent',
        }}
      />
    </Flex>
  )
}
