import { Flex, Box } from 'theme-ui'
import { useMemo } from 'react'
import { useTable, useFilters, useSortBy, usePagination } from 'react-table'
import Search from '../../public/img/search.svg'
import Help from '../../public/img/help.svg'
import matchSorter from 'match-sorter'
import AccountCell from '../AccountCell'
import ReactTooltip from 'react-tooltip'
import useWindowSize from 'react-use/lib/useWindowSize'
import Router from 'next/router'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'

const PerformanceTable = ({ data: { currentRound, transcoders }, region }) => {
  const { width } = useWindowSize()
  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, {
      keys: [(row) => row.values[id]],
    })
  }

  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = (val) => !val

  function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
    return (
      <Flex
        sx={{
          alignItems: 'center',
          pl: 3,
        }}
      >
        <Search sx={{ width: 16, height: 16, mr: 1, color: 'muted' }} />
        <Box
          value={filterValue || ''}
          onChange={(e) => {
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

  const columns: any = useMemo(
    () => [
      {
        Header: '#',
        accessor: 'rank',
        disableSortBy: true,
      },
      {
        Header: 'Orchestrator',
        accessor: 'id',
        filter: 'fuzzyText',
        Filter: DefaultColumnFilter,
        mobile: true,
        sortType: (rowA, rowB, columnID) => {
          let rowAIdentity =
            getRowValueByColumnID(rowA, 'threeBoxSpace')?.name ||
            getRowValueByColumnID(rowA, columnID)
          let rowBIdentity =
            getRowValueByColumnID(rowB, 'threeBoxSpace')?.name ||
            getRowValueByColumnID(rowB, columnID)
          return compareBasic(rowAIdentity, rowBIdentity)
        },
      },
      {
        Header: 'Activation Round',
        accessor: 'activationRound',
      },
      {
        Header: 'Deactivation Round',
        accessor: 'deactivationRound',
      },
      {
        Header: 'ThreeBoxSpace',
        accessor: 'threeBoxSpace',
        filter: 'fuzzyText',
        Filter: DefaultColumnFilter,
      },
      {
        Header: 'Delegator',
        accessor: 'delegator',
      },
      {
        Header: 'Total Score (0-10)',
        accessor: `scores.${region}`,
        mobile: true,
        sortDescFirst: true,
        defaultCanSort: true,
      },
      {
        Header: 'Success Rate (%)',
        accessor: `successRates.${region}`,
        mobile: false,
      },
      {
        Header: 'Latency Score (0-10)',
        accessor: `roundTripScores.${region}`,
        mobile: false,
      },
    ],
    [region],
  )

  function getRowValueByColumnID(row, columnID) {
    return row.values[columnID]
  }

  function compareBasic(a, b) {
    return a === b ? 0 : a > b ? 1 : -1
  }

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
        return rows.filter((row) => {
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
    disableSortRemove: true,
    autoResetPage: false,
    initialState: {
      sortBy: [
        {
          id: 'scores.global',
          desc: true,
        },
        {
          id: 'scores.mdw',
          desc: true,
        },
        {
          id: 'scores.fra',
          desc: true,
        },
        {
          id: 'scores.sin',
          desc: true,
        },
      ],
      hiddenColumns: [
        'activationRound',
        'deactivationRound',
        'threeBoxSpace',
        'global',
        'active',
        'delegator',
      ],
    },
    defaultColumn,
    filterTypes,
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    state: { pageIndex },
  }: any = useTable(tableOptions, useFilters, useSortBy, usePagination)

  const accountColumn = headerGroups[0].headers[1]

  return (
    <>
      <Flex
        sx={{
          position: 'relative',
          width: '100%',
          top: 0,
          zIndex: 10,
          flexDirection: 'column',
          alignItems: 'flex-start',
          pt: 0,
          pb: 3,
          ml: 0,
          mr: 0,
          justifyContent: 'space-between',
        }}
      >
        <Box>{accountColumn.render('Filter')}</Box>
      </Flex>
      <Box>
        <table
          sx={{
            display: 'table',
            width: '100%',
            minWidth: ['100%', '100%', '100%', 650],
            borderSpacing: '0',
            borderCollapse: 'collapse',
          }}
          {...getTableProps()}
        >
          <thead sx={{ display: 'table-header-group' }}>
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any, i) => (
                  <th
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'rgba(255,255,255,.05)',
                      pb: 1,
                      px: 3,
                      display: [
                        column.mobile ? 'table-cell' : 'none',
                        column.mobile ? 'table-cell' : 'none',
                        'table-cell',
                      ],
                      textTransform: 'uppercase',
                    }}
                    align="right"
                    key={i}
                  >
                    <Flex
                      sx={{
                        justifyContent:
                          i === 0 || i === 1 ? 'flex-start' : 'flex-end',
                      }}
                    >
                      <span
                        sx={{
                          fontSize: 10,
                        }}
                        {...column.getHeaderProps(
                          column.getSortByToggleProps({ title: '' }),
                        )}
                      >
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <MdKeyboardArrowDown sx={{ ml: '-12px' }} />
                            ) : (
                              <MdKeyboardArrowUp sx={{ ml: '-12px' }} />
                            )
                          ) : (
                            ''
                          )}
                        </span>
                        {column.render('Header')}
                      </span>
                      {renderTooltip(column.render('Header'))}
                    </Flex>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row: any, rowIndex) => {
              const orchestratorIndex = rowIndex + pageIndex * 10
              prepareRow(row)
              return (
                <tr
                  {...row.getRowProps()}
                  key={orchestratorIndex}
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
                    '&:hover': {
                      '.orchestratorLink': {
                        borderColor: 'text',
                        display: 'inlineBlock',
                        transition: 'all .3s',
                      },
                    },
                    '.status': {
                      borderColor: 'surface',
                    },
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
                          textAlign: i === 0 || i === 1 ? 'left' : 'right',
                          cursor:
                            i == 1
                              ? 'pointer'
                              : width < 1020
                              ? 'pointer'
                              : 'default',
                          width: i === 0 ? '10px' : 'auto',
                          fontSize: 1,
                          px: 3,
                          borderBottom: '1px solid',
                          borderColor: 'rgba(255,255,255,.05)',
                        }}
                        {...cell.getCellProps()}
                        onClick={() => {
                          if (i === 1 && width > 1020) {
                            Router.push(
                              '/accounts/[account]/[slug]',
                              `/accounts/${row.values.id}/campaign`,
                            )
                          }
                        }}
                        key={i}
                      >
                        {renderSwitch(rowIndex, pageIndex, cell, currentRound)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </Box>
      <Flex
        sx={{
          py: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <RiArrowLeftLine
          sx={{
            cursor: 'pointer',
            color: canPreviousPage ? 'primary' : 'text',
            opacity: canPreviousPage ? 1 : 0.5,
          }}
          onClick={() => {
            if (canPreviousPage) {
              previousPage()
            }
          }}
        />
        <Box sx={{ fontSize: 1, mx: 2 }}>
          Page <span sx={{ fontFamily: 'monospace' }}>{pageIndex + 1}</span> of{' '}
          <span sx={{ fontFamily: 'monospace' }}>{pageCount}</span>
        </Box>
        <RiArrowRightLine
          sx={{
            cursor: 'pointer',
            color: canNextPage ? 'primary' : 'text',
            opacity: canNextPage ? 1 : 0.5,
          }}
          onClick={() => {
            if (canNextPage) {
              nextPage()
            }
          }}
        />
      </Flex>
    </>
  )
  function renderTooltip(title) {
    switch (title) {
      case 'Success Rate (%)':
        return (
          <>
            <ReactTooltip
              id="tooltip-success-rate"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Help
              data-tip="The percentage of video segments sent by a broadcaster that are successfully transcoded. See the FAQ for more details on how this metric is calculated."
              data-for="tooltip-success-rate"
              sx={{
                cursor: 'pointer',
                position: 'relative',
                ml: 1,
                top: '1px',
                width: 12,
                height: 12,
              }}
            />
          </>
        )
      case 'Latency Score (0-10)':
        return (
          <>
            <ReactTooltip
              html={true}
              id="tooltip-latency-score"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Help
              data-tip='<span>The measurement of the time to return transcoded results to a broadcaster relative to the duration of a segment. See <a href="http://livepeer.readthedocs.io/en/latest/reference/leaderboard_faq.html" rel="noopener noreferrer" target="_blank">the FAQ</a> for more details on how this metric is calculated.</span>'
              data-for="tooltip-latency-score"
              sx={{
                cursor: 'pointer',
                position: 'relative',
                ml: 1,
                top: '1px',
                width: 12,
                height: 12,
              }}
            />
          </>
        )
      case 'Total Score (0-10)':
        return (
          <>
            <ReactTooltip
              html={true}
              id="tooltip-score"
              className="tooltip"
              place="bottom"
              type="dark"
              effect="solid"
              delayHide={200}
              delayUpdate={500}
            />
            <Help
              data-tip='<span>The measurement of the overall quality and reliability of service provided to a broadcaster based on success rate and latency scores. See <a href="http://livepeer.readthedocs.io/en/latest/reference/leaderboard_faq.html" rel="noopener noreferrer" target="_blank">the FAQ</a> for more details on how this metric is calculated.</span>'
              data-for="tooltip-score"
              sx={{
                cursor: 'pointer',
                position: 'relative',
                ml: 1,
                top: '1px',
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

  function renderSwitch(rowIndex, pageIndex, cell, currentRound) {
    switch (cell.column.Header) {
      case '#':
        return parseInt(rowIndex) + 1 + pageIndex * 10
      case 'Orchestrator':
        const active =
          cell.row.values.activationRound <= currentRound.id &&
          cell.row.values.deactivationRound > currentRound.id
        return (
          <AccountCell
            active={active}
            threeBoxSpace={cell.row.values.threeBoxSpace}
            address={cell.value}
          />
        )
      case 'Success Rate (%)':
        if (typeof cell.value === 'undefined' || cell.value === null)
          return null
        return (
          <span sx={{ fontFamily: 'monospace' }}>{cell.value.toFixed(2)}%</span>
        )
      case 'Latency Score (0-10)':
        if (typeof cell.value === 'undefined' || cell.value === null)
          return null
        return (
          <span sx={{ fontFamily: 'monospace' }}>{(cell.value / 10).toFixed(2)}</span>
        )
      case 'Total Score (0-10)':
        if (typeof cell.value === 'undefined' || cell.value === null)
          return null
        return (
          <span sx={{ fontFamily: 'monospace' }}>{(cell.value / 10).toFixed(2)}</span>
        )
      default:
        return null
    }
  }
}

export default PerformanceTable
